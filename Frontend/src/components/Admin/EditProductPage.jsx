import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../lib/api";
import { toast } from "sonner";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultProductState = {
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "Men",
    images: [],
  };
  const [productData, setProductData] = useState(defaultProductState);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
          const data = await response.json();
          if (response.ok) {
            setProductData({
              ...data,
              sizes: data.sizes || [],
              colors: data.colors || [],
              images: data.images || [],
            });
          } else {
            toast.error(data.message || 'Unable to load the product');
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          toast.error('Something went wrong while loading the product');
        }
      };
      fetchProduct();
    }
  }, [id]);

  // Generic input handler
  const numericFields = useMemo(
    () => ["price", "discountPrice", "countInStock", "weight"],
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = id
        ? `${API_BASE_URL}/api/products/${id}`
        : `${API_BASE_URL}/api/products`;
      const method = id ? 'PUT' : 'POST';

      setIsSubmitting(true);
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success(id ? 'Product updated' : 'Product created');
        setProductData(defaultProductState);
        navigate('/admin/products');
      } else {
        const payload = await response.json();
        toast.error(payload.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error('Something went wrong while saving the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md bg-white dark:bg-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">
        {id ? "Edit Product" : "Create Product"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-black dark:text-white">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-black dark:text-white">Product Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
            rows={4}
            required
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-black dark:text-white">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
          />
        </div>

        {/* Count in Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-black dark:text-white">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
          />
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-black dark:text-white">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-black dark:text-white">Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
            required
          />
        </div>

        {/* Collection */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-black dark:text-white">Collection</label>
          <input
            type="text"
            name="collections"
            value={productData.collections}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
            required
          />
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-black dark:text-white">Gender</label>
          <select
            name="gender"
            value={productData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
            required
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-black dark:text-white">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((s) => s.trim()),
              })
            }
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
          />
        </div>

        {/* Colors */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-black dark:text-white">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((c) => c.trim()),
              })
            }
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-black dark:text-white">Product Images</label>
          <input
            type="file"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                const formData = new FormData();
                formData.append("image", file);

                try {
                  const response = await fetch(`${API_BASE_URL}/api/upload`, {
                    method: "POST",
                    body: formData,
                  });
                  const data = await response.json();
                  if (response.ok) {
                    setProductData((prev) => ({
                      ...prev,
                      images: [...prev.images, { url: data.imageUrl, alt: prev.name }],
                    }));
                    toast.success("Image uploaded successfully");
                  } else {
                    toast.error(data.message || "Failed to upload image");
                  }
                } catch (error) {
                  console.error("Error uploading image:", error);
                  toast.error("Error uploading image");
                }
              }
            }}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
          />
          <div className="flex gap-4 mt-4">
            {productData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt={image.alt || "Product Image"}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
                {/* Remove Image Button */}
                <button
                  type="button"
                  onClick={() => {
                    setProductData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }));
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : id ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;

