import React, { useState, useEffect } from 'react'
import { RiDeleteBin3Line } from 'react-icons/ri'

const CartContents = () => {
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    const userId = localStorage.getItem('userId');
    const guestId = localStorage.getItem('guestId');
    let url = 'http://localhost:3000/api/cart';

    if (userId) {
      url += `?userId=${userId}`;
    } else if (guestId) {
      url += `?guestId=${guestId}`;
    } else {
      return;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setCart(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, size, color, newQuantity) => {
    const userId = localStorage.getItem('userId');
    const guestId = localStorage.getItem('guestId');
    
    try {
        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, size, color, quantity: newQuantity, userId, guestId })
        });
        if (response.ok) {
            fetchCart();
        }
    } catch (error) {
        console.error("Error updating cart:", error);
    }
  };

  const handleRemoveItem = async (productId, size, color) => {
    const userId = localStorage.getItem('userId');
    const guestId = localStorage.getItem('guestId');

    try {
        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, size, color, userId, guestId })
        });
        if (response.ok) {
            fetchCart();
        }
    } catch (error) {
        console.error("Error removing item:", error);
    }
  };

  if (!cart || !cart.products || cart.products.length === 0) {
      return <div className='text-center text-gray-500'>Your cart is empty</div>;
  }

  return (
    <div className='max-w-3xl mx-auto'>
      {cart.products.map((product, index) => (
        <div key={index} className='flex items-start justify-between py-4 border-b'>
          
          {/* Image */}
          <img src={product.image} alt={product.name} className='w-24 h-24 object-cover rounded mr-4' />

          {/* Product Details */}
          <div className='flex-1'>
            <h3 className='font-medium text-lg'>{product.name}</h3>
            <p className='text-sm text-gray-500 mt-1'>
              size: {product.size} | color: {product.color}
            </p>
            <div className='flex items-center mt-3'>
              <button 
                onClick={() => handleUpdateQuantity(product.productId, product.size, product.color, product.quantity - 1)}
                className='border rounded text-xl px-2 py-1 font-medium'>-</button>
              <span className='mx-3'>{product.quantity}</span>
              <button 
                onClick={() => handleUpdateQuantity(product.productId, product.size, product.color, product.quantity + 1)}
                className='border rounded text-xl px-2 py-1 font-medium'>+</button>
            </div>
          </div>

          {/* Price + Delete */}
          <div className='flex flex-col items-end ml-4'>
            <p className='font-medium text-lg'>$ {product.price.toLocaleString()}</p>
            <button 
                onClick={() => handleRemoveItem(product.productId, product.size, product.color)}
                className='mt-2'>
              <RiDeleteBin3Line className='h-6 w-6 text-red-600'/>
            </button>
          </div>

        </div>
      ))}
    </div>
  )
}

export default CartContents
