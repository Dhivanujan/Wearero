import React from 'react'
import { RiDeleteBin3Line } from 'react-icons/ri'

const CartContents = () => {

  const cartProducts = [
    { ProductId:1, name: "T-Shirt", size: "M", color: "red", price:100, quantity:2, image:"https://picsum.photos/200?random=1" },
    { productId:2, name: "Jeans", size: "L", color: "Blue", price:200, quantity:1, image:"https://picsum.photos/200?random=2" }
  ]

  return (
    <div className='max-w-3xl mx-auto'>
      {cartProducts.map((product, index) => (
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
              <button className='border rounded text-xl px-2 py-1 font-medium'>-</button>
              <span className='mx-3'>{product.quantity}</span>
              <button className='border rounded text-xl px-2 py-1 font-medium'>+</button>
            </div>
          </div>

          {/* Price + Delete */}
          <div className='flex flex-col items-end ml-4'>
            <p className='font-medium text-lg'>$ {product.price.toLocaleString()}</p>
            <button className='mt-2'>
              <RiDeleteBin3Line className='h-6 w-6 text-red-600'/>
            </button>
          </div>

        </div>
      ))}
    </div>
  )
}

export default CartContents
