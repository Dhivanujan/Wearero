import React from 'react'
import { HiOutlineCreditCard, HiShoppingBag, HiTruck } from 'react-icons/hi'
import { HiArrowPathRoundedSquare } from 'react-icons/hi2'
import { motion } from 'framer-motion'

const FeaturesSection = () => {
  return (
    <section className='py-16 px-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center'>
            {/* {Feature 1} */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='flex flex-col items-center group'
            >
                <div className='p-6 rounded-full mb-6 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-primary shadow-sm hover:shadow-lg'>
                    <HiShoppingBag className='text-3xl'/>
                </div>
                <h4 className='tracking-wide mb-2 font-bold uppercase text-sm text-gray-900 dark:text-gray-100'>Free International Shipping</h4>
                <p className='text-gray-500 dark:text-gray-400 text-sm tracking-wide leading-relaxed'>On all orders over $100.00</p>
            </motion.div>

            {/* {Feature 2} */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='flex flex-col items-center group'
            >
                <div className='p-6 rounded-full mb-6 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-primary shadow-sm hover:shadow-lg'>
                    <HiArrowPathRoundedSquare className='text-3xl'/>
                </div>
                <h4 className='tracking-wide mb-2 font-bold uppercase text-sm text-gray-900 dark:text-gray-100'>45 Days Return</h4>
                <p className='text-gray-500 dark:text-gray-400 text-sm tracking-wide leading-relaxed'>Money back guarantee</p>
            </motion.div>

            {/* {Feature 3} */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='flex flex-col items-center group'
            >
                  <div className='p-6 rounded-full mb-6 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-primary shadow-sm hover:shadow-lg'>
                    <HiOutlineCreditCard className='text-3xl'/>
                </div>
                <h4 className='tracking-wide mb-2 font-bold uppercase text-sm text-gray-900 dark:text-gray-100'>Secure Checkout</h4>
                <p className='text-gray-500 dark:text-gray-400 text-sm tracking-wide leading-relaxed'>100% secured payment</p>
            </motion.div>
        </div>
    </section>
  )
}

export default FeaturesSection