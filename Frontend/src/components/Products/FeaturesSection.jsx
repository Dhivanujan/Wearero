import React from 'react'
import { HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi'
import { HiArrowPathRoundedSquare } from 'react-icons/hi2'
import { motion } from 'framer-motion'

const features = [
  {
    icon: HiShoppingBag,
    title: 'Free International Shipping',
    description: 'On all orders over $100.00',
  },
  {
    icon: HiArrowPathRoundedSquare,
    title: '45 Days Return',
    description: 'Money back guarantee',
  },
  {
    icon: HiOutlineCreditCard,
    title: 'Secure Checkout',
    description: '100% secured payment',
  },
];

const FeaturesSection = () => {
  return (
    <section className='py-16 md:py-20 px-4 lg:px-8 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800'>
      <div className='container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 text-center'>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className='flex flex-col items-center group'
            >
              <div className='p-5 md:p-6 rounded-full mb-4 md:mb-6 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white dark:group-hover:bg-accent shadow-sm hover:shadow-lg'>
                <Icon className='text-2xl md:text-3xl' />
              </div>
              <h4 className='tracking-wide mb-1.5 md:mb-2 font-bold uppercase text-xs md:text-sm text-gray-900 dark:text-gray-100'>
                {feature.title}
              </h4>
              <p className='text-gray-500 dark:text-gray-400 text-xs md:text-sm tracking-wide leading-relaxed'>
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  )
}

export default FeaturesSection