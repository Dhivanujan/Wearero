import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { API_BASE_URL } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'

const ProductGrid = ({products}) => {
    const { user, token, refreshProfile } = useAuth();
    const safeProducts = Array.isArray(products) ? products : [];

    const handleWishlistClick = async (e, productId) => {
        e.preventDefault();
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
        } catch (error) {
            console.error(error);
            toast.error("Error updating wishlist");
        }
    };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
        {safeProducts.length === 0 && (
            <p className='col-span-full text-center text-gray-500 dark:text-gray-400 py-12'>No products to display yet.</p>
        )}
        {safeProducts.map((product, index) => {
            const rawUrl = product.images?.[0]?.url;
            const imageUrl = rawUrl 
                ? (rawUrl.startsWith('http') ? rawUrl : `${API_BASE_URL}${rawUrl}`)
                : 'https://picsum.photos/400/500?blur=4';
            const imageAlt = product.images?.[0]?.altText || product.name;
            const isInWishlist = user?.wishlist?.includes(product._id);

            return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className='group'
            >
              <Link to={`/product/${product._id}`} className='block'>
                  {/* Card Container */}
                  <div className='bg-white dark:bg-gray-900 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-card-hover dark:hover:shadow-2xl ring-1 ring-gray-100 dark:ring-gray-800 hover:ring-gray-200 dark:hover:ring-gray-700'>
                      {/* Image Container */}
                      <div className='relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-800'>
                          <img
                              src={imageUrl}
                              alt={imageAlt}
                              className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out'
                          />
                          
                          {/* Overlay on Hover */}
                          <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                          
                          {/* Wishlist Button */}
                          <button 
                              onClick={(e) => handleWishlistClick(e, product._id)}
                              className={`absolute top-4 right-4 z-20 p-3 rounded-full backdrop-blur-md transition-all duration-300 transform ${
                                isInWishlist 
                                  ? 'bg-red-500/90 text-white scale-100' 
                                  : 'bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                              } hover:scale-110 shadow-lg`}
                          >
                              <i className={`ri-heart-${isInWishlist ? 'fill' : 'line'} text-lg`}></i>
                          </button>

                          {/* Quick View Badge */}
                          <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
                            <span className='inline-flex items-center justify-center w-full py-2.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl text-sm font-medium text-gray-900 dark:text-white shadow-lg'>
                              Quick View
                            </span>
                          </div>

                          {/* Rating Badge */}
                          {product.rating > 0 && (
                            <div className='absolute top-4 left-4 flex items-center space-x-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-sm'>
                              <i className="ri-star-fill text-amber-400 text-sm"></i>
                              <span className='text-xs font-semibold text-gray-800 dark:text-gray-200'>{product.rating.toFixed(1)}</span>
                            </div>
                          )}
                      </div>

                      {/* Product Info */}
                      <div className='p-5'>
                        <h3 className='text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-accent dark:group-hover:text-accent-light transition-colors duration-300'>
                          {product.name}
                        </h3>
                        
                        <div className='flex items-center justify-between'>
                            <div className='flex items-baseline space-x-2'>
                              <p className='text-lg font-bold text-gray-900 dark:text-white'>${product.price}</p>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <p className='text-sm text-gray-400 line-through'>${product.originalPrice}</p>
                              )}
                            </div>
                            
                            {/* Color Options Preview */}
                            {product.colors && product.colors.length > 0 && (
                              <div className='flex items-center -space-x-1'>
                                {product.colors.slice(0, 3).map((color, idx) => (
                                  <span 
                                    key={idx}
                                    className='w-4 h-4 rounded-full ring-2 ring-white dark:ring-gray-900 shadow-sm'
                                    style={{ backgroundColor: color.toLowerCase() }}
                                  ></span>
                                ))}
                                {product.colors.length > 3 && (
                                  <span className='w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-900 flex items-center justify-center text-[8px] font-bold text-gray-600 dark:text-gray-400'>
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
        )})}
    </div>
  )
}

export default ProductGrid