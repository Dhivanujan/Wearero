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
                  <div className='bg-white dark:bg-gray-800 rounded-lg overflow-hidden relative'>
                      <div className='w-full h-[450px] overflow-hidden relative bg-gray-100 dark:bg-gray-700'>
                          <img
                              src={imageUrl}
                              alt={imageAlt}
                              className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out'/>
                           <button 
                              onClick={(e) => handleWishlistClick(e, product._id)}
                              className={`absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 backdrop-blur-sm text-black hover:bg-white hover:text-red-500 transition-all shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300`}
                          >
                              <i className={`ri-heart-${isInWishlist ? 'fill' : 'line'} text-lg ${isInWishlist ? 'text-red-500' : ''}`}></i>
                          </button>
                      </div>
                      <div className='p-4 pt-5'>
                        <h3 className='text-md font-medium text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors truncate font-heading tracking-wide'>{product.name}</h3>
                        <div className='flex items-center justify-between'>
                            <p className='text-gray-900 dark:text-gray-100 font-bold text-lg'>${product.price}</p>
                            <div className='flex items-center space-x-1'>
                                <i className="ri-star-fill text-yellow-400 text-sm"></i>
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