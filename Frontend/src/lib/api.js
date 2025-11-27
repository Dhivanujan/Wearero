const normalizeBaseUrl = (url) => {
  if (!url) return null;
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const inferLocalApiUrl = () => {
  const DEFAULT_PORT = 9000;
  if (typeof window !== 'undefined') {
    const protocol = window.location?.protocol || 'http:';
    const hostname = window.location?.hostname || 'localhost';
    return `${protocol}//${hostname}:${DEFAULT_PORT}`;
  }

  return `http://localhost:${DEFAULT_PORT}`;
};

const FALLBACK_URLS = [inferLocalApiUrl(), 'http://localhost:3000'];

const resolvedBaseUrl =
  normalizeBaseUrl(import.meta.env.VITE_API_URL) ||
  FALLBACK_URLS.map(normalizeBaseUrl).find(Boolean);

if (!import.meta.env.VITE_API_URL) {
  console.warn(
    '[api] VITE_API_URL is not set. Falling back to',
    resolvedBaseUrl
  );
}

export const API_BASE_URL = resolvedBaseUrl;

export const buildApiUrl = (path) => {
  if (!path) {
    return API_BASE_URL;
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
