import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../lib/api';
import { uploadImage } from '../../lib/uploadService';
import { toast } from 'sonner';
import { HiOutlinePhoto, HiOutlineXMark, HiOutlineCloudArrowUp } from 'react-icons/hi2';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const defaultProductState = {
    name: '', description: '', price: 0, countInStock: 0, sku: '',
    category: '', brand: '', sizes: [], colors: [], collections: '',
    material: '', gender: 'Men', images: [],
  };
  const [productData, setProductData] = useState(defaultProductState);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
          const data = await response.json();
          if (response.ok) {
            setProductData({ ...data, sizes: data.sizes || [], colors: data.colors || [], images: data.images || [] });
          } else { toast.error(data.message || 'Unable to load the product'); }
        } catch { toast.error('Something went wrong while loading the product'); }
      };
      fetchProduct();
    }
  }, [id]);

  const numericFields = useMemo(() => ['price', 'discountPrice', 'countInStock', 'weight'], []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: numericFields.includes(name) ? Number(value) : value }));
  };

  const handleImageUpload = useCallback(async (files) => {
    const token = localStorage.getItem('token');
    if (!token) { toast.error('Please login first'); return; }

    setUploading(true);
    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) { toast.error(`${file.name} is not an image`); continue; }
        if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} exceeds 5MB limit`); continue; }

        const data = await uploadImage(file, token);
        setProductData((prev) => ({
          ...prev,
          images: [...prev.images, { url: data.imageUrl, alt: prev.name || 'Product Image' }],
        }));
        toast.success(`Image uploaded successfully`);
      }
    } catch (error) {
      toast.error(error.message || 'Error uploading image');
    } finally { setUploading(false); }
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleImageUpload(Array.from(e.dataTransfer.files));
  }, [handleImageUpload]);

  const removeImage = (index) => {
    setProductData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = id ? `${API_BASE_URL}/api/products/${id}` : `${API_BASE_URL}/api/products`;
      setIsSubmitting(true);
      const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        toast.success(id ? 'Product updated' : 'Product created');
        navigate('/admin/products');
      } else {
        const payload = await response.json();
        toast.error(payload.message || 'Failed to save product');
      }
    } catch { toast.error('Something went wrong'); }
    finally { setIsSubmitting(false); }
  };

  const inputClass = 'w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all outline-none';
  const labelClass = 'block text-sm font-semibold mb-2 text-gray-900 dark:text-white';

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white font-heading">
          {id ? 'Edit Product' : 'Create Product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className={labelClass}>Product Name</label>
            <input type="text" name="name" value={productData.name} onChange={handleChange} className={inputClass} required />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" value={productData.description} onChange={handleChange} className={inputClass} rows={4} required />
          </div>

          {/* Price / Stock / SKU Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Price ($)</label>
              <input type="number" name="price" value={productData.price} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input type="number" name="countInStock" value={productData.countInStock} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SKU</label>
              <input type="text" name="sku" value={productData.sku} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Category / Collection / Material */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <input type="text" name="category" value={productData.category} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Collection</label>
              <input type="text" name="collections" value={productData.collections} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Material</label>
              <input type="text" name="material" value={productData.material} onChange={handleChange} className={inputClass} placeholder="e.g. Cotton" />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className={labelClass}>Gender</label>
            <select name="gender" value={productData.gender} onChange={handleChange} className={inputClass} required>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          {/* Sizes / Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Sizes (comma-separated)</label>
              <input type="text" value={productData.sizes.join(', ')} onChange={(e) => setProductData({ ...productData, sizes: e.target.value.split(',').map((s) => s.trim()) })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Colors (comma-separated)</label>
              <input type="text" value={productData.colors.join(', ')} onChange={(e) => setProductData({ ...productData, colors: e.target.value.split(',').map((c) => c.trim()) })} className={inputClass} />
            </div>
          </div>

          {/* Image Upload — Drag & Drop */}
          <div>
            <label className={labelClass}>Product Images</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                dragActive
                  ? 'border-accent bg-accent/5'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                multiple
                onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-3">
                {uploading ? (
                  <>
                    <div className="w-10 h-10 border-3 border-gray-200 dark:border-gray-700 border-t-accent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Uploading to Cloudinary...</p>
                  </>
                ) : (
                  <>
                    <HiOutlineCloudArrowUp className="w-10 h-10 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-accent">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Image Previews */}
            {productData.images.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {productData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img src={image.url} alt={image.alt || 'Product'} className="w-20 h-20 object-cover rounded-xl shadow-sm ring-1 ring-gray-100 dark:ring-gray-800" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <HiOutlineXMark className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
