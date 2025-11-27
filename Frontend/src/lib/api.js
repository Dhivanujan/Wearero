const normalizeBaseUrl = (url) => {
  if (!url) return null;
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const API_BASE_URL =
  normalizeBaseUrl(import.meta.env.VITE_API_URL) || 'http://localhost:3000';

export const buildApiUrl = (path) => {
  if (!path) {
    return API_BASE_URL;
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
