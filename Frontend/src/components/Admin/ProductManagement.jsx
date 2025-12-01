import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../../lib/api'
import { toast } from 'sonner'

const ProductManagement = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        toast.error(data.message || 'Unable to load products');
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error('Something went wrong while loading products');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete the Product?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          fetchProducts();
          toast.success('Product deleted');
        } else {
          const payload = await response.json();
          toast.error(payload.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error('Something went wrong while deleting the product');
      }
    }
  }
  return (
    <div className="max-w-7xl mx-auto p-6">

      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Product Management</h2>
      <div className='mb-4 text-right'>
        <Link to="/admin/products/new" className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'>
          Add Product
        </Link>
      </div>
      <div className='overflow-x-auto shadow sm:rounded-lg bg-white dark:bg-gray-800'>
        <table className='min-w-full text-left text-gray-500 dark:text-gray-400'>
          <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-300">
            <tr>
              <th className='py-3 px-4'>Name</th>
              <th className='py-3 px-4'>Price</th>
              <th className='py-3 px-4'>SKU</th>
              <th className='py-3 px-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (products.map((product) => 
            <tr key={product._id}
            className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer'>
              <td className='p-4 font-medium text-gray-900 dark:text-white whitespace-nowrap'>
                {product.name}
              </td>
              <td className='p-4'>${product.price}</td>
              <td className='p-4'>{product.sku}</td>
              <td className='p-4'>
                <Link to={`/admin/products/${product._id}/edit`} className='bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600'>
                Edit
                </Link>

                <button onClick={() => handleDelete(product._id)} className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'>Delete</button>
              </td>
            </tr>)) : (<tr>
              <td colSpan={4} className='p-4 text-center text-gray-500 dark:text-gray-400'>No products found.</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductManagement