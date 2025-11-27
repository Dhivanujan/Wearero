import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { API_BASE_URL } from '../../lib/api';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
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
          setMainImage(data.images?.[0]?.url || "https://picsum.photos/600/800?blur=2");
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

    if (!id) {
    return <div className='p-6 text-center text-gray-600'>No product selected.</div>;
    }

    if (!product) return <div className='p-6 text-center text-gray-600'>Loading product details...</div>;

  // Use product data instead of selectedProduct mock
  const { name, price, originalPrice, description, brand, material, sizes, colors, images } = product;
  const galleryImages = Array.isArray(images) ? images : [];
  const handleQuantityChange = (action) => {
    if (action === 'plus') setQuantity((prev) => prev + 1);
    if (action === 'minus' && quantity > 1) setQuantity((prev) => prev - 1);
  };



  return (
    <div className='p-6'>
      <div className='max-w-6xl mx-auto bg-white p-8 rounded-lg'>
        <div className='flex flex-col md:flex-row'>
          {/* Left Thumbnails */}
          <div className='hidden md:flex flex-col space-y-4 mr-6'>
            {galleryImages.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
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
            {galleryImages.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Right Section */}
          <div className='md:w-1/2 md:ml-10'>
            <h1 className='text-2xl md:text-3xl font-semibold mb-2'>{name}</h1>

            {originalPrice && (
              <p className='text-lg text-gray-600 mb-1 line-through'>
                ${originalPrice}
              </p>
            )}
            <p className='text-xl text-gray-500 mb-2'>${price}</p>
            <p className='text-gray-600 mb-4'>{description}</p>

            {/* Colors */}
            <div className='mb-4'>
              <p className='text-gray-700'>Color:</p>
              <div className='flex gap-2 mt-2'>
                {(colors || []).map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 rounded border text-sm ${selectedColor === color ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-700'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className='mb-4'>
              <p className='text-gray-700'>Size:</p>
              <div className='flex gap-2 mt-2'>
                {(sizes || []).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border ${selectedSize === size ? "bg-black text-white" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className='mb-6'>
              <p className='text-gray-700'>Quantity:</p>
              <div className='flex items-center space-x-4 mt-2'>
                <button
                  className='px-2 py-1 bg-gray-200 rounded text-lg'
                  onClick={() => handleQuantityChange('minus')}
                >
                  -
                </button>
                <span className='text-lg'>{quantity}</span>
                <button
                  className='px-2 py-1 bg-gray-200 rounded text-lg'
                  onClick={() => handleQuantityChange('plus')}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900'}`}
            >
              {isButtonDisabled ? "Adding..." : "ADD TO CART"}
            </button>

            {/* Characteristics */}
            <div className='mt-10 text-gray-700'>
              <h3 className='text-xl font-bold mb-4'>Characteristics:</h3>
              <table className='w-full text-left text-sm text-gray-600'>
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
        <div className='mt-20'>
          <h2 className='text-2xl text-center font-medium mb-4'>You Might Be Interested In</h2>
          <ProductGrid products={similarProducts}/>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
