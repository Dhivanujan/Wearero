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
    <div className='max-w-3xl mx-auto'>
      {cart.products.map((product, index) => {
        const imageUrl = product.image?.startsWith('http') ? product.image : `${API_BASE_URL}${product.image}`;
        return (
        <div key={index} className='flex items-start justify-between py-4 border-b border-gray-200 dark:border-gray-700'>
          
          {/* Image */}
          <img src={imageUrl} alt={product.name} className='w-24 h-24 object-cover rounded mr-4' />

          {/* Product Details */}
          <div className='flex-1'>
            <h3 className='font-medium text-lg text-black dark:text-white'>{product.name}</h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              size: {product.size} | color: {product.color}
            </p>
            <div className='flex items-center mt-3'>
              <button 
                onClick={() => updateQuantity(product.productId, product.size, product.color, product.quantity - 1)}
                className='border border-gray-300 dark:border-gray-600 rounded text-xl px-2 py-1 font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>-</button>
              <span className='mx-3 text-black dark:text-white'>{product.quantity}</span>
              <button 
                onClick={() => updateQuantity(product.productId, product.size, product.color, product.quantity + 1)}
                className='border border-gray-300 dark:border-gray-600 rounded text-xl px-2 py-1 font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>+</button>
            </div>
          </div>

          {/* Price + Delete */}
          <div className='flex flex-col items-end'>
            <p className='font-semibold mb-2 text-black dark:text-white'>$ {product.price.toLocaleString()}</p>
            <button 
            onClick={() => removeFromCart(product.productId, product.size, product.color)}
            className='text-red-500 hover:text-red-700'>
              <RiDeleteBin3Line className='h-6 w-6'/>
            </button>
          </div>
        </div>
      )})}
    </div>
  )
}

export default CartContents
