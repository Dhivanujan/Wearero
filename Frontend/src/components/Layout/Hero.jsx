import React from 'react'
import heroImg from '../../assets/rabbit-hero.jpg'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className='relative overflow-hidden min-h-[calc(100vh-130px)] md:min-h-[calc(100vh-150px)]'>
        {/* Background Image with Overlay */}
        <div className='absolute inset-0 z-0'>
          <img 
            src={heroImg} 
            alt="Wearero" 
            className='w-full h-full object-cover object-center animate-subtle-zoom'
          />
          {/* Modern gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60'></div>
          <div className='absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30'></div>
        </div>
        
        {/* Content */}
        <div className='relative z-10 container mx-auto min-h-[calc(100vh-130px)] md:min-h-[calc(100vh-150px)] px-6 sm:px-8 flex items-center justify-center'>
            <div className='text-center text-white max-w-5xl mx-auto'>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className='inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20'
                >
                  <span className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse'></span>
                  <span className='text-sm font-medium tracking-wide'>New Season 2025</span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className='text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter uppercase mb-6 font-heading'
                >
                  Vacation <br /> 
                  <span className='text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400'>
                    Ready
                  </span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className='text-lg md:text-xl mb-10 font-light max-w-xl mx-auto text-gray-200 leading-relaxed'
                >
                  Discover curated collections designed for the modern explorer. Your style, redefined.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className='flex flex-col sm:flex-row items-center justify-center gap-4'
                >
                  <Link 
                    to='/collections/all' 
                    className='group inline-flex items-center justify-center bg-white text-gray-900 px-8 py-4 rounded-full text-base font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-float hover:shadow-xl min-w-[180px]'
                  >
                    Shop Now
                    <svg className='w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                    </svg>
                  </Link>
                  <Link 
                    to='/collections/all?category=Top Wear' 
                    className='inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/20 transition-all duration-300 border border-white/30 min-w-[180px]'
                  >
                    Explore Collection
                  </Link>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className='mt-16 flex items-center justify-center space-x-8 text-white/60 text-sm'
                >
                  <div className='flex items-center space-x-2'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M5 13l4 4L19 7' />
                    </svg>
                    <span>Free Shipping</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                  <div className='hidden sm:flex items-center space-x-2'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                    </svg>
                    <span>Easy Returns</span>
                  </div>
                </motion.div>
            </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className='absolute bottom-8 left-1/2 -translate-x-1/2 z-10'
        >
          <div className='flex flex-col items-center text-white/60'>
            <span className='text-xs tracking-widest uppercase mb-2'>Scroll</span>
            <div className='w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2'>
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className='w-1.5 h-1.5 bg-white rounded-full'
              />
            </div>
          </div>
        </motion.div>
    </section>
  )
}

export default Hero