import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineEye, HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { API_BASE_URL, resolveImageUrl } from "../../lib/api";
import LazyImage from "../Common/LazyImage";
import QuickViewModal from "./QuickViewModal";

const ProductGrid = ({ products, loading }) => {
  const { user, token, refreshProfile } = useAuth();
  const safeProducts = Array.isArray(products) ? products : [];
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleWishlistClick = useCallback(
    async (e, productId) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user) {
        toast.error("Please login to add to wishlist");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/users/wishlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });
        if (response.ok) {
          const data = await response.json();
          toast.success(data.message);
          await refreshProfile();
        } else {
          toast.error("Failed to update wishlist");
        }
      } catch {
        toast.error("Error updating wishlist");
      }
    },
    [user, token, refreshProfile],
  );

  const handleQuickView = useCallback((e, product) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {safeProducts.length === 0 && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <HiOutlineEye className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              No products found
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        )}

        {safeProducts.map((product, index) => {
          const imageUrl = resolveImageUrl(product.images?.[0]?.url);
          const imageAlt = product.images?.[0]?.altText || product.name;
          const isInWishlist = user?.wishlist?.includes(product._id);
          const isNew =
            product.createdAt &&
            Date.now() - new Date(product.createdAt).getTime() <
              7 * 24 * 60 * 60 * 1000;
          const hasDiscount =
            product.discountPrice && product.discountPrice < product.price;

          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className="group"
            >
              <Link to={`/product/${product._id}`} className="block">
                <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-card-hover dark:hover:shadow-2xl ring-1 ring-gray-100 dark:ring-gray-800 hover:ring-gray-200 dark:hover:ring-gray-700 hover:-translate-y-1">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-800">
                    {/* IMAGE */}
                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1.5">
                      {isNew && (
                        <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wide shadow-sm">
                          New
                        </span>
                      )}
                      {hasDiscount && (
                        <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] md:text-xs font-bold rounded-full shadow-sm">
                          -
                          {Math.round(
                            ((product.price - product.discountPrice) /
                              product.price) *
                              100,
                          )}
                          %
                        </span>
                      )}
                    </div>

                    {/* Rating Badge */}
                    {product.rating > 0 && (
                      <div className="absolute top-2 right-2 md:top-3 md:right-3 flex items-center space-x-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2 py-1 md:px-2.5 md:py-1.5 rounded-full shadow-sm">
                        <span className="text-amber-400 text-xs">★</span>
                        <span className="text-[10px] md:text-xs font-semibold text-gray-800 dark:text-gray-200">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleWishlistClick(e, product._id)}
                      className={`absolute bottom-2 right-2 md:bottom-3 md:right-3 z-20 p-2 md:p-2.5 rounded-full backdrop-blur-md transition-all duration-300 transform ${
                        isInWishlist
                          ? "bg-red-500/90 text-white scale-100"
                          : "bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                      } hover:scale-110 shadow-lg`}
                    >
                      {isInWishlist ? (
                        <HiHeart className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        <HiOutlineHeart className="w-4 h-4 md:w-5 md:h-5" />
                      )}
                    </button>

                    {/* Quick View Button */}
                    <button
                      onClick={(e) => handleQuickView(e, product)}
                      className="absolute bottom-2 left-2 right-14 md:bottom-3 md:left-3 md:right-16 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hidden md:flex"
                    >
                      <span className="w-full py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl text-xs font-medium text-gray-900 dark:text-white shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5">
                        <HiOutlineEye className="w-4 h-4" /> Quick View
                      </span>
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 md:p-4">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white mb-1.5 line-clamp-2 group-hover:text-accent dark:group-hover:text-accent-light transition-colors duration-300">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline space-x-1.5">
                        <p className="text-sm md:text-base font-bold text-gray-900 dark:text-white">
                          ${hasDiscount ? product.discountPrice : product.price}
                        </p>
                        {hasDiscount && (
                          <p className="text-[10px] md:text-xs text-gray-400 line-through">
                            ${product.price}
                          </p>
                        )}
                      </div>

                      {product.colors?.length > 0 && (
                        <div className="flex items-center -space-x-1">
                          {product.colors.slice(0, 3).map((color, idx) => (
                            <span
                              key={idx}
                              className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full ring-2 ring-white dark:ring-gray-900 shadow-sm"
                              style={{ backgroundColor: color.toLowerCase() }}
                            />
                          ))}
                          {product.colors.length > 3 && (
                            <span className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-900 flex items-center justify-center text-[7px] font-bold text-gray-500">
                              +{product.colors.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
};

export default React.memo(ProductGrid);
