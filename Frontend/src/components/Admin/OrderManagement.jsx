import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../lib/api'
import { toast } from 'sonner'

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(data);
            } else {
                toast.error(data.message || 'Unable to load orders');
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error('Something went wrong while loading orders');
        }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                fetchOrders();
                toast.success('Order updated');
            } else {
                const payload = await response.json();
                toast.error(payload.message || 'Unable to update order');
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error('Something went wrong while updating the order');
        }
    }
  return (
    <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-boldmb-6">Order Management</h2>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-left text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Total Price</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr 
                            key={order._id}
                            className='border-b hover:bg-gray-50 cursor-pointer'>
                                <td className='py-4 px-4 font-medium text-gray-900 whitespace-nowrap'>
                                    #{order._id}
                                </td>
                                <td className="p-4">{order.user?.name || 'Guest'}</td>
                                <td className="p-4">{order.totalPrice}</td>
                                <td className="p-4">
                                    <select 
                                    value={order.status} 
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5'>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => handleStatusChange(order._id, "Delivered")} 
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Mark as Delivered</button>
                                </td>
                            </tr>
                        ))
                    ) : (<tr>
                        <td colSpan={5} className='p-4 text-center text-gray-500'>No Orders found.</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default OrderManagement