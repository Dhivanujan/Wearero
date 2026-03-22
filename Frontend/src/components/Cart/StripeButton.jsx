import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const StripeButton = ({ clientSecret, totalPrice, onPaymentSuccess, isShippingValid, customerEmail }) => {
	if (!stripePublicKey || !stripePromise) {
		return (
			<div className="text-sm text-red-500">
				Card payments are currently unavailable. Please choose Cash on Delivery.
			</div>
		);
	}

	if (!clientSecret) {
		return (
			<div className="flex items-center justify-center py-4">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
			</div>
		);
	}

	const options = { clientSecret, appearance: { theme: 'stripe' } };

	return (
		<Elements stripe={stripePromise} options={options}>
			<PaymentForm
				clientSecret={clientSecret}
				totalPrice={totalPrice}
				onPaymentSuccess={onPaymentSuccess}
				isShippingValid={isShippingValid}
				customerEmail={customerEmail}
			/>
		</Elements>
	);
};

export default StripeButton;