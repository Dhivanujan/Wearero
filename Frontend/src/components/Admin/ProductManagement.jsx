import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ProductManagement = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete the Product?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          fetchProducts();
        } else {
          console.error("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  }
  return (
    <div className="max-w-7xl mx-auto p-6">

      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      <div className='mb-4 text-right'>
        <Link to="/admin/products/new" className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'>
          Add Product
        </Link>
      </div>
      <div className='overflow-x-auto shadow sm:rounded-lg'>
        <table className='min-w-full text-left text-gray-500'>
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
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
            className='border-b hover:bg-gray-50 cursor-pointer'>
              <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>
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
              <td colSpan={4} className='p-4 text-centertext-gray-500'>No Products found.</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductManagement