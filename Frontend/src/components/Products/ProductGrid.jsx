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
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {safeProducts.length === 0 && (
            <p className='col-span-full text-center text-gray-500 dark:text-gray-400'>No products to display yet.</p>
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
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/product/${product._id}`} className='block group'>
                  <div className='bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 relative border border-gray-100 dark:border-gray-700'>
                      <button 
                          onClick={(e) => handleWishlistClick(e, product._id)}
                          className={`absolute top-3 right-3 z-10 p-2 rounded-full ${isInWishlist ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-600'} hover:bg-red-100 hover:text-red-500 transition-all shadow-md transform hover:scale-110`}
                      >
                          <i className={`ri-heart-${isInWishlist ? 'fill' : 'line'} text-lg`}></i>
                      </button>
                      <div className='w-full h-[400px] overflow-hidden relative bg-gray-100 dark:bg-gray-700'>
                          <img
                              src={imageUrl}
                              alt={imageAlt}
                              className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out'/>
                      </div>
                      <div className='p-4'>
                        <h3 className='text-base font-medium text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors truncate font-heading'>{product.name}</h3>
                        <div className='flex items-center justify-between mt-2'>
                            <p className='text-gray-900 dark:text-gray-100 font-bold text-lg'>${product.price}</p>
                            <div className='flex items-center'>
                                <i className="ri-star-fill text-yellow-400 text-sm mr-1"></i>
                                <span className='text-xs text-gray-500 dark:text-gray-400'>({product.rating || 0})</span>
                            </div>
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