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
        <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-8 lg:py-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Page Title */}
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Checkout</h1>
                    <p className='mt-2 text-gray-600 dark:text-gray-400'>Complete your order</p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
                    {/* Left section - Form */}
                    <div className='lg:col-span-3 space-y-6'>
                        <div className='bg-white dark:bg-gray-900 rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-800'>
                            <form onSubmit={handleSubmit} className='space-y-8'>
                                {/* Contact Section */}
                                <div>
                                    <div className='flex items-center space-x-3 mb-6'>
                                        <div className='w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm'>1</div>
                                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Contact Information</h3>
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Email Address</label>
                                        <input
                                            type="email"
                                            value={user?.email || 'your@email.com'}
                                            className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:opacity-60'
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* Delivery Section */}
                                <div>
                                    <div className='flex items-center space-x-3 mb-6'>
                                        <div className='w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm'>2</div>
                                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Delivery Address</h3>
                                    </div>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>First Name</label>
                                            <input
                                                type="text"
                                                value={shippingAddress.firstName}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                                                className='w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent transition-all'
                                                placeholder='John'
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Last Name</label>
                                            <input
                                                type="text"
                                                value={shippingAddress.lastName}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                                                className='w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent transition-all'
                                                placeholder='Doe'
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Street Address</label>
                                        <input
                                            type="text"
                                            value={shippingAddress.address}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                            className='w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent transition-all'
                                            placeholder='123 Main Street'
                                            required
                                        />
                                    </div>
                                    <div className='mt-4 grid grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>City</label>
                                            <input
                                                type="text"
                                                value={shippingAddress.city}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                                className='w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent transition-all'
                                                placeholder='New York'
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Postal Code</label>
                                            <input
                                                type="text"
                                                value={shippingAddress.postalCode}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                                className='w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent transition-all'
                                                placeholder='10001'
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Country</label>
                                        <input
                                            type="text"
                                            value={shippingAddress.country}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                            className='w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent transition-all'
                                            placeholder='United States'
                                            required
                                        />
                                    </div>
                                    <div className='mt-4'>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Phone Number</label>
                                        <input
                                            type="tel"
                                            value={shippingAddress.phone}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                            className='w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent transition-all'
                                            placeholder='+1 (555) 000-0000'
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Payment Section */}
                                <div>
                                    <div className='flex items-center space-x-3 mb-6'>
                                        <div className='w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm'>3</div>
                                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Payment Method</h3>
                                    </div>
                                    <div className='space-y-3'>
                                        {isStripeConfigured && (
                                            <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'Stripe' ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                                                <input type="radio" name="paymentMethod" value="Stripe" checked={paymentMethod === "Stripe"} onChange={() => setPaymentMethod("Stripe")} className="sr-only" />
                                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${paymentMethod === 'Stripe' ? 'border-accent' : 'border-gray-300 dark:border-gray-600'}`}>
                                                    {paymentMethod === 'Stripe' && <div className='w-2.5 h-2.5 rounded-full bg-accent'></div>}
                                                </div>
                                                <div className='flex-1'>
                                                    <span className='font-medium text-gray-900 dark:text-white'>Credit / Debit Card</span>
                                                    <p className='text-sm text-gray-500 dark:text-gray-400'>Secure payment via Stripe</p>
                                                </div>
                                                <svg className='w-8 h-8 text-gray-400' viewBox='0 0 24 24' fill='currentColor'>
                                                    <path d='M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z'/>
                                                </svg>
                                            </label>
                                        )}
                                        <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'DemoPay' ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                                            <input type="radio" name="paymentMethod" value="DemoPay" checked={paymentMethod === "DemoPay"} onChange={() => setPaymentMethod("DemoPay")} className="sr-only" />
                                            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${paymentMethod === 'DemoPay' ? 'border-accent' : 'border-gray-300 dark:border-gray-600'}`}>
                                                {paymentMethod === 'DemoPay' && <div className='w-2.5 h-2.5 rounded-full bg-accent'></div>}
                                            </div>
                                            <div className='flex-1'>
                                                <span className='font-medium text-gray-900 dark:text-white'>Test Payment</span>
                                                <p className='text-sm text-gray-500 dark:text-gray-400'>Demo mode - no real payment</p>
                                            </div>
                                        </label>
                                        <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                                            <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="sr-only" />
                                            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-accent' : 'border-gray-300 dark:border-gray-600'}`}>
                                                {paymentMethod === 'COD' && <div className='w-2.5 h-2.5 rounded-full bg-accent'></div>}
                                            </div>
                                            <div className='flex-1'>
                                                <span className='font-medium text-gray-900 dark:text-white'>Cash on Delivery</span>
                                                <p className='text-sm text-gray-500 dark:text-gray-400'>Pay when you receive</p>
                                            </div>
                                        </label>
                                    </div>

                                    {!isStripeConfigured && paymentMethod === "Stripe" && (
                                        <div className='mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-sm text-red-600 dark:text-red-400'>
                                            Stripe keys are not configured. Please choose Test Payment or Cash on Delivery.
                                        </div>
                                    )}

                                    <div className='mt-6'>
                                        {paymentMethod === "Stripe" && isStripeConfigured ? (
                                            clientSecret && stripePromise ? (
                                                <Elements stripe={stripePromise} options={options}>
                                                    <PaymentForm mode="stripe" clientSecret={clientSecret} totalPrice={cart.totalPrice} onPaymentSuccess={handlePaymentSuccess} isShippingValid={isShippingValid} customerEmail={user?.email} />
                                                </Elements>
                                            ) : (
                                                <div className='flex items-center justify-center py-4'>
                                                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-accent'></div>
                                                </div>
                                            )
                                        ) : paymentMethod === "DemoPay" ? (
                                            <Elements stripe={null}>
                                                <PaymentForm mode="mock" clientSecret={null} totalPrice={cart.totalPrice} onPaymentSuccess={handlePaymentSuccess} isShippingValid={isShippingValid} customerEmail={user?.email} />
                                            </Elements>
                                        ) : (
                                            <button type="submit" disabled={isSubmitting} className='w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-semibold disabled:opacity-70 disabled:cursor-not-allowed hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
                                                {isSubmitting ? 'Processing order...' : 'Place Order'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Section - Order Summary */}
                    <div className='lg:col-span-2'>
                        <div className='sticky top-24 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-6'>Order Summary</h3>
                            
                            {/* Products */}
                            <div className='space-y-4 mb-6'>
                                {cart.products.map((product, index) => {
                                    const imageUrl = product.image?.startsWith('http') ? product.image : `${API_BASE_URL}${product.image}`;
                                    return (
                                        <div key={index} className='flex items-start space-x-4'>
                                            <div className='relative flex-shrink-0'>
                                                <img src={imageUrl || 'https://picsum.photos/120?blur=2'} alt={product.name} className='w-16 h-20 object-cover rounded-lg' />
                                                <span className='absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs font-bold rounded-full flex items-center justify-center'>{product.quantity}</span>
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <h4 className='text-sm font-medium text-gray-900 dark:text-white line-clamp-2'>{product.name}</h4>
                                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>{product.size} / {product.color}</p>
                                            </div>
                                            <p className='font-semibold text-gray-900 dark:text-white'>${(product.price * product.quantity)?.toLocaleString()}</p>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Divider */}
                            <div className='border-t border-gray-100 dark:border-gray-800 my-6'></div>

                            {/* Totals */}
                            <div className='space-y-3'>
                                <div className='flex justify-between text-sm'>
                                    <span className='text-gray-600 dark:text-gray-400'>Subtotal</span>
                                    <span className='text-gray-900 dark:text-white font-medium'>${cart.totalPrice?.toLocaleString()}</span>
                                </div>
                                <div className='flex justify-between text-sm'>
                                    <span className='text-gray-600 dark:text-gray-400'>Shipping</span>
                                    <span className='text-emerald-600 font-medium'>Free</span>
                                </div>
                                <div className='flex justify-between text-sm'>
                                    <span className='text-gray-600 dark:text-gray-400'>Tax</span>
                                    <span className='text-gray-900 dark:text-white font-medium'>Calculated at checkout</span>
                                </div>
                            </div>

                            <div className='border-t border-gray-100 dark:border-gray-800 my-6'></div>

                            <div className='flex justify-between items-center'>
                                <span className='text-lg font-semibold text-gray-900 dark:text-white'>Total</span>
                                <span className='text-2xl font-bold text-gray-900 dark:text-white'>${cart.totalPrice?.toLocaleString()}</span>
                            </div>

                            {/* Trust Badges */}
                            <div className='mt-6 pt-6 border-t border-gray-100 dark:border-gray-800'>
                                <div className='flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400'>
                                    <div className='flex items-center space-x-1'>
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                        </svg>
                                        <span>Secure</span>
                                    </div>
                                    <div className='flex items-center space-x-1'>
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                                        </svg>
                                        <span>Protected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout;