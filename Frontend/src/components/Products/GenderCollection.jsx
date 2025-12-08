import React from 'react'
import menCollectionImage from '../../assets/mens-collection.jpg'
import womenCollectionImage from '../../assets/womens-collection.jpg'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const GenderCollection = () => {
  return (
    <section className='py-8 px-4 lg:px-5'>
        <div className='container mx-auto flex flex-col md:flex-row gap-8'>
            {/* {Women's collection} */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='relative flex-1 group overflow-hidden rounded-lg shadow-lg'
            >
                <img 
                    src={womenCollectionImage} 
                    alt="Women's collection" 
                    className='w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105' 
                />
                <div className='absolute bottom-8 left-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-6 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>Women's Collection</h2>
                    <Link to="/collections/all?gender=Women" className="text-gray-900 dark:text-white underline hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Shop Now</Link>
                </div>
            </motion.div>
            {/* {Men's collection} */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='relative flex-1 group overflow-hidden rounded-lg shadow-lg'
            >
                <img 
                    src={menCollectionImage} 
                    alt="Men's collection" 
                    className='w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105' 
                />
                <div className='absolute bottom-8 left-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-6 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>Men's Collection</h2>
                    <Link to="/collections/all?gender=Men" className="text-gray-900 dark:text-white underline hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Shop Now</Link>
                </div>
            </motion.div>

        </div>

    </section>
  )
}

export default GenderCollection