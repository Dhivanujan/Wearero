import React from 'react'
import heroImg from '../../assets/rabbit-hero.jpg'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className='relative'>
        <img src={heroImg} alt="Wearero" className='w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover'/>
        <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
            <div className='text-center text-white p-6'>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className='text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4'
                >
                  Vacation <br />Ready
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className='text-sm tracking-tighter md:text-lg mb-6'
                >
                    Your Vacation, Your Look – Shop Outfits with Quick Global Shipping
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Link to='/collections/all' className='bg-white text-gray-950 px-6 py-2 rounded-sm text-lg hover:bg-gray-200 transition-colors'>Shop Now</Link>
                </motion.div>
            </div>
        </div>
    </section>
  )
}

export default Hero