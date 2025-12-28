import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../lib/api';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;
const isStripeConfigured = Boolean(stripePublicKey);

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, loading, clearCart } = useCart();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(isStripeConfigured ? "Stripe" : "DemoPay");
    const [clientSecret, setClientSecret] = useState("");
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: ""
    });

    const isShippingValid = useMemo(() => {
        const { firstName, lastName, address, city, postalCode, country, phone } = shippingAddress;
        return [firstName, lastName, address, city, postalCode, country, phone].every(
            (value) => typeof value === 'string' && value.trim().length > 0
        );
    }, [shippingAddress]);

    useEffect(() => {
        if (paymentMethod !== "Stripe" || !isStripeConfigured || !cart || cart.products.length === 0) {
            return;
        }

        const createPaymentIntent = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_BASE_URL}/api/payment/create-payment-intent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        products: cart.products
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    setClientSecret(data.clientSecret);
                } else {
                    console.error("Failed to create payment intent:", data.error);
                    toast.error(data.error || "Failed to initialize payment");
                }
            } catch (error) {
                console.error("Error creating payment intent:", error);
                toast.error("Error initializing payment");
            }
        };

        createPaymentIntent();
    }, [paymentMethod, cart, isStripeConfigured]);

    const handleOrderCreation = async (paymentStatus, paymentResult = {}) => {
        const token = localStorage.getItem('token');
        const orderData = {
            orderItems: cart.products,
            shippingAddress: {
                address: shippingAddress.address,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country,
                phone: shippingAddress.phone,
            },
            paymentMethod: paymentMethod,
            totalPrice: cart.totalPrice,
            paymentStatus,
            paymentResult
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();
            if (response.ok) {
                clearCart();
                toast.success('Order placed successfully');
                navigate(`/order-confirmation`, { state: { checkoutId: data._id } });
            } else {
                toast.error(data.message || "Failed to place order");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error('Something went wrong while placing your order');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaymentSuccess = async (paymentIntent) => {
        await handleOrderCreation('paid', {
            id: paymentIntent.id,
            status: paymentIntent.status,
            email_address: paymentIntent.receipt_email
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (paymentMethod === "COD") {
            setIsSubmitting(true);
            await handleOrderCreation('pending');
        }
        // For Stripe, the submission is handled in PaymentForm
    };

    if (loading) {
        return (
            <div className='flex h-64 items-center justify-center text-gray-600 dark:text-gray-400'>
                Preparing your checkout...
            </div>
        );
    }

    if (!cart || cart.products.length === 0) {
        return (
            <div className='max-w-2xl mx-auto py-20 text-center'>
                <h2 className='text-2xl font-semibold mb-4 text-black dark:text-white'>Your cart is empty</h2>
                <p className='text-gray-600 dark:text-gray-400 mb-6'>Browse the latest collections and add items to your cart before checking out.</p>
            </div>
        );
    }

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
            {/* Left section */}
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6'>
                <h2 className='text-2xl uppercase mb-6 text-black dark:text-white'>Checkout</h2>
                <form onSubmit={handleSubmit}>
                    <h3 className='text-lg mb-4 text-black dark:text-white'>Contact Details</h3>
                    <div className='mb-4'>
                        <label className='block text-gray-700 dark:text-gray-300'>Email</label>
                        <input
                            type="email"
                            value={user?.email || 'your@email.com'}
                            className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white'
                            disabled
                        />
                    </div>

                    <h3 className='text-lg mb-4 text-black dark:text-white'>Delivery</h3>
                    <div className='mb-4 grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-gray-700 dark:text-gray-300'>First Name</label>
                            <input
                                type="text"
                                value={shippingAddress.firstName}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                                }
                                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white'
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-gray-700 dark:text-gray-300'>Last Name</label>
                            <input
                                type="text"
                                value={shippingAddress.lastName}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                                }
                                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white'
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4 ">
                        <label className='block text-gray-700 dark:text-gray-300'>Address</label>
                        <input type="text"
                            value={shippingAddress.address}
                            onChange={(e) => setShippingAddress({
                                ...shippingAddress,
                                address: e.target.value
                            })} className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white' required />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className='block text-gray-700 dark:text-gray-300'>City</label>
                            <input
                                type="text"
                                value={shippingAddress.city}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                                }
                                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white'
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-gray-700 dark:text-gray-300'>Postal Code</label>
                            <input
                                type="text"
                                value={shippingAddress.postalCode}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                                }
                                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white'
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4 ">
                        <label className='block text-gray-700 dark:text-gray-300'>Country</label>
                        <input type="text"
                            value={shippingAddress.country}
                            onChange={(e) => setShippingAddress({
                                ...shippingAddress,
                                country: e.target.value
                            })} className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white' required />
                    </div>
                    <div className="mb-4 ">
                        <label className='block text-gray-700 dark:text-gray-300'>Phone</label>
                        <input type="tel"
                            value={shippingAddress.phone}
                            onChange={(e) => setShippingAddress({
                                ...shippingAddress,
                                phone: e.target.value
                            })} className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white' required />
                    </div>

                    <div className="mt-6">
                        <h3 className='text-lg mb-4 text-black dark:text-white'>Payment Method</h3>
                        <div className="flex flex-col gap-2 mb-4">
                            {isStripeConfigured && (
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Stripe"
                                        checked={paymentMethod === "Stripe"}
                                        onChange={() => setPaymentMethod("Stripe")}
                                        className="mr-2"
                                    />
                                    Card (Stripe)
                                </label>
                            )}
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="DemoPay"
                                    checked={paymentMethod === "DemoPay"}
                                    onChange={() => setPaymentMethod("DemoPay")}
                                    className="mr-2"
                                />
                                Test Payment (no Stripe account)
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={paymentMethod === "COD"}
                                    onChange={() => setPaymentMethod("COD")}
                                    className="mr-2"
                                />
                                Cash on Delivery
                            </label>
                        </div>

                        {!isStripeConfigured && paymentMethod === "Stripe" && (
                            <div className='text-sm text-red-500 mb-4'>Stripe keys are not configured. Please choose Test Payment or Cash on Delivery.</div>
                        )}

                        {paymentMethod === "Stripe" && isStripeConfigured ? (
                            clientSecret && stripePromise ? (
                                <Elements stripe={stripePromise} options={options}>
                                    <PaymentForm
                                        mode="stripe"
                                        clientSecret={clientSecret}
                                        totalPrice={cart.totalPrice}
                                        onPaymentSuccess={handlePaymentSuccess}
                                        isShippingValid={isShippingValid}
                                        customerEmail={user?.email}
                                    />
                                </Elements>
                            ) : (
                                <div>Loading payment...</div>
                            )
                        ) : paymentMethod === "DemoPay" ? (
                            <Elements stripe={null}>
                                <PaymentForm
                                    mode="mock"
                                    clientSecret={null}
                                    totalPrice={cart.totalPrice}
                                    onPaymentSuccess={handlePaymentSuccess}
                                    isShippingValid={isShippingValid}
                                    customerEmail={user?.email}
                                />
                            </Elements>
                        ) : (
                            <button type="submit" disabled={isSubmitting} className='w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded disabled:opacity-70 disabled:cursor-not-allowed hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors'>
                                {isSubmitting ? 'Processing order...' : 'Place Order'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
            {/* {Right Section} */}
            <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg '>
                <h3 className='text-lg mb-4 text-black dark:text-white'>Order Summary</h3>
                <div className="border-t border-gray-200 dark:border-gray-700 py-4 mb-4">
                    {cart.products.map((product, index) => {
                        const imageUrl = product.image?.startsWith('http') ? product.image : `${API_BASE_URL}${product.image}`;
                        return (
                            <div key={index} className='flex items-start justify-between py-2 border-b border-gray-200 dark:border-gray-700'>
                                <div className="flex items-start">
                                    <img
                                        src={imageUrl || 'https://picsum.photos/120?blur=2'}
                                        alt={product.name}
                                        className='w-20 h-24 object-cover mr-4' />
                                    <div>
                                        <h3 className='text-md text-black dark:text-white'>{product.name}</h3>
                                        <p className='text-gray-500 dark:text-gray-400'>Size: {product.size}</p>
                                        <p className='text-gray-500 dark:text-gray-400'>Color: {product.color}</p>
                                    </div>
                                </div>
                                <p className='text-xl text-black dark:text-white'>${product.price?.toLocaleString()}</p>
                            </div>
                        )
                    })}
                </div>
                <div className='flex justify-between items-center text-lg mb-4 text-black dark:text-white'>
                    <p>Subtotal</p>
                    <p>${cart.totalPrice?.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center text-lg text-black dark:text-white">
                    <p>Shipping</p>
                    <p>Free</p>
                </div>
                <div className="flex justify-between items-center text-lg mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 text-black dark:text-white">
                    <p>Total</p>
                    <p>${cart.totalPrice?.toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}

export default Checkout;