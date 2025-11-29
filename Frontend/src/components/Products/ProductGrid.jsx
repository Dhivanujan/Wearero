import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

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
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/product/${product._id}`} className='block group'>
                  <div className='bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300'>
                      <div className='w-full h-96 mb-4 overflow-hidden rounded-lg relative'>
                          <img
                              src={imageUrl}
                              alt={imageAlt}
                              className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300'/>
                      </div>
                      <h3 className='text-sm mb-2 font-semibold text-gray-800'>{product.name}</h3>
                      <p className='text-gray-500 font-medium text-sm tracking-tighter'>${product.price}</p>
                  </div>
              </Link>
            </motion.div>
        )})}
    </div>
  )
}

export default ProductGrid