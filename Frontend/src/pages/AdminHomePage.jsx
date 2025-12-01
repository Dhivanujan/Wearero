import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../lib/api'
import { toast } from 'sonner'

const AdminHomePage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (response.ok) {
          setOrders(data);
        } else {
          toast.error(data.message || 'Unable to load orders');
        }
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong while loading orders');
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong while loading products');
      }
    };

    fetchOrders();
    fetchProducts();
  }, []);

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-black dark:text-white'>Admin Dashboard</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className="p-4 shadow-md rounded-lg bg-white dark:bg-gray-800">
          <h2 className='text-xl font-semibold text-black dark:text-white'>Revenue</h2>
          <p className='text-2xl text-black dark:text-white'>${totalRevenue}</p>
        </div>
        <div className="p-4 shadow-md rounded-lg bg-white dark:bg-gray-800">
          <h2 className='text-xl font-semibold text-black dark:text-white'>Total Orders</h2>
          <p className='text-2xl text-black dark:text-white'>{totalOrders}</p>
          <Link to="/admin/orders" className="text-blue-500 dark:text-blue-400 hover:underline">Manage Orders</Link>
        </div>
        <div className="p-4 shadow-md rounded-lg bg-white dark:bg-gray-800">
          <h2 className='text-xl font-semibold text-black dark:text-white'>Total Products</h2>
          <p className='text-2xl text-black dark:text-white'>{totalProducts}</p>
          <Link to="/admin/products" className="text-blue-500 dark:text-blue-400 hover:underline">Manage Products</Link>
        </div>
      </div>
      <div className="mt-6">
        <h2 className='text-2xl font-bold mb-4 text-black dark:text-white'>Recent Orders</h2>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <table className="min-w-full text-left text-gray-500 dark:text-gray-400">
            <thead className='bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-300'>
              <tr>
                <th className='py-3 px-4'>Order ID</th>
                <th className='py-3 px-4'>User</th>
                <th className='py-3 px-4'>Total Price</th>
                <th className='py-3 px-4'>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id} className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer'>
                    <td className='p-4'>#{order._id}</td>
                    <td className='p-4'>{order.user?.name || "Unknown"}</td>
                    <td className='p-4'>{order.totalPrice}</td>
                    <td className='p-4'>{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='p-4 text-center text-gray-500 dark:text-gray-400'>No recent orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminHomePage