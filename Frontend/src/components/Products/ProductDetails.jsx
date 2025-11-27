import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(""); // Added color state

  useEffect(() => {
    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`);
            const data = await response.json();
            if (response.ok) {
                setProduct(data);
                setMainImage(data.images[0]?.url);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const fetchSimilarProducts = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/products/similar/${id}`);
            const data = await response.json();
            if (response.ok) {
                setSimilarProducts(data);
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
      // Assuming color selection is also needed if product has colors
      // if (!selectedColor) { toast.error("Please select a color"); return; }

      const userId = localStorage.getItem('userId');
      let guestId = localStorage.getItem('guestId');
      if (!userId && !guestId) {
          guestId = `guest_${new Date().getTime()}`;
          localStorage.setItem('guestId', guestId);
      }

      try {
          const response = await fetch('http://localhost:3000/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  productId: product._id,
                  quantity,
                  size: selectedSize,
                  color: selectedColor || product.colors[0], // Default to first color if not selected
                  userId,
                  guestId
              })
          });

          if (response.ok) {
              toast.success("Product added to cart");
          } else {
              toast.error("Failed to add to cart");
          }
      } catch (error) {
          console.error("Error adding to cart:", error);
          toast.error("Error adding to cart");
      }
  };

  if (!product) return <div>Loading...</div>;

  // Use product data instead of selectedProduct mock
  const { name, price, originalPrice, description, brand, material, sizes, colors, images } = product;

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
            {images.map((image, index) => (
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
                src={mainImage}
                alt="Main Product"
                className='w-full h-auto rounded-lg object-cover'
              />
            </div>
          </div>

          {/* Mobile Thumbnails */}
          <div className='md:hidden flex overflow-x-scroll space-x-4 mb-4'>
            {images.map((image, index) => (
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
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border ${selectedColor === color ? 'border-4 border-black' : 'border-gray-300'}`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className='mb-4'>
              <p className='text-gray-700'>Size:</p>
              <div className='flex gap-2 mt-2'>
                {sizes.map((size) => (
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
