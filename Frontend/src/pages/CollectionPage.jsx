import React, { useState, useEffect, useRef } from 'react';
import { FaFilter } from 'react-icons/fa';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from './SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import ProductCardSkeleton from '../components/Products/ProductCardSkeleton';
import { useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleClickOutSide = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setIsSidebarOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSide);
    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams);
        if (!params.has('limit')) params.set('limit', '12');
        if (!params.has('page')) params.set('page', '1');

        const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`);
        const data = await response.json();

        if (response.ok) {
          // Handle both paginated and non-paginated responses
          if (data.products) {
            setProducts(data.products);
            setPagination({ page: data.page, pages: data.pages, total: data.total });
          } else if (Array.isArray(data)) {
            setProducts(data);
            setPagination({ page: 1, pages: 1, total: data.length });
          }
        } else {
          toast.error(data.message || 'Unable to load products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">All Collection</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our curated selection of premium fashion pieces designed for the modern individual
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button onClick={toggleSidebar} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
              <FaFilter className="w-4 h-4" />
              <span className="font-medium">Filter Products</span>
            </button>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <FilterSidebar />
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isSidebarOpen ? 'visible' : 'invisible'}`}>
            <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={toggleSidebar} />
            <div ref={sidebarRef} className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-950 shadow-2xl transform transition-transform duration-300 ease-smooth overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
                <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow min-w-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{products.length}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> products
              </p>
              <SortOptions />
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                <ProductCardSkeleton count={6} />
              </div>
            ) : (
              <ProductGrid products={products} />
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <HiChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - pagination.page) <= 1)
                  .map((page, idx, arr) => (
                    <React.Fragment key={page}>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">…</span>
                      )}
                      <button
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                          page === pagination.page
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                            : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <HiChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
