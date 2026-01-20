import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ProductGrid from './ProductGrid';
import Reviews from './Reviews';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../lib/api';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineArrowPath, HiOutlineChevronDown, HiMinus, HiPlus } from 'react-icons/hi2';
import { RiRulerLine, RiShareLine } from 'react-icons/ri';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, token, refreshProfile } = useAuth();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [imageZoom, setImageZoom] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchProduct = async () => {
        try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
            const data = await response.json();
            if (response.ok) {
                setProduct(data);
          const rawMainImage = data.images?.[0]?.url;
          const mainImageUrl = rawMainImage 
            ? (rawMainImage.startsWith('http') ? rawMainImage : `${API_BASE_URL}${rawMainImage}`)
            : "https://picsum.photos/600/800?blur=2";
          setMainImage(mainImageUrl);
          setSelectedSize(data.sizes?.[0] || "");
          setSelectedColor(data.colors?.[0] || "");
        } else {
          toast.error(data.message || 'Unable to load this product');
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        toast.error('Something went wrong while loading the product');
        }
    };

    const fetchSimilarProducts = async () => {
        try {
        const response = await fetch(`${API_BASE_URL}/api/products/similar/${id}`);
            const data = await response.json();
            if (response.ok) {
                setSimilarProducts(data);
        } else {
          console.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching similar products:", error);
        }
    };

    fetchProduct();
    fetchSimilarProducts();
  }, [id]);

    const handleAddToCart = async () => {
      if (!selectedSize) {
          toast.error("Please select a size");
          return;
      }
      if (!selectedColor) {
        toast.error("Please select a color");
        return;
      }

      setIsButtonDisabled(true);
      
      try {
      await addToCart(product._id, quantity, selectedSize, selectedColor);
      toast.success("Product added to cart");
      } catch (error) {
      toast.error('Unable to add the product to your cart right now');
      } finally {
      setIsButtonDisabled(false);
      }
  };

  const handleWishlistClick = async () => {
      if (!user) {
          toast.error("Please login to add to wishlist");
          return;
      }

      try {
          const response = await fetch(`${API_BASE_URL}/api/users/wishlist`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ productId: product._id }),
          });

          if (response.ok) {
              const data = await response.json();
              toast.success(data.message);
              await refreshProfile();
          } else {
              toast.error("Failed to update wishlist");
          }
      } catch (error) {
          console.error(error);
          toast.error("Error updating wishlist");
      }
  };

    if (!id) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4'>
            <HiOutlineShoppingBag className='w-8 h-8 text-gray-400' />
          </div>
          <p className='text-gray-600 dark:text-gray-400'>No product selected.</p>
        </div>
      </div>
    );
    }

    if (!product) return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Image skeleton */}
            <div className='space-y-4'>
              <div className='aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse'></div>
              <div className='flex gap-3'>
                {[1,2,3,4].map(i => (
                  <div key={i} className='w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse'></div>
                ))}
              </div>
            </div>
            {/* Info skeleton */}
            <div className='space-y-6'>
              <div className='h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse'></div>
              <div className='h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse'></div>
              <div className='h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse'></div>
              <div className='space-y-2'>
                <div className='h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse'></div>
                <div className='h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse'></div>
                <div className='h-4 w-4/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  // Use product data instead of selectedProduct mock
  const { name, price, originalPrice, description, brand, material, sizes, colors, images } = product;
  const galleryImages = Array.isArray(images) ? images : [];
  const handleQuantityChange = (action) => {
    if (action === 'plus') setQuantity((prev) => prev + 1);
    if (action === 'minus' && quantity > 1) setQuantity((prev) => prev - 1);
  };
  
  const isInWishlist = user?.wishlist?.includes(product._id);
  
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const trustBadges = [
    { icon: HiOutlineTruck, label: 'Free Shipping', desc: 'On orders over $100' },
    { icon: HiOutlineArrowPath, label: 'Easy Returns', desc: '30-day return policy' },
    { icon: HiOutlineShieldCheck, label: 'Secure Payment', desc: 'SSL encrypted' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='min-h-screen bg-gray-50 dark:bg-gray-950'
    >
      {/* Breadcrumb */}
      <div className='bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <nav className='flex items-center gap-2 text-sm'>
            <a href='/' className='text-gray-500 hover:text-accent-600 transition-colors'>Home</a>
            <span className='text-gray-300 dark:text-gray-600'>/</span>
            <a href='/collections/all' className='text-gray-500 hover:text-accent-600 transition-colors'>Products</a>
            <span className='text-gray-300 dark:text-gray-600'>/</span>
            <span className='text-gray-900 dark:text-white font-medium truncate max-w-[200px]'>{name}</span>
          </nav>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16'>
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className='space-y-4'
          >
            {/* Main Image */}
            <div 
              className='relative aspect-[3/4] bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden group cursor-zoom-in'
              onClick={() => setImageZoom(!imageZoom)}
            >
              <AnimatePresence mode='wait'>
                <motion.img
                  key={mainImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: imageZoom ? 1.5 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={mainImage || 'https://picsum.photos/600/800?blur=3'}
                  alt={name}
                  className='w-full h-full object-cover'
                />
              </AnimatePresence>
              
              {/* Discount Badge */}
              {discount > 0 && (
                <div className='absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold'>
                  -{discount}%
                </div>
              )}
              
              {/* Share & Wishlist floating buttons */}
              <div className='absolute top-4 right-4 flex flex-col gap-2'>
                <button className='p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform'>
                  <RiShareLine className='w-5 h-5 text-gray-700 dark:text-gray-300' />
                </button>
              </div>
              
              {/* Zoom hint */}
              <div className='absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
                {imageZoom ? 'Click to zoom out' : 'Click to zoom in'}
              </div>
            </div>

            {/* Thumbnails */}
            <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-thin'>
              {galleryImages.map((image, index) => {
                const imageUrl = image.url?.startsWith('http') ? image.url : `${API_BASE_URL}${image.url}`;
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setMainImage(imageUrl); setImageZoom(false); }}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      mainImage === imageUrl 
                        ? 'border-accent-500 ring-2 ring-accent-500/30' 
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={image.altText || `View ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className='flex flex-col'
          >
            {/* Brand */}
            {brand && (
              <span className='text-accent-600 dark:text-accent-400 font-medium text-sm uppercase tracking-wider mb-2'>
                {brand}
              </span>
            )}

            {/* Title */}
            <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight'>
              {name}
            </h1>

            {/* Price */}
            <div className='flex items-baseline gap-3 mb-6'>
              <span className='text-3xl font-bold text-gray-900 dark:text-white'>
                ${price}
              </span>
              {originalPrice && (
                <>
                  <span className='text-xl text-gray-400 line-through'>
                    ${originalPrice}
                  </span>
                  <span className='bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md text-sm font-medium'>
                    Save ${(originalPrice - price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className='text-gray-600 dark:text-gray-400 leading-relaxed mb-8'>
              {description}
            </p>

            {/* Color Selection */}
            {colors && colors.length > 0 && (
              <div className='mb-6'>
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide'>
                    Color
                  </span>
                  <span className='text-sm text-gray-500 capitalize'>{selectedColor}</span>
                </div>
                <div className='flex flex-wrap gap-3'>
                  {colors.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-10 h-10 rounded-full transition-all ${
                        selectedColor === color 
                          ? 'ring-2 ring-offset-2 ring-accent-500 dark:ring-offset-gray-900' 
                          : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300 dark:hover:ring-gray-600 dark:hover:ring-offset-gray-900'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className='absolute inset-0 flex items-center justify-center'
                        >
                          <svg className={`w-5 h-5 ${['white', 'yellow', 'beige', 'cream'].includes(color.toLowerCase()) ? 'text-gray-800' : 'text-white'}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes && sizes.length > 0 && (
              <div className='mb-6'>
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide'>
                    Size
                  </span>
                  <button className='flex items-center gap-1 text-sm text-accent-600 hover:text-accent-700 transition-colors'>
                    <RiRulerLine className='w-4 h-4' />
                    Size Guide
                  </button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-12 px-4 rounded-xl font-medium text-sm transition-all ${
                        selectedSize === size
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className='mb-8'>
              <span className='text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide block mb-3'>
                Quantity
              </span>
              <div className='inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1'>
                <button
                  onClick={() => handleQuantityChange('minus')}
                  disabled={quantity <= 1}
                  className='w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed'
                >
                  <HiMinus className='w-4 h-4' />
                </button>
                <span className='w-14 text-center font-semibold text-gray-900 dark:text-white'>
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange('plus')}
                  className='w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all'
                >
                  <HiPlus className='w-4 h-4' />
                </button>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className='flex gap-3 mb-8'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`flex-1 h-14 bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-700 hover:to-accent-600 text-white rounded-xl font-semibold text-sm uppercase tracking-wider shadow-lg shadow-accent-500/25 flex items-center justify-center gap-2 transition-all ${
                  isButtonDisabled ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {isButtonDisabled ? (
                  <>
                    <svg className='animate-spin w-5 h-5' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <HiOutlineShoppingBag className='w-5 h-5' />
                    Add to Cart
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWishlistClick}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                  isInWishlist 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border-2 border-red-200 dark:border-red-800' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                {isInWishlist ? (
                  <HiHeart className='w-6 h-6' />
                ) : (
                  <HiOutlineHeart className='w-6 h-6' />
                )}
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className='grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl mb-8'>
              {trustBadges.map((badge, index) => (
                <div key={index} className='text-center'>
                  <badge.icon className='w-6 h-6 mx-auto mb-2 text-accent-600 dark:text-accent-400' />
                  <p className='text-xs font-medium text-gray-900 dark:text-white'>{badge.label}</p>
                  <p className='text-[10px] text-gray-500 dark:text-gray-400'>{badge.desc}</p>
                </div>
              ))}
            </div>

            {/* Product Details Accordion */}
            <div className='border-t border-gray-200 dark:border-gray-800'>
              <button 
                onClick={() => setActiveTab(activeTab === 'details' ? '' : 'details')}
                className='w-full flex items-center justify-between py-4 text-left'
              >
                <span className='font-semibold text-gray-900 dark:text-white'>Product Details</span>
                <HiOutlineChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${activeTab === 'details' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeTab === 'details' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className='overflow-hidden'
                  >
                    <dl className='pb-4 space-y-3'>
                      {brand && (
                        <div className='flex justify-between'>
                          <dt className='text-gray-500 dark:text-gray-400'>Brand</dt>
                          <dd className='font-medium text-gray-900 dark:text-white'>{brand}</dd>
                        </div>
                      )}
                      {material && (
                        <div className='flex justify-between'>
                          <dt className='text-gray-500 dark:text-gray-400'>Material</dt>
                          <dd className='font-medium text-gray-900 dark:text-white'>{material}</dd>
                        </div>
                      )}
                      {colors && colors.length > 0 && (
                        <div className='flex justify-between'>
                          <dt className='text-gray-500 dark:text-gray-400'>Available Colors</dt>
                          <dd className='font-medium text-gray-900 dark:text-white'>{colors.length}</dd>
                        </div>
                      )}
                      {sizes && sizes.length > 0 && (
                        <div className='flex justify-between'>
                          <dt className='text-gray-500 dark:text-gray-400'>Available Sizes</dt>
                          <dd className='font-medium text-gray-900 dark:text-white'>{sizes.join(', ')}</dd>
                        </div>
                      )}
                    </dl>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='mt-16 lg:mt-24'
        >
          <Reviews productId={id} reviews={product.reviews} />
        </motion.div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='mt-16 lg:mt-24'
          >
            <div className='text-center mb-10'>
              <span className='text-accent-600 dark:text-accent-400 font-medium text-sm uppercase tracking-wider'>You May Also Like</span>
              <h2 className='text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-2'>
                Similar Products
              </h2>
            </div>
            <ProductGrid products={similarProducts}/>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetails;
