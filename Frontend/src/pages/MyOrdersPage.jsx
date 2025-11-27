import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../lib/api';
import { toast } from 'sonner';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(data);
          } else {
            toast.error(data.message || 'Unable to load your orders');
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
          toast.error('Something went wrong while fetching your orders');
        }
    };

      fetchOrders();
      }, [navigate]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`)
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>

      <div className="relative shadow-md sm:rounded-lg overflow-hidden">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-2 px-4 sm:py-3">Image</th>
              <th className="py-2 px-4 sm:py-3">Order ID</th>
              <th className="py-2 px-4 sm:py-3">Created</th>
              <th className="py-2 px-4 sm:py-3">Shipping Address</th>
              <th className="py-2 px-4 sm:py-3">Items</th>
              <th className="py-2 px-4 sm:py-3">Price</th>
              <th className="py-2 px-4 sm:py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr onClick={() => handleRowClick(order._id)} key={order._id} className='border-b hover:border-gray-50 cursor-pointer'>
                  <td className='py-2 px-2 sm:py-4 sm:px-4'>
                    <img src={order.orderItems[0].image} alt={order.orderItems[0].name} 
                    className='w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg'/>
                  </td>
                  <td className='py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap'>
                    #{order._id}
                  </td>
                  <td className='py-2 px-2 sm:py-4 sm:px-4'>
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>
                  <td className='py-2 px-2 sm:py-4 sm:px-4'>
                    {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.country}` : "N/A"}
                  </td>
                  <td className='py-2 px-2 sm:py-4 sm:px-4'>
                    {order.orderItems.length}
                  </td>
                  <td className='py-2 px-2 sm:py-4 sm:px-4'>
                    ${order.totalPrice}
                  </td>
                  <td className='py-2 px-2 sm:py-4 sm:px-4'>
                    <span className={`${order.isPaid ? "bg-green-50 text-green-700" : "bg-red-100 text-red-700"} px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}>
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ): (
              <tr>
                <td className='py-4 px-4 text-center text-gray-500'>
                  You have no orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
