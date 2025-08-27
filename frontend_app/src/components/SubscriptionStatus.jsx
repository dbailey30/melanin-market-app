import React, { useState, useEffect } from 'react';

const SubscriptionStatus = ({ userId }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchSubscriptions();
    }
  }, [userId]);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch(`/api/user/${userId}/subscriptions`);
      const data = await response.json();
      if (data.success) {
        setSubscriptions(data.subscriptions);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      const response = await fetch(`/api/subscription/${subscriptionId}/cancel`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        fetchSubscriptions(); // Refresh the list
      } else {
        alert('Failed to cancel subscription: ' + data.error);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription');
    }
  };

  const getSubscriptionTypeLabel = (type) => {
    const labels = {
      'user_premium': 'Premium User',
      'business_basic': 'Business Basic',
      'business_premium': 'Business Premium',
      'business_enterprise': 'Business Enterprise'
    };
    return labels[type] || type;
  };

  const getStatusColor = (subscription) => {
    if (!subscription.is_active) {
      return 'text-red-600 bg-red-50';
    }
    if (subscription.is_trial) {
      return 'text-yellow-600 bg-yellow-50';
    }
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = (subscription) => {
    if (!subscription.is_active) {
      return 'Inactive';
    }
    if (subscription.is_trial) {
      return `Trial (${subscription.days_remaining} days left)`;
    }
    return 'Active';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscriptions</h3>
        <p className="text-gray-600">Upgrade to unlock premium features and grow your business.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Your Subscriptions</h3>
      
      {subscriptions.map((subscription) => (
        <div key={subscription.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl font-semibold text-gray-900">
                {getSubscriptionTypeLabel(subscription.subscription_type)}
              </h4>
              <p className="text-gray-600">
                ${subscription.amount}/{subscription.interval}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription)}`}>
              {getStatusText(subscription)}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Current Period</p>
              <p className="font-medium">
                {new Date(subscription.current_period_start).toLocaleDateString()} - {' '}
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Days Remaining</p>
              <p className="font-medium">{subscription.days_remaining} days</p>
            </div>
          </div>

          {subscription.trial_end && subscription.is_trial && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Trial Period:</strong> Your trial ends on {new Date(subscription.trial_end).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            {subscription.is_active && (
              <button
                onClick={() => handleCancelSubscription(subscription.id)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
              >
                Cancel Subscription
              </button>
            )}
            
            <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
              Manage Billing
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionStatus;

