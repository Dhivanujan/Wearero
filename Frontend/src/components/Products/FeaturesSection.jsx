import React from 'react'
import { HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi'
import { HiArrowPathRoundedSquare } from 'react-icons/hi2'
import { motion } from 'framer-motion'

const FeaturesSection = () => {
  return (
    <section className='py-12 px-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center'>
            {/* {Feature 1} */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='flex flex-col items-center'
            >
                <div className='p-5 rounded-full mb-6 bg-gray-100 dark:bg-gray-800 text-black dark:text-white transition-transform duration-300 hover:scale-110'>
                    <HiShoppingBag className='text-3xl'/>
                </div>
                <h4 className='tracking-widest mb-2 font-bold uppercase text-sm text-black dark:text-white'>Free International Shipping</h4>
                <p className='text-gray-600 dark:text-gray-400 text-sm tracking-wide'>On all orders over $100.00</p>
            </motion.div>

            {/* {Feature 2} */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='flex flex-col items-center'
            >
                <div className='p-5 rounded-full mb-6 bg-gray-100 dark:bg-gray-800 text-black dark:text-white transition-transform duration-300 hover:scale-110'>
                    <HiArrowPathRoundedSquare className='text-3xl'/>
                </div>
                <h4 className='tracking-widest mb-2 font-bold uppercase text-sm text-black dark:text-white'>45 Days Return</h4>
                <p className='text-gray-600 dark:text-gray-400 text-sm tracking-wide'>Money back guarantee</p>
            </motion.div>

            {/* {Feature 3} */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='flex flex-col items-center'
            >
                <div className='p-5 rounded-full mb-6 bg-gray-100 dark:bg-gray-800 text-black dark:text-white transition-transform duration-300 hover:scale-110'>
                    <HiOutlineCreditCard className='text-3xl'/>
                </div>
                <h4 className='tracking-widest mb-2 font-bold uppercase text-sm text-black dark:text-white'>Secure Checkout</h4>
                <p className='text-gray-600 dark:text-gray-400 text-sm tracking-wide'>100% secured payment</p>
            </motion.div>
        </div>
    </section>
  )
}

export default FeaturesSection