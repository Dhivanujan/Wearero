import React from 'react';

const ProductCardSkeleton = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          {/* Image skeleton */}
          <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-700/20 to-transparent shimmer" />
          </div>
          {/* Text skeleton */}
          <div className="space-y-2 px-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4" />
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-lg w-20" />
              <div className="flex -space-x-1">
                {[1, 2, 3].map((c) => (
                  <div key={c} className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-800 ring-2 ring-white dark:ring-gray-900" />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default React.memo(ProductCardSkeleton);
