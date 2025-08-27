import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

// Initialize Stripe (use test key for development)
const stripePromise = loadStripe('pk_test_51234567890abcdef'); // Replace with actual publishable key

const SubscriptionPlans = ({ userId, userType = 'consumer' }) => {
  const [plans, setPlans] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await fetch('/api/subscription-plans');
      const data = await response.json();
      if (data.success) {
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planType) => {
    setSelectedPlan(planType);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedPlan(null);
    // Refresh user subscription status
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getRelevantPlans = () => {
    if (userType === 'business') {
      return {
        business_basic: plans.business_basic,
        business_premium: plans.business_premium,
        business_enterprise: plans.business_enterprise
      };
    }
    return {
      user_premium: plans.user_premium
    };
  };

  const relevantPlans = getRelevantPlans();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {userType === 'business' ? 'Business Plans' : 'Premium Features'}
        </h2>
        <p className="text-lg text-gray-600">
          {userType === 'business' 
            ? 'Grow your business with powerful tools and analytics'
            : 'Unlock premium features for the best experience'
          }
        </p>
      </div>

      {!showPayment ? (
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(relevantPlans).map(([planType, plan]) => (
            <div key={planType} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  ${plan.price}
                </div>
                <div className="text-gray-500">per {plan.interval}</div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(planType)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>

              {planType.startsWith('business') && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  7-day free trial included
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Elements stripe={stripePromise}>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Complete Your Subscription
                </h3>
                <p className="text-gray-600">
                  {plans[selectedPlan]?.name} - ${plans[selectedPlan]?.price}/{plans[selectedPlan]?.interval}
                </p>
              </div>

              <PaymentForm
                userId={userId}
                planType={selectedPlan}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPayment(false)}
              />
            </div>
          </div>
        </Elements>
      )}
    </div>
  );
};

export default SubscriptionPlans;

