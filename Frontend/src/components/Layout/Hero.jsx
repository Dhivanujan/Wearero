import React from 'react'
import heroImg from '../../assets/rabbit-hero.jpg'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className='relative overflow-hidden min-h-screen text-white'>
        {/* Background Image with Enhanced Overlay */}
        <div className='absolute inset-0 z-0'>
          <img 
            src={heroImg} 
            alt="Fashion Collection" 
            className='w-full h-full object-cover object-center animate-[subtle-zoom_20s_infinite_alternate]'
          />
          {/* Enhanced gradient for better text readability */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent'></div>
          {/* Subtle radial overlay for depth */}
          <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/70'></div>
        </div>
        
        {/* Content Container */}
        <div className='relative z-10 container mx-auto flex flex-col justify-center items-center h-full text-center pt-12 pb-20 md:pt-20 md:pb-32 px-4 min-h-screen'>
            <div className='max-w-4xl mx-auto'>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className='inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-6 md:mb-8 hover:bg-white/20 transition-colors'
                >
                  <span className='relative flex h-2.5 w-2.5 md:h-3 md:w-3'>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rabbit-red opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-rabbit-red"></span>
                  </span>
                  <span className='text-xs md:text-sm font-medium tracking-wide text-gray-100'>New Season 2026</span>
                </motion.div>

                {/* Heading */}
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className='text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-4 md:mb-6 font-heading leading-tight drop-shadow-xl'
                >
                  Vacation <br className="hidden md:block" /> 
                  <span className='bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400'>
                    Ready Style
                  </span>
                </motion.h1>

                {/* Subheading */}
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className='text-base md:text-xl text-gray-200 mb-8 md:mb-10 max-w-lg md:max-w-2xl mx-auto leading-relaxed font-light tracking-wide'
                >
                  Discover our curated collection of premium essentials designed for the modern explorer. Experience comfort without compromising on style.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className='flex flex-col sm:flex-row items-center justify-center gap-6'
                >
                  <Link 
                    to='/collections/all' 
                    className='group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-semibold text-black transition-all duration-300 hover:bg-gray-100 hover:ring-2 hover:ring-white hover:ring-offset-2 hover:ring-offset-gray-900 min-w-[180px]'
                  >
                    <span className="mr-2">Shop Now</span>
                    <svg 
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>

                  <Link 
                    to='/collections/all?category=Top Wear' 
                    className='relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/5 px-8 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/50 min-w-[180px]'
                  >
                    Explore Trends
                  </Link>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className='mt-16 flex flex-wrap justify-center gap-6 sm:gap-12 text-sm text-gray-300'
                >
                    <div className='flex items-center gap-2 group cursor-default'>
                        <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                            <svg className='w-5 h-5 text-gray-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M5 13l4 4L19 7' />
                            </svg>
                        </div>
                        <span className="font-medium">Free Shipping Over $100</span>
                    </div>
                    
                    <div className='flex items-center gap-2 group cursor-default'>
                        <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                            <svg className='w-5 h-5 text-gray-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                            </svg>
                        </div>
                        <span className="font-medium">Secure Checkout</span>
                    </div>

                    <div className='flex items-center gap-2 group cursor-default'>
                        <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                             <svg className='w-5 h-5 text-gray-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                            </svg>
                        </div>
                        <span className="font-medium">30-Day Returns</span>
                    </div>
                </motion.div>
            </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 cursor-pointer'
        >
             <span className='text-xs font-semibold tracking-widest text-white/50 uppercase'>Scroll</span>
             <div className='w-[30px] h-[50px] rounded-full border-2 border-white/20 flex justify-center p-2'>
                 <motion.div 
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className='w-1.5 h-1.5 bg-white rounded-full'
                 />
             </div>
        </motion.div>
    </section>
  )
}

export default Hero