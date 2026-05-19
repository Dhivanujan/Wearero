import React from "react";

const LazyImage = ({
  src,
  alt = "",
  className = "",
  fallback = "https://placehold.co/400x500/f3f4f6/9ca3af?text=No+Image",
}) => {
  return (
    <img
      src={src || fallback}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.src = fallback;
      }}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};

export default LazyImage;