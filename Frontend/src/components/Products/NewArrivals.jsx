import React, { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../lib/api';
import { motion } from 'framer-motion';
import LazyImage from '../Common/LazyImage';

const SkeletonCard = () => (
  <div className="min-w-[280px] sm:min-w-[320px] snap-center flex-shrink-0 animate-pulse">
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 h-full">
      <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-16" />
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
      </div>
    </div>
  </div>
);

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/new-arrivals`);
        const data = await response.json();
        if (response.ok) setNewArrivals(data);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollWidth > container.scrollLeft + container.clientWidth);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [newArrivals]);

  return (
    <section className="py-24 px-4 lg:px-8 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto text-center mb-12 relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tight text-gray-900 dark:text-white"
        >
          Fresh Drops
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Be the first to wear our latest releases.
        </motion.p>
      </div>

      <div className="relative container mx-auto group/slider">
        <button
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white shadow-lg backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:scale-110 disabled:opacity-0 disabled:cursor-not-allowed"
          aria-label="Scroll left"
        >
          <FiChevronLeft className="text-2xl" />
        </button>
        <button
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white shadow-lg backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:scale-110 disabled:opacity-0 disabled:cursor-not-allowed"
          aria-label="Scroll right"
        >
          <FiChevronRight className="text-2xl" />
        </button>

        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : newArrivals.map((product) => (
                <div key={product._id} className="min-w-[280px] sm:min-w-[320px] snap-center flex-shrink-0">
                  <Link
                    to={`/product/${product._id}`}
                    className="block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 h-full flex flex-col group"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <LazyImage
                        src={product.images?.[0]?.url}
                        alt={product.images?.[0]?.altText || product.name}
                        width={400}
                        height={500}
                        className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 flex-1 pr-4">{product.name}</h4>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">${product.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">{product.description}</p>
                      <div className="mt-auto">
                        <span className="text-sm font-medium text-accent dark:text-accent-light hover:text-accent-600 dark:hover:text-accent-300">
                          View Details &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
