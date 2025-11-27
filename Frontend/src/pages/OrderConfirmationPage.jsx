import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../lib/api'
import { useCart } from '../context/CartContext'
import { toast } from 'sonner'

const OrderConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { checkoutId } = location.state || {};
    const [checkout, setCheckout] = useState(null);
    const { clearCart } = useCart();

    useEffect(() => {
        if (!checkoutId) {
            navigate('/my-orders');
            return;
        }

        const fetchOrder = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/orders/${checkoutId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCheckout(data);
                    clearCart();
                } else {
                    const payload = await response.json();
                    toast.error(payload.message || 'Unable to load your order');
                }
            } catch (error) {
                console.error("Error fetching order:", error);
                toast.error('Something went wrong while fetching the order');
            }
        };

        fetchOrder();
    }, [checkoutId, clearCart, navigate]);

    const calculateEstimateDelivery = (createdAt) => {
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate() + 10);
        return orderDate.toLocaleDateString()
    }

    if (!checkout) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
        <h1 className='text-4xl font-bold text-center text-emerald-700 mb-8'>
            Thank You for Your Order!
        </h1>

        {checkout && (
            <div className="p-6 rounded-lg border">
                <div className="flex justify-between mb-20">
                    {/* {OrderId and Date} */}
                    <div>
                        <h2 className='text-xl font-semibold'>
                            Order ID: {checkout._id}
                        </h2>
                        <p className='text-gray-500'>
                            Order date: {new Date(checkout.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    {/* {Estimated Delivery} */}
                    <div>
                        <p className='text-emerald-700 text-sm'>
                            Estimated Delivery: {calculateEstimateDelivery(checkout.createdAt)}
                        </p>
                    </div>
                </div>

                {/* {Ordered Items} */}
                <div className='mb-20'>
                    {checkout.orderItems.map((item) => (
                        <div key={item.productId} className='flex items-center mb-4'>
                            <img src={item.image || "https://picsum.photos/150?random=1"} alt={item.name} className='w-16 h-16 object-cover rounded-md mr-4' />
                            <div>
                                <h4 className='text-md font-semibold'>{item.name}</h4>
                                <p className='text-sm text-gray-500'>
                                    {item.color} | {item.size}
                                </p>
                            </div>
                            <div className='ml-auto text-right'>
                                <p className='text-md'>$ {item.price}</p>
                                <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* {Payment and Delivery Info} */}
                <div className='grid grid-cols-2 gap-8'>
                    <div>
                        <h4 className='text-lg font-semibold mb-2'>Payment</h4>
                        <p className='text-gray-600'>COD</p>
                    </div>
                    <div>
                        <h4 className='text-lg font-semibold mb-2'>Delivery</h4>
                        <p className='text-gray-600'>
                            {checkout.shippingAddress.address}
                        </p>
                        <p className='text-gray-600'>
                            {checkout.shippingAddress.city}, {checkout.shippingAddress.country}
                        </p>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default OrderConfirmationPage