import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const StripeButton = ({ clientSecret, totalPrice, onPaymentSuccess, isShippingValid, customerEmail }) => {
	const options = clientSecret ? { clientSecret, appearance: { theme: 'stripe' } } : undefined;

	if (!clientSecret || !stripePromise) {
		return (
			<Elements stripe={null}>
				<PaymentForm
					mode="mock"
					clientSecret={null}
					totalPrice={totalPrice}
					onPaymentSuccess={onPaymentSuccess}
					isShippingValid={isShippingValid}
					customerEmail={customerEmail}
				/>
			</Elements>
		);
	}

	return (
		<Elements stripe={stripePromise} options={options}>
			<PaymentForm
				mode="stripe"
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