import React, { useState, useRef, useEffect } from 'react';
import { cloudinaryUrl } from '../../lib/uploadService';

/**
 * LazyImage — A performant image component with:
 * - Intersection Observer lazy loading
 * - Cloudinary responsive transformations
 * - Blur-up placeholder
 * - Error fallback
 */
const LazyImage = ({
  src,
  alt = '',
  className = '',
  width,
  height,
  crop = 'fill',
  fallback = 'https://placehold.co/400x500/f3f4f6/9ca3af?text=No+Image',
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  // Generate optimized URL
  const optimizedSrc = src ? cloudinaryUrl(src, { width, height, crop }) : fallback;

  // Low-quality placeholder for blur-up
  const placeholderSrc = src
    ? cloudinaryUrl(src, { width: 30, height: 40, crop, quality: 10 })
    : null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} {...props}>
      {/* Blur placeholder */}
      {placeholderSrc && !loaded && !error && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg"
        />
      )}

      {/* Actual image */}
      {isVisible && (
        <img
          src={error ? fallback : optimizedSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Skeleton while not visible */}
      {!isVisible && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
    </div>
  );
};

export default React.memo(LazyImage);
