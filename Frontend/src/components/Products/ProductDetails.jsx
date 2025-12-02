import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import Reviews from './Reviews';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../lib/api';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, token, refreshProfile } = useAuth();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(""); // Added color state
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
    return <div className='p-6 text-center text-gray-600 dark:text-gray-400'>No product selected.</div>;
    }

    if (!product) return <div className='p-6 text-center text-gray-600 dark:text-gray-400'>Loading product details...</div>;

  // Use product data instead of selectedProduct mock
  const { name, price, originalPrice, description, brand, material, sizes, colors, images } = product;
  const galleryImages = Array.isArray(images) ? images : [];
  const handleQuantityChange = (action) => {
    if (action === 'plus') setQuantity((prev) => prev + 1);
    if (action === 'minus' && quantity > 1) setQuantity((prev) => prev - 1);
  };
  
  const isInWishlist = user?.wishlist?.includes(product._id);

  return (
    <div className='p-6'>
      <div className='max-w-6xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg'>
        <div className='flex flex-col md:flex-row'>
          {/* Left Thumbnails */}
          <div className='hidden md:flex flex-col space-y-4 mr-6'>
            {galleryImages.map((image, index) => {
              const imageUrl = image.url?.startsWith('http') ? image.url : `${API_BASE_URL}${image.url}`;
              return (
              <img
                key={index}
                src={imageUrl}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === imageUrl ? "border-black dark:border-white" : "border-gray-300 dark:border-gray-700"}`}
                onClick={() => setMainImage(imageUrl)}
              />
            )})}
          </div>

          {/* Main Image */}
          <div className='md:w-1/2'>
            <div className='mb-4'>
              <img
                src={mainImage || 'https://picsum.photos/600/800?blur=3'}
                alt="Main Product"
                className='w-full h-auto rounded-lg object-cover'
              />
            </div>
          </div>

          {/* Mobile Thumbnails */}
          <div className='md:hidden flex overflow-x-scroll space-x-4 mb-4'>
            {galleryImages.map((image, index) => {
              const imageUrl = image.url?.startsWith('http') ? image.url : `${API_BASE_URL}${image.url}`;
              return (
              <img
                key={index}
                src={imageUrl}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === imageUrl ? "border-black dark:border-white" : "border-gray-300 dark:border-gray-700"}`}
                onClick={() => setMainImage(imageUrl)}
              />
            )})}
          </div>

          {/* Right Section */}
          <div className='md:w-1/2 md:ml-10'>
            <h1 className='text-2xl md:text-3xl font-semibold mb-2 text-black dark:text-white'>{name}</h1>

            {originalPrice && (
              <p className='text-lg text-gray-600 dark:text-gray-400 mb-1 line-through'>
                ${originalPrice}
              </p>
            )}
            <p className='text-xl text-gray-500 dark:text-gray-300 mb-2'>${price}</p>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>{description}</p>

            {/* Colors */}
            <div className='mb-4'>
              <p className='text-gray-700 dark:text-gray-300'>Color:</p>
              <div className='flex gap-2 mt-2'>
                {(colors || []).map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 rounded border text-sm ${selectedColor === color ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className='mb-4'>
              <p className='text-gray-700 dark:text-gray-300'>Size:</p>
              <div className='flex gap-2 mt-2'>
                {(sizes || []).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border ${selectedSize === size ? "bg-black dark:bg-white text-white dark:text-black" : "border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className='mb-6'>
              <p className='text-gray-700 dark:text-gray-300'>Quantity:</p>
              <div className='flex items-center space-x-4 mt-2'>
                <button
                  className='px-2 py-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded text-lg'
                  onClick={() => handleQuantityChange('minus')}
                >
                  -
                </button>
                <span className='text-lg text-black dark:text-white'>{quantity}</span>
                <button
                  className='px-2 py-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded text-lg'
                  onClick={() => handleQuantityChange('plus')}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isButtonDisabled}
                  className={`bg-black dark:bg-white text-white dark:text-black py-2 px-6 rounded w-full ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900 dark:hover:bg-gray-200'}`}
                >
                  {isButtonDisabled ? "Adding..." : "ADD TO CART"}
                </button>
                <button
                    onClick={handleWishlistClick}
                    className={`py-2 px-4 rounded border ${isInWishlist ? 'bg-red-50 text-red-500 border-red-200' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800`}
                >
                    <i className={`ri-heart-${isInWishlist ? 'fill' : 'line'} text-xl`}></i>
                </button>
            </div>

            {/* Characteristics */}
            <div className='mt-10 text-gray-700 dark:text-gray-300'>
              <h3 className='text-xl font-bold mb-4'>Characteristics:</h3>
              <table className='w-full text-left text-sm text-gray-600 dark:text-gray-400'>
                <tbody>
                  <tr>
                    <th className='py-1'>Brand</th>
                    <td className='py-1'>{brand}</td>
                  </tr>
                  <tr>
                    <th className='py-1'>Material</th>
                    <td className='py-1'>{material}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Reviews productId={id} reviews={product.reviews} />

        <div className='mt-20'>
          <h2 className='text-2xl text-center font-medium mb-4 text-black dark:text-white'>You Might Be Interested In</h2>
          <ProductGrid products={similarProducts}/>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
