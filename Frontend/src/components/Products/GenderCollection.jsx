import React from 'react'
import menCollectionImage from '../../assets/mens-collection.jpg'
import womenCollectionImage from '../../assets/womens-collection.jpg'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowLongRight } from "react-icons/hi2";

const GenderCollection = () => {
    return (
        <section className='py-16 px-4 lg:px-8'>
            <div className='container mx-auto flex flex-col md:flex-row gap-6 md:gap-8 md:h-[700px]'>
                {/* Women's Collection */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className='relative flex-1 group overflow-hidden rounded-3xl md:rounded-[40px] shadow-2xl cursor-pointer h-[350px] md:h-full'
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                    <img
                        src={womenCollectionImage}
                        alt="Women's collection"
                        className='w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110'
                    />
                    <div className='absolute bottom-8 left-8 md:bottom-10 md:left-10 z-20 text-white'>
                        <h2 className='text-5xl md:text-6xl lg:text-8xl font-heading font-black tracking-tighter mb-3 md:mb-4 opacity-100 md:opacity-90 group-hover:opacity-100 transition-opacity'>
                            WOMEN
                        </h2>
                        <Link
                            to="/collections/all?gender=Women"
                            className="inline-flex items-center text-white font-medium text-lg md:text-xl hover:underline underline-offset-8 transition-all gap-3"
                        >
                            View Collection <HiArrowLongRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                        </Link>
                    </div>
                </motion.div>

                {/* Men's Collection */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className='relative flex-1 group overflow-hidden rounded-3xl md:rounded-[40px] shadow-2xl cursor-pointer h-[350px] md:h-full'
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                    <img
                        src={menCollectionImage}
                        alt="Men's collection"
                        className='w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110'
                    />
                    <div className='absolute top-8 right-8 md:top-10 md:right-10 z-20 text-white text-right'>
                        <h2 className='text-5xl md:text-6xl lg:text-8xl font-heading font-black tracking-tighter mb-3 md:mb-4 opacity-100 md:opacity-90 group-hover:opacity-100 transition-opacity'>
                            MEN
                        </h2>
                        <Link
                            to="/collections/all?gender=Men"
                            className="inline-flex items-center text-white font-medium text-lg md:text-xl hover:underline underline-offset-8 transition-all gap-3 flex-row-reverse"
                        >
                            View Collection <HiArrowLongRight className="w-6 h-6 group-hover:-translate-x-2 rotate-180 transition-transform duration-300" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default GenderCollection