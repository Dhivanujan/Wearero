import React from 'react'
import { Link } from 'react-router-dom'
import featured from '../../assets/featured.jpg'

const FeaturedCollection = () => {
  return (
    <section className='py-8 px-4 lg:px-0'>
      <div className='container mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-50 dark:bg-green-900 rounded-3xl overflow-hidden'>
        {/* Left Content */}
        <div className='lg:w-1/2 p-8 text-center lg:text-left'>
          <h2 className='text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2'>
            Comfort & Style Collection
          </h2>
          <h2 className='text-4xl lg:text-5xl font-bold mb-6 text-black dark:text-white'>
            Apparel Designed for Everyday Living
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400 mb-6'>
            Experience apparel that unites comfort, style, and function — crafted to keep you looking sharp and feeling confident every day.
          </p>
          <Link 
            to="/collections/all" 
            className='bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors'
          >
            Shop Now
          </Link>
        </div>

        {/* Right Content */}
        <div className='lg:w-1/2'>
          <img 
            src={featured} 
            alt="Featured Collection" 
            className='w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl' 
          />
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollection
