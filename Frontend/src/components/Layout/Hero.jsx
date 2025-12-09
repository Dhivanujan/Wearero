import React from 'react'
import heroImg from '../../assets/rabbit-hero.jpg'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className='relative h-[80vh] md:h-[90vh] overflow-hidden'>
        <img 
          src={heroImg} 
          alt="Wearero" 
          className='w-full h-full object-cover object-center'
        />
        <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
            <div className='text-center text-white p-6 max-w-4xl mx-auto'>
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className='text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter uppercase mb-6 font-heading'
                >
                  Vacation <br /> <span className='text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300'>Ready</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className='text-lg md:text-xl mb-10 tracking-wide font-light max-w-2xl mx-auto'
                >
                    Your Vacation, Your Look – Shop Outfits with Quick Global Shipping
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Link 
                    to='/collections/all' 
                    className='bg-white text-black px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl'
                  >
                    Shop Collection
                  </Link>
                </motion.div>
            </div>
        </div>
    </section>
  )
}

export default Hero