const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Reusable storage for multer uploads
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'wearero_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
    ],
  },
});

/**
 * Build an optimized Cloudinary URL with responsive transformations.
 * @param {string} url - The raw Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} Optimized URL
 */
const getOptimizedUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;

  const {
    width = 'auto',
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  // Extract the upload path and insert transformations
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    `c_${crop}`,
    width !== 'auto' ? `w_${width}` : 'w_auto',
    height ? `h_${height}` : null,
    'dpr_auto',
  ]
    .filter(Boolean)
    .join(',');

  return `${parts[0]}/upload/${transforms}/${parts[1]}`;
};

/**
 * Preset URL builders for common sizes used across the app.
 */
const imagePresets = {
  thumbnail: (url) => getOptimizedUrl(url, { width: 80, height: 80, crop: 'fill' }),
  productCard: (url) => getOptimizedUrl(url, { width: 400, height: 533, crop: 'fill' }),
  productDetail: (url) => getOptimizedUrl(url, { width: 800, height: 1067, crop: 'fill' }),
  hero: (url) => getOptimizedUrl(url, { width: 1920, crop: 'fill' }),
};

module.exports = { cloudinary, storage, getOptimizedUrl, imagePresets };
