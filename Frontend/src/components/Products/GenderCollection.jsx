import React from 'react'
import menCollectionImage from '../../assets/mens-collection.jpg'
import womenCollectionImage from '../../assets/womens-collection.jpg'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowLongRight } from "react-icons/hi2";

const GenderCollection = () => {
  return (
    <section className='py-16 px-4 lg:px-8'>
        <div className='container mx-auto flex flex-col md:flex-row gap-8'>
            {/* {Women's collection} */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='relative flex-1 group overflow-hidden rounded-3xl shadow-lg cursor-pointer'
            >
                <img 
                    src={womenCollectionImage} 
                    alt="Women's collection" 
                    className='w-full h-[600px] object-cover transition-transform duration-700 ease-out group-hover:scale-110' 
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 transition-opacity duration-300' />
                <div className='absolute bottom-8 left-8 p-4'>
                    <h2 className='text-4xl font-bold text-white mb-3 tracking-tight font-heading'>Women's Collection</h2>
                    <Link 
                        to="/collections/all?gender=Women" 
                        className="inline-flex items-center text-white font-medium text-lg hover:text-white/80 transition-colors gap-2"
                    >
                        Shop Now <HiArrowLongRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                </div>
            </motion.div>
            
            {/* {Men's collection} */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='relative flex-1 group overflow-hidden rounded-3xl shadow-lg cursor-pointer'
            >
                <img 
                    src={menCollectionImage} 
                    alt="Men's collection" 
                    className='w-full h-[600px] object-cover transition-transform duration-700 ease-out group-hover:scale-110' 
                />
                 <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 transition-opacity duration-300' />
                <div className='absolute bottom-8 left-8 p-4'>
                    <h2 className='text-4xl font-bold text-white mb-3 tracking-tight font-heading'>Men's Collection</h2>
                    <Link 
                        to="/collections/all?gender=Men" 
                        className="inline-flex items-center text-white font-medium text-lg hover:text-white/80 transition-colors gap-2"
                    >
                        Shop Now <HiArrowLongRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                </div>
            </motion.div>

        </div>

    </section>
  )
}

export default GenderCollection