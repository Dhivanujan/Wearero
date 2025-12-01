import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../lib/api'
import { toast } from 'sonner'

const OrderDetailsPage = () => {
    const {id} = useParams();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setOrderDetails(data);
                } else {
                    console.error("Failed to fetch order details");
                    toast.error(data.message || 'Unable to load order details');
                }
            } catch (error) {
                console.error("Error fetching order details:", error);
                toast.error('Something went wrong while fetching order details');
            }
        };

        fetchOrderDetails();
    }, [id])
  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6'>
        <h2 className='text-2xl md:text-3xl font-bold mb-6 text-black dark:text-white'>Order Details</h2>
        {!orderDetails ? (<p className='text-black dark:text-white'>Loading Order Details...</p>) : (<div className="p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {/* {Order info}  */}
            <div className="flex flex-col sm:flex-row justify-between mb-8">
                <div>
                    <h3 className='text-lg md:text-xl font-semibold text-black dark:text-white'>
                        Order ID: #{orderDetails._id}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                        {new Date(orderDetails.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
                    <span className={`${orderDetails.isPaid ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"} px-3 py-1 rounded-full text-small font-medium mb-2`}>
                        {orderDetails.isPaid ? "Approved" : "Pending"}
                    </span>
                    <span className={`${orderDetails.isDelivered ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"} px-3 py-1 rounded-full text-small font-medium mb-2`}>
                        {orderDetails.isDelivered ? "Delivered" : "Pending Delivery"}
                    </span>
                </div>
            </div>
            {/* {Customer, Payment, Shipping Info} */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8 text-gray-600 dark:text-gray-400">
                <div>
                    <h4 className='text-lg font-semibold mb-2 text-black dark:text-white'>Payment Info</h4>
                    <p>Payment Method: {orderDetails.paymentMethod}</p>
                    <p>Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
                </div>
                <div>
                    <h4 className='text-lg font-semibold mb-2 text-black dark:text-white'>Shipping Info</h4>
                    <p>Shipping Method: {orderDetails.shippingMethod || 'Standard Shipping'}</p>
                    <p>Address: {`${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}</p>
                </div>
            </div>
            {/* {Product List} */}
            <div className="overflow-x-auto">
                <h4 className='text-lg font-semibold mb-4 text-black dark:text-white'>Products</h4>
                <table className='min-w-full text-gray-600 dark:text-gray-400 mb-4'>
                    <thead className='bg-gray-100 dark:bg-gray-700 text-black dark:text-white'>
                        <tr>
                            <th className='py-2 px-4'>Name</th>
                            <th className='py-2 px-4'>Unit Price</th>
                            <th className='py-2 px-4'>Quantity</th>
                            <th className='py-2 px-4'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetails.orderItems.map((item) => {
                            const imageUrl = item.image?.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`;
                            return (
                            <tr key={item.productId} className='border-b border-gray-200 dark:border-gray-700'>
                                <td className='py-2 px-4 flex items-center'>
                                    <img src={imageUrl || 'https://picsum.photos/80?blur=2'} alt={item.name} className='w-12 h-12 object-cover rounded-lg mr-4'/>
                                    <Link to={`/product/${item.productId}`} className="text-blue-500 dark:text-blue-400 hover:underline">{item.name}</Link>
                                </td>
                                <td className='py-2 px-4'>${item.price}</td>
                                <td className='py-2 px-4'>{item.quantity}</td>
                                <td className='py-2 px-4'>${item.price * item.quantity}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
            {/* {Back to Orders Link} */}
            <Link to="/my-orders" className='text-blue-500 dark:text-blue-400 hover:underline'>Back to My Orders</Link>

            </div>) }
    </div>
  )
}

export default OrderDetailsPage