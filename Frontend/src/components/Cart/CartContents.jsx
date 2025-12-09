import React from 'react'
import { RiDeleteBin3Line } from 'react-icons/ri'
import { useCart } from '../../context/CartContext';
import { API_BASE_URL } from '../../lib/api';

const CartContents = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();

  if (loading) return <div>Loading...</div>;

  if (!cart || !cart.products || cart.products.length === 0) {
      return <div className='text-center text-gray-500 dark:text-gray-400'>Your cart is empty</div>;
  }

  return (
    <div className='max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
      {cart.products.map((product, index) => {
        const imageUrl = product.image?.startsWith('http') ? product.image : `${API_BASE_URL}${product.image}`;
        return (
        <div key={index} className='flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors'>
          
          <div className='flex items-center flex-1'>
            {/* Image */}
            <img src={imageUrl} alt={product.name} className='w-20 h-24 object-cover rounded-lg shadow-sm mr-6' />

            {/* Product Details */}
            <div>
              <h3 className='font-semibold text-lg text-gray-900 dark:text-white font-heading'>{product.name}</h3>
              <div className='flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400'>
                <span className='flex items-center'><span className='w-2 h-2 rounded-full bg-gray-300 mr-2'></span>Size: {product.size}</span>
                <span className='flex items-center'><span className='w-2 h-2 rounded-full bg-gray-300 mr-2'></span>Color: {product.color}</span>
              </div>
              <div className='mt-2 font-medium text-gray-900 dark:text-white'>$ {product.price.toLocaleString()}</div>
            </div>
          </div>

          {/* Quantity & Delete */}
          <div className='flex items-center space-x-6'>
            <div className='flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1'>
              <button 
                onClick={() => updateQuantity(product.productId, product.size, product.color, product.quantity - 1)}
                className='text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors p-1'>-</button>
              <span className='mx-3 text-sm font-medium text-gray-900 dark:text-white w-4 text-center'>{product.quantity}</span>
              <button 
                onClick={() => updateQuantity(product.productId, product.size, product.color, product.quantity + 1)}
                className='text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors p-1'>+</button>
            </div>
            
            <div className='text-right min-w-[80px]'>
                <p className='font-bold text-lg text-gray-900 dark:text-white'>$ {(product.price * product.quantity).toLocaleString()}</p>
            </div>

            <button 
            onClick={() => removeFromCart(product.productId, product.size, product.color)}
            className='text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20'>
              <RiDeleteBin3Line className='h-5 w-5'/>
            </button>
          </div>
        </div>
      )})}
    </div>
  )
}

export default CartContents
