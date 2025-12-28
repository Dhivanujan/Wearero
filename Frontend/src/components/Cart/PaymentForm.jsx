import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';

const PaymentForm = ({
    clientSecret,
    totalPrice,
    onPaymentSuccess,
    isShippingValid,
    mode = 'stripe',
    customerEmail,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const isStripeMode = mode === 'stripe';

    const completeMockPayment = async () => {
        if (!isShippingValid) {
            toast.error('Please complete your shipping details before paying.');
            return;
        }

        setIsLoading(true);
        setMessage(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 700));
            const fakePaymentIntent = {
                id: `demo_${Date.now()}`,
                status: 'succeeded',
                email_address: customerEmail || 'demo@example.com',
            };
            toast.success('Payment successful (demo)');
            onPaymentSuccess?.(fakePaymentIntent);
        } catch (err) {
            toast.error('Could not complete payment. Please try again.');
            setMessage('Could not complete payment.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isStripeMode) {
            await completeMockPayment();
            return;
        }

        if (!isShippingValid) {
            toast.error('Please complete your shipping details before paying.');
            return;
        }

        if (!stripe || !elements) {
            toast.error('Payment is not ready. Please try again.');
            return;
        }

        if (!clientSecret) {
            toast.error('Payment is not ready yet. Please try again.');
            return;
        }

        setIsLoading(true);
        setMessage(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/order-confirmation`,
            },
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message);
            toast.error(error.message);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            toast.success('Payment successful!');
            onPaymentSuccess?.(paymentIntent);
        } else {
            setMessage('An unexpected error occurred.');
            toast.error('Payment could not be completed.');
        }
        setIsLoading(false);
    };

    const buttonLabel = isStripeMode ? `Pay $${totalPrice}` : 'Complete test payment';
    const processingLabel = isStripeMode ? 'Processing...' : 'Completing...';

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            {isStripeMode && clientSecret ? (
                <PaymentElement />
            ) : !isStripeMode ? (
                <div className="text-sm text-gray-600 dark:text-gray-300 border border-dashed border-gray-300 dark:border-gray-600 rounded p-3">
                    Test payment will be simulated. No real charge will occur.
                </div>
            ) : null}
            <button
                disabled={
                    isLoading ||
                    !isShippingValid ||
                    (isStripeMode && (!stripe || !elements || !clientSecret))
                }
                id="submit"
                className="w-full bg-black text-white py-3 rounded mt-4 hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">{processingLabel}</div> : buttonLabel}
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
