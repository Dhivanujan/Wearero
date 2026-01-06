import React from 'react'
import heroImg from '../../assets/rabbit-hero.jpg'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className='relative h-[85vh] md:h-[95vh] overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <img 
            src={heroImg} 
            alt="Wearero" 
            className='w-full h-full object-cover object-center animate-subtle-zoom'
          />
        </div>
        
        <div className='absolute inset-0 bg-black/30 flex items-center justify-center z-10'>
            <div className='text-center text-white p-6 max-w-5xl mx-auto'>
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className='text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter uppercase mb-6 font-heading drop-shadow-lg'
                >
                  Vacation <br /> <span className='text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400'>Ready</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className='text-xl md:text-2xl mb-10 tracking-widest font-light max-w-2xl mx-auto text-gray-100 uppercase'
                >
                    Your Look, Your Way
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Link 
                    to='/collections/all' 
                    className='inline-block bg-white/90 backdrop-blur-sm text-black px-12 py-4 rounded-full text-lg font-medium hover:bg-white transition-all transform hover:scale-105 shadow-float hover:shadow-xl ring-1 ring-white/50'
                  >
                    Shop Now
                  </Link>
                </motion.div>
            </div>
        </div>
    </section>
  )
}

export default Hero