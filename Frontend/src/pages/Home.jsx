import React, { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollection from '../components/Products/GenderCollection'
import NewArrivals from '../components/Products/NewArrivals'
import BestSeller from '../components/Products/BestSeller'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturesSection from '../components/Products/FeaturesSection'
import { API_BASE_URL } from '../lib/api'
import { motion } from 'framer-motion'

const Home = () => {
  const [topWears, setTopWears] = useState([]);

  useEffect(() => {
    const fetchTopWears = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products?gender=Women&limit=8`);
        const data = await response.json();
        if (response.ok) {
          setTopWears(data);
        } else {
          console.error('Failed to fetch top wears:', data.message);
        }
      } catch (error) {
        console.error('Error fetching top wears:', error);
      }
    };

    fetchTopWears();
  }, []);

  return (
    <div>
        <Hero/>
        <div className="space-y-24 mb-24">
            <GenderCollection/>
            <NewArrivals/>
            
            {/* Best Seller */}
            <BestSeller />

            <div className='container mx-auto px-4'>
              <div className='text-center mb-16'>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className='text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight'
                >
                    Top Wears for Women
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'
                >
                    Explore our curated selection of top-rated women's clothing. Comfort, style, and elegance combined.
                </motion.p>
              </div>
              <ProductGrid products={topWears}/>
            </div>
            
            <FeaturedCollection/>
            <FeaturesSection />
        </div>
    </div>
  )
}

export default Home