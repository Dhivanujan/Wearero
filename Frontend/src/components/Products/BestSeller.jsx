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
    <section className='py-8'>
      <div className='container mx-auto'>
        <motion.h2  
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='text-3xl text-center font-bold mb-4 text-black dark:text-white'
        >
          Best Seller
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto'
        >
          Discover our most popular styles, loved by customers everywhere. From timeless classics to modern trends, these pieces are flying off the shelves.
        </motion.p>
        <ProductGrid products={bestSellers} />
      </div>
    </section>
  );
};

export default BestSeller;
