import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../lib/api';

const PaymentForm = ({ clientSecret, totalPrice, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/order-confirmation`, // This might not be used if we handle success manually
            },
            redirect: 'if_required', // Prevent automatic redirect to handle success manually
        });

        if (error) {
            setMessage(error.message);
            toast.error(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            toast.success("Payment successful!");
            onPaymentSuccess(paymentIntent);
            setIsLoading(false);
        } else {
            setMessage("An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <PaymentElement />
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-black text-white py-3 rounded mt-4 hover:bg-gray-800 transition"
            >
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Processing...</div> : `Pay $${totalPrice}`}
                </span>
            </button>
            {message && <div id="payment-message" className="text-red-500 mt-2">{message}</div>}
        </form>
    );
};

export default PaymentForm;
