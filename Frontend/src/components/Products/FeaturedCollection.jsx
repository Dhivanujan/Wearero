import React from 'react'
import { Link } from 'react-router-dom'
import featured from '../../assets/featured.jpg'

const FeaturedCollection = () => {
  return (
    <section className='py-16 px-4 lg:px-0'>
      <div className='container mx-auto flex flex-col-reverse lg:flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg'>
        {/* Left Content */}
        <div className='lg:w-1/2 p-8 lg:p-12 text-center lg:text-left'>
          <h2 className='text-lg font-semibold text-gray-500 dark:text-gray-300 mb-2 uppercase tracking-wide'>
            Comfort & Style
          </h2>
          <h2 className='text-4xl lg:text-5xl font-heading font-bold mb-6 text-gray-900 dark:text-white leading-tight'>
            Apparel Designed <br className="hidden lg:block"/> for Everyday Living
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0'>
            Discover the perfect blend of fashion and functionality. Our collection is crafted 
            with premium materials to ensure comfort and style all day long.
          </p>
          <Link
            to="/collections/all"
            className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-transform duration-300 hover:-translate-y-1 shadow-md"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Content */}
        <div className='lg:w-1/2 h-full'>
          <img
            src={featured}
            alt="Featured Collection"
            className='w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl min-h-[400px]'
          />
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollection
