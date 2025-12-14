import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { X, Lock, CreditCard } from 'lucide-react';

// Initialize Stripe (Replace with your Publishable Key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface CheckoutFormProps {
    amount: number;
    onSuccess: () => void;
    onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        // In a real app, you would fetch a ClientSecret from your backend here
        // const { clientSecret } = await fetch('/api/create-payment-intent').then(r => r.json());

        // For this demo/client-only integration, we'll simulate a processing delay
        // and then assume success if the card is "valid" (Stripe Elements handles validation).

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        const cardElement = elements.getElement(CardElement);

        if (cardElement) {
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (stripeError) {
                setError(stripeError.message || 'Payment failed');
                setProcessing(false);
            } else {
                console.log('[PaymentMethod]', paymentMethod);
                // Payment successful (mocked)
                onSuccess();
                setProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-bold text-gray-900">₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Lock size={12} /> Secure 256-bit SSL Encrypted
                </div>
            </div>

            <div className="p-4 border border-gray-300 rounded-lg">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full py-3 bg-eco-green hover:bg-eco-darkGreen text-white font-bold rounded-xl transition-all shadow-lg shadow-eco-green/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {processing ? (
                    <>Processing...</>
                ) : (
                    <>Pay ₹{amount.toLocaleString()}</>
                )}
            </button>
        </form>
    );
};

interface StripePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    onSuccess: () => void;
}

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({ isOpen, onClose, amount, onSuccess }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                        <CreditCard size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Secure Payment</h3>
                    <p className="text-sm text-gray-500">Complete your purchase safely using Stripe.</p>
                </div>

                <div className="p-6">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm amount={amount} onSuccess={onSuccess} onClose={onClose} />
                    </Elements>
                </div>

                <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-400">Powered by Stripe</p>
                </div>
            </div>
        </div>
    );
};

export default StripePaymentModal;
