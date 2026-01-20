import React from 'react'
import { RiDeleteBin3Line } from 'react-icons/ri'
import { useCart } from '../../context/CartContext';
import { API_BASE_URL } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const CartContents = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();

  if (loading) {
    return (
      <div className='space-y-4'>
        {[1, 2].map((i) => (
          <div key={i} className='flex items-center p-4 animate-pulse'>
            <div className='w-20 h-24 bg-gray-200 dark:bg-gray-700 rounded-xl'></div>
            <div className='ml-4 flex-1'>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4'>
          <svg className='w-10 h-10 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
          </svg>
        </div>
        <p className='text-gray-500 dark:text-gray-400 font-medium'>Your cart is empty</p>
        <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>Add items to get started</p>
      </div>
    );
  }

  return (
    <div className='space-y-1'>
      <AnimatePresence>
        {cart.products.map((product, index) => {
          const imageUrl = product.image?.startsWith('http') ? product.image : `${API_BASE_URL}${product.image}`;
          return (
            <motion.div 
              key={`${product.productId}-${product.size}-${product.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className='group flex items-start p-4 bg-white dark:bg-gray-900 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300'
            >
              {/* Image */}
              <div className='relative flex-shrink-0'>
                <img 
                  src={imageUrl} 
                  alt={product.name} 
                  className='w-20 h-24 object-cover rounded-xl shadow-sm' 
                />
                <span className='absolute -top-1 -right-1 w-5 h-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-full flex items-center justify-center'>
                  {product.quantity}
                </span>
              </div>

              {/* Product Details */}
              <div className='ml-4 flex-1 min-w-0'>
                <h3 className='font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1'>
                  {product.name}
                </h3>
                <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3'>
                  <span className='inline-flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full'>
                    {product.size}
                  </span>
                  <span className='inline-flex items-center gap-1'>
                    <span 
                      className='w-3 h-3 rounded-full ring-1 ring-gray-200 dark:ring-gray-700'
                      style={{ backgroundColor: product.color?.toLowerCase() }}
                    ></span>
                    {product.color}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className='flex items-center justify-between'>
                  <div className='inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-full'>
                    <button 
                      onClick={() => updateQuantity(product.productId, product.size, product.color, product.quantity - 1)}
                      className='w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4' />
                      </svg>
                    </button>
                    <span className='w-8 text-center text-sm font-semibold text-gray-900 dark:text-white'>
                      {product.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(product.productId, product.size, product.color, product.quantity + 1)}
                      className='w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                      </svg>
                    </button>
                  </div>

                  <div className='flex items-center gap-3'>
                    <p className='font-bold text-gray-900 dark:text-white'>
                      ${(product.price * product.quantity).toLocaleString()}
                    </p>
                    <button 
                      onClick={() => removeFromCart(product.productId, product.size, product.color)}
                      className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100'
                    >
                      <RiDeleteBin3Line className='h-4 w-4'/>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  )
}

export default CartContents
