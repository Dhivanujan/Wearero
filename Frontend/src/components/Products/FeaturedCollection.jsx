import React from 'react'
import { Link } from 'react-router-dom'
import featured from '../../assets/featured.jpg'
import { motion } from 'framer-motion'

const FeaturedCollection = () => {
  return (
    <section className='py-16 md:py-24 px-4 lg:px-8'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className='container mx-auto flex flex-col-reverse lg:flex-row items-center bg-gray-50 dark:bg-gray-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg'
      >
        {/* Left Content */}
        <div className='lg:w-1/2 p-8 md:p-10 lg:p-12 text-center lg:text-left'>
          <h3 className='text-sm md:text-base font-semibold text-accent dark:text-accent-light mb-2 uppercase tracking-wide'>
            Comfort & Style
          </h3>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 md:mb-6 text-gray-900 dark:text-white leading-tight'>
            Apparel Designed <br className="hidden lg:block"/> for Everyday Living
          </h2>
          <p className='text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 md:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0'>
            Discover the perfect blend of fashion and functionality. Our collection is crafted 
            with premium materials to ensure comfort and style all day long.
          </p>
          <Link
            to="/collections/all"
            className="inline-block bg-black text-white dark:bg-white dark:text-black px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-lg"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Content */}
        <div className='lg:w-1/2 w-full'>
          <img
            src={featured}
            alt="Featured Collection"
            className='w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px] object-cover'
          />
        </div>
      </motion.div>
    </section>
  )
}

export default FeaturedCollection
