// Complete API service for Melanin Market
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production
  : 'http://localhost:5000';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}/api${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Business API functions
export const businessAPI = {
  // Search businesses by city and state
  searchBusinesses: async (city, state, category = '') => {
    try {
      const params = new URLSearchParams({ city, state });
      if (category) params.append('category', category);
      
      return await apiCall(`/businesses/search?${params}`);
    } catch (error) {
      console.error('Search businesses failed:', error);
      // Return mock data for development
      return {
        businesses: [
          {
            id: 1,
            name: "Soul Food Kitchen",
            category: "Restaurant",
            address: "123 Main St, Buffalo, NY",
            phone: "(716) 555-0123",
            description: "Authentic soul food restaurant serving the community for over 20 years.",
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
            rating: 4.5,
            reviews_count: 127,
            owner_ethnicity: "Black-owned",
            verified: true
          },
          {
            id: 2,
            name: "Tech Solutions Plus",
            category: "Technology",
            address: "456 Tech Ave, Buffalo, NY",
            phone: "(716) 555-0456",
            description: "Full-service IT consulting and software development company.",
            image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
            rating: 4.8,
            reviews_count: 89,
            owner_ethnicity: "Asian-owned",
            verified: true
          }
        ]
      };
    }
  },

  // Get business by ID
  getBusinessById: async (id) => {
    try {
      return await apiCall(`/businesses/${id}`);
    } catch (error) {
      console.error('Get business failed:', error);
      return null;
    }
  },

  // Add new business
  addBusiness: async (businessData) => {
    try {
      return await apiCall('/businesses', {
        method: 'POST',
        body: JSON.stringify(businessData),
      });
    } catch (error) {
      console.error('Add business failed:', error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      return await apiCall('/businesses/categories');
    } catch (error) {
      console.error('Get categories failed:', error);
      return {
        categories: ['Restaurant', 'Technology', 'Beauty', 'Retail', 'Services', 'Healthcare']
      };
    }
  }
};

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: async (userId) => {
    try {
      return await apiCall(`/users/${userId}`);
    } catch (error) {
      console.error('Get profile failed:', error);
      return null;
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      return await apiCall(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  },

  // Get user favorites
  getFavorites: async (userId) => {
    try {
      return await apiCall(`/users/${userId}/favorites`);
    } catch (error) {
      console.error('Get favorites failed:', error);
      return { favorites: [] };
    }
  },

  // Add to favorites
  addFavorite: async (userId, businessId) => {
    try {
      return await apiCall(`/users/${userId}/favorites`, {
        method: 'POST',
        body: JSON.stringify({ business_id: businessId }),
      });
    } catch (error) {
      console.error('Add favorite failed:', error);
      throw error;
    }
  },

  // Remove from favorites
  removeFavorite: async (userId, businessId) => {
    try {
      return await apiCall(`/users/${userId}/favorites/${businessId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Remove favorite failed:', error);
      throw error;
    }
  }
};

// Reviews API functions
export const reviewAPI = {
  // Get reviews for a business
  getBusinessReviews: async (businessId) => {
    try {
      return await apiCall(`/businesses/${businessId}/reviews`);
    } catch (error) {
      console.error('Get reviews failed:', error);
      return { reviews: [] };
    }
  },

  // Add a review
  addReview: async (businessId, reviewData) => {
    try {
      return await apiCall(`/businesses/${businessId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    } catch (error) {
      console.error('Add review failed:', error);
      throw error;
    }
  }
};

// Analytics API functions
export const analyticsAPI = {
  // Track user event
  trackEvent: async (eventData) => {
    try {
      return await apiCall('/analytics/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      console.error('Track event failed:', error);
      // Don't throw error for analytics - just log it
    }
  },

  // Get business analytics
  getBusinessAnalytics: async (businessId) => {
    try {
      return await apiCall(`/analytics/business/${businessId}`);
    } catch (error) {
      console.error('Get analytics failed:', error);
      return { views: 0, clicks: 0, favorites: 0 };
    }
  }
};

// Payment API functions
export const paymentAPI = {
  // Create subscription
  createSubscription: async (planId, paymentMethodId) => {
    try {
      return await apiCall('/payments/subscriptions', {
        method: 'POST',
        body: JSON.stringify({ plan_id: planId, payment_method_id: paymentMethodId }),
      });
    } catch (error) {
      console.error('Create subscription failed:', error);
      throw error;
    }
  },

  // Get subscription status
  getSubscriptionStatus: async (userId) => {
    try {
      return await apiCall(`/payments/subscriptions/${userId}`);
    } catch (error) {
      console.error('Get subscription failed:', error);
      return { status: 'free', plan: 'free' };
    }
  }
};

// Default export for backward compatibility
export default {
  businessAPI,
  userAPI,
  reviewAPI,
  analyticsAPI,
  paymentAPI
};

