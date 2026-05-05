const express = require('express');
const multer = require('multer');
const { storage, getOptimizedUrl } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// @route POST /api/upload
// @desc  Upload a single image to Cloudinary
// @access Private/Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const rawUrl = req.file.path;
  const optimizedUrl = getOptimizedUrl(rawUrl, { width: 800, quality: 'auto', format: 'auto' });

  res.json({
    message: 'Image uploaded successfully',
    imageUrl: optimizedUrl,
    rawUrl,
    publicId: req.file.filename,
  });
});

// @route POST /api/upload/multiple
// @desc  Upload multiple images to Cloudinary (max 5)
// @access Private/Admin
router.post('/multiple', protect, admin, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const images = req.files.map((file) => ({
    imageUrl: getOptimizedUrl(file.path, { width: 800, quality: 'auto', format: 'auto' }),
    rawUrl: file.path,
    publicId: file.filename,
  }));

  res.json({ message: `${images.length} image(s) uploaded successfully`, images });
});

// Multer error handling
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds the 5MB limit' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Too many files. Maximum is 5.' });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
