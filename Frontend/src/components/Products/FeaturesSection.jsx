import React from 'react'
import {HiOutlineCreditCard, HiShoppingBag} from 'react-icons/hi'
import { HiArrowPathRoundedSquare } from 'react-icons/hi2'
import { motion } from 'framer-motion'

const FeaturesSection = () => {
  return (
    <section className='py-16 px-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            {/* {Feature 1} */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='flex flex-col items-center group'
            >
                <div className='p-4 rounded-full mb-4 bg-gray-100 dark:bg-gray-800 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300'>
                    <HiShoppingBag className='text-2xl text-black dark:text-white group-hover:text-white dark:group-hover:text-black'/>
                </div>
                <h4 className='tracking-tighter mb-2 font-bold uppercase text-sm text-black dark:text-white'>FREE INTERNATIONAL SHIPPING</h4>
                <p className='text-gray-500 dark:text-gray-400 text-sm tracking-tighter'>On all orders over $100</p>
            </motion.div>

            {/* {Feature 2} */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='flex flex-col items-center group'
            >
                <div className='p-4 rounded-full mb-4 bg-gray-100 dark:bg-gray-800 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300'>
                    <HiArrowPathRoundedSquare className='text-2xl text-black dark:text-white group-hover:text-white dark:group-hover:text-black'/>
                </div>
                <h4 className='tracking-tighter mb-2 font-bold uppercase text-sm text-black dark:text-white'>45-DAY RETURNS</h4>
                <p className='text-gray-500 dark:text-gray-400 text-sm tracking-tighter'>Money-back guarantee</p>
            </motion.div>

            {/* {Feature 3} */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='flex flex-col items-center group'
            >
                <div className='p-4 rounded-full mb-4 bg-gray-100 dark:bg-gray-800 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300'>
                    <HiOutlineCreditCard className='text-2xl text-black dark:text-white group-hover:text-white dark:group-hover:text-black'/>
                </div>
                <h4 className='tracking-tighter mb-2 font-bold uppercase text-sm text-black dark:text-white'>SECURE CHECKOUT</h4>
                <p className='text-gray-500 dark:text-gray-400 text-sm tracking-tighter'>100% safe & encrypted</p>
            </motion.div>
        </div>
    </section>
  )
}

export default FeaturesSection