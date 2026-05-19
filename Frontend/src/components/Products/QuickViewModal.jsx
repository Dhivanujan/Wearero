import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineShoppingBag, HiXMark } from 'react-icons/hi2';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';
import LazyImage from '../Common/LazyImage';
import { resolveImageUrl } from '../../lib/api';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
      setQuantity(1);
    }
  }, [product]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleAddToCart = useCallback(async () => {
    if (!selectedSize) { toast.error('Please select a size'); return; }
    if (!selectedColor) { toast.error('Please select a color'); return; }
    setAdding(true);
    try {
      await addToCart(product._id, quantity, selectedSize, selectedColor);
      toast.success('Added to cart!');
      onClose();
    } catch { toast.error('Failed to add to cart'); }
    finally { setAdding(false); }
  }, [product, selectedSize, selectedColor, quantity, addToCart, onClose]);

  if (!product) return null;

  const imageUrl = resolveImageUrl(product.images?.[0]?.url);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg"
            >
              <HiXMark className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
              {/* Image */}
              <div className="aspect-[3/4] md:aspect-auto md:h-full">
                <LazyImage
                  src={imageUrl}
                  alt={product.name}
                  width={500}
                  height={667}
                  className="w-full h-full"
                />
              </div>

              {/* Product Info */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                {product.brand && (
                  <span className="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-2">{product.brand}</span>
                )}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{product.name}</h3>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                  {product.discountPrice && product.discountPrice < product.price && (
                    <span className="text-sm text-gray-400 line-through">${product.discountPrice}</span>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">{product.description}</p>

                {/* Colors */}
                {product.colors?.length > 0 && (
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide block mb-2">Color</span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-accent-500 dark:ring-offset-gray-900' : 'ring-1 ring-gray-200 dark:ring-gray-700'}`}
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes?.length > 0 && (
                  <div className="mb-6">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide block mb-2">Size</span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedSize === size ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="flex-1 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all disabled:opacity-50"
                  >
                    <HiOutlineShoppingBag className="w-5 h-5" />
                    {adding ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <Link
                    to={`/product/${product._id}`}
                    onClick={onClose}
                    className="h-12 px-5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(QuickViewModal);
