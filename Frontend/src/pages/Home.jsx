import React, { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollection from '../components/Products/GenderCollection'
import NewArrivals from '../components/Products/NewArrivals'
import BestSeller from '../components/Products/BestSeller'
import ProductGrid from '../components/Products/ProductGrid'
import ProductCardSkeleton from '../components/Products/ProductCardSkeleton'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturesSection from '../components/Products/FeaturesSection'
import Newsletter from '../components/Layout/Newsletter'
import ScrollingText from '../components/Common/ScrollingText'
import { API_BASE_URL } from '../lib/api'
import { motion } from 'framer-motion'

const Home = () => {
  const [topWears, setTopWears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopWears = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products?gender=Women&limit=8`);
        const data = await response.json();
        if (response.ok) {
          // Handle both paginated ({ products }) and flat array responses
          setTopWears(data.products || data);
        } else {
          console.error('Failed to fetch top wears:', data.message);
        }
      } catch (error) {
        console.error('Error fetching top wears:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopWears();
  }, []);

  return (
    <>
      <Hero />
      <ScrollingText />
      <GenderCollection />
      <NewArrivals />
      
      {/* Best Seller */}
      <BestSeller />

      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white tracking-tight font-heading"
            >
              Top Wears for Women
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
               Explore our curated selection of top-rated women's clothing. Comfort, style, and elegance combined.
            </motion.p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              <ProductCardSkeleton count={8} />
            </div>
          ) : (
            <ProductGrid products={topWears} />
          )}
        </div>
      </section>

      <FeaturedCollection />
      <FeaturesSection />
      <Newsletter />
    </>
  );
};

export default Home