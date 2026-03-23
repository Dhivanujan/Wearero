import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../lib/api';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { motion } from 'framer-motion';

const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/best-seller`);
        const data = await response.json();
        if (response.ok) {
          setBestSellers(data);
        } else {
          toast.error(data.message || 'Unable to load best sellers');
        }
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        toast.error('Something went wrong while loading best sellers');
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <section className='py-24 bg-white dark:bg-gray-950 px-4'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
            <motion.h2  
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight font-heading'
            >
            Best Sellers
            </motion.h2>
            <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed'
            >
            Our most loved pieces, chosen by you. Don't miss out on these customer favorites.
            </motion.p>
        </div>
        <ProductGrid products={bestSellers} />
      </div>
    </section>
  );
};

export default BestSeller;
