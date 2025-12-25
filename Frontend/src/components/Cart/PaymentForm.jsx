import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';

const PaymentForm = ({ clientSecret, totalPrice, onPaymentSuccess, isShippingValid }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (!clientSecret) {
            toast.error('Payment is not ready yet. Please try again.');
            return;
        }

        if (!isShippingValid) {
            toast.error('Please complete your shipping details before paying.');
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
                disabled={isLoading || !stripe || !elements || !isShippingValid || !clientSecret}
                id="submit"
                className="w-full bg-black text-white py-3 rounded mt-4 hover:bg-gray-800 transition"
            >
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Processing...</div> : `Pay $${totalPrice}`}
                </span>
            </button>
            {!isShippingValid && (
                <div className="text-sm text-red-500 mt-2">
                    Please fill in delivery details to enable payment.
                </div>
            )}
            {message && <div id="payment-message" className="text-red-500 mt-2">{message}</div>}
        </form>
    );
};

export default PaymentForm;
