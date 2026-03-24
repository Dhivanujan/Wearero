import React, { useEffect, useState } from 'react';
import ProductGrid from './ProductGrid';
import { API_BASE_URL } from '../../lib/api';

const RecentlyViewed = ({ excludeId }) => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchRecent = async () => {
      let stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      
      // Filter out current product if excludeId is provided
      if (excludeId) {
          stored = stored.filter(id => id !== excludeId);
      }

      if (stored.length === 0) return;

      try {
          // Fetch only top 4 recent
          const idsToFetch = stored.slice(0, 4);
          const promises = idsToFetch.map(id => 
              fetch(`${API_BASE_URL}/api/products/${id}`).then(res => {
                  if(!res.ok) return null;
                  return res.json();
              })
          );
          
          const results = await Promise.all(promises);
          const validProducts = results.filter(p => p && p._id);
          setRecentProducts(validProducts);
      } catch (err) {
          console.error("Error fetching recent products", err);
      }
    };

    fetchRecent();
  }, [excludeId]); // Re-run if excludeId changes

  if (recentProducts.length === 0) return null;

  return (
    <section className='mt-16 lg:mt-24'>
           <div className='text-center mb-10'>
              <span className='text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider'>Your History</span>
              <h2 className='text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-2'>
                Recently Viewed
              </h2>
            </div>
           <ProductGrid products={recentProducts} />
    </section>
  )
}

export default RecentlyViewed;