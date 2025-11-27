import React from 'react'
import { Link } from 'react-router-dom'

const ProductGrid = ({products}) => {
    const safeProducts = Array.isArray(products) ? products : [];
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {safeProducts.length === 0 && (
            <p className='col-span-full text-center text-gray-500'>No products to display yet.</p>
        )}
                {safeProducts.map((product, index) => {
            const imageUrl = product.images?.[0]?.url || 'https://picsum.photos/400/500?blur=4';
            const imageAlt = product.images?.[0]?.altText || product.name;
            return (
            <Link key={index} to={`/product/${product._id}`} className='block'>
                <div className='bg-white p-4 rounded-lg'>
                    <div className='w-full h-96 mb-4'>
                        <img
                            src={imageUrl}
                            alt={imageAlt}
                            className='w-full h-full object-cover rounded-lg'/>
                    </div>
                    <h3 className='text-sm mb-2'>{product.name}</h3>
                    <p className='text-gray-500 font-medium text-sm tracking-tighter'>${product.price}</p>
                </div>
            </Link>
        )})}
    </div>
  )
}

export default ProductGrid