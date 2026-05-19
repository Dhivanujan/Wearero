import { API_BASE_URL } from './api';

/**
 * Upload a single image to Cloudinary via the backend API.
 * @param {File} file - The image file to upload
 * @param {string} token - JWT auth token
 * @returns {Promise<{imageUrl: string, rawUrl: string, publicId: string}>}
 */
export const uploadImage = async (file, token) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to upload image');
  }

  return response.json();
};

/**
 * Upload multiple images to Cloudinary via the backend API.
 * @param {File[]} files - Array of image files (max 5)
 * @param {string} token - JWT auth token
 * @returns {Promise<{images: Array<{imageUrl: string, rawUrl: string, publicId: string}>}>}
 */
export const uploadMultipleImages = async (files, token) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const response = await fetch(`${API_BASE_URL}/api/upload/multiple`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to upload images');
  }

  return response.json();
};

export const cloudinaryUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;

  const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options;
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  let rest = parts[1];
  const restParts = rest.split('/');
  if (restParts.length > 1) {
    const firstSegment = restParts[0];
    const isVersion = /^v\d+$/.test(firstSegment);
    const isTransformation = /c_[a-z]+|f_[a-z]+|q_[a-z0-9]+|w_\d+|h_\d+|dpr_[a-z0-9]+/.test(firstSegment);
    if (!isVersion && isTransformation) {
      restParts.shift();
      rest = restParts.join('/');
    }
  }

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    `c_${crop}`,
    width ? `w_${width}` : null,
    height ? `h_${height}` : null,
    'dpr_auto',
  ].filter(Boolean).join(',');

  return `${parts[0]}/upload/${transforms}/${rest}`;
};
