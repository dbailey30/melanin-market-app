import React, { useState } from 'react';
import './App.css';

// Import components
import LandingPage from './components/LandingPage';
import BusinessListings from './components/BusinessListings';
import BusinessDetail from './components/BusinessDetail';
import Favorites from './components/Favorites';
import Profile from './components/Profile';

function App() {
  // State management
  const [currentView, setCurrentView] = useState('landing');
  const [searchCity, setSearchCity] = useState('');
  const [searchState, setSearchState] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [user, setUser] = useState(null);

  // Navigation functions
  const navigateToBusinessListings = (city, state, category = '') => {
    setSearchCity(city);
    setSearchState(state);
    setSelectedCategory(category);
    setCurrentView('listings');
  };

  const navigateToBusinessDetail = (business) => {
    setSelectedBusiness(business);
    setCurrentView('detail');
  };

  const navigateToFavorites = () => {
    setCurrentView('favorites');
  };

  const navigateToProfile = () => {
    setCurrentView('profile');
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
  };

  const navigateToAddBusiness = () => {
    setCurrentView('add-business');
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage
            onSearch={navigateToBusinessListings}
            onAddBusiness={navigateToAddBusiness}
          />
        );
      case 'listings':
        return (
          <BusinessListings
            searchCity={searchCity}
            searchState={searchState}
            selectedCategory={selectedCategory}
            onBusinessClick={navigateToBusinessDetail}
            onBack={navigateToLanding}
          />
        );
      case 'detail':
        return (
          <BusinessDetail
            business={selectedBusiness}
            onBack={() => setCurrentView('listings')}
          />
        );
      case 'favorites':
        return (
          <Favorites
            onBusinessClick={navigateToBusinessDetail}
            onBack={navigateToLanding}
          />
        );
      case 'profile':
        return (
          <Profile
            user={user}
            onBack={navigateToLanding}
          />
        );
      case 'add-business':
        return (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={navigateToLanding}
                  className="mb-6 flex items-center text-orange-600 hover:text-orange-700"
                >
                  ← Back to Home
                </button>
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Your Business</h1>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Type *
                        </label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select Type</option>
                          <option value="llc">LLC</option>
                          <option value="corporation">Corporation</option>
                          <option value="sole-proprietorship">Sole Proprietorship</option>
                          <option value="partnership">Partnership</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Owner Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year Established *
                        </label>
                        <input
                          type="number"
                          required
                          min="1900"
                          max="2024"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Address *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Description *
                      </label>
                      <textarea
                        required
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Describe your business, services, and what makes you unique..."
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select Category</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="technology">Technology</option>
                          <option value="beauty">Beauty</option>
                          <option value="retail">Retail</option>
                          <option value="services">Services</option>
                          <option value="healthcare">Healthcare</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Owner Ethnicity *
                        </label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select Ethnicity</option>
                          <option value="black-owned">Black-owned</option>
                          <option value="hispanic-owned">Hispanic-owned</option>
                          <option value="asian-owned">Asian-owned</option>
                          <option value="native-american-owned">Native American-owned</option>
                          <option value="other-minority-owned">Other Minority-owned</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business License Number
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax ID/EIN
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                      >
                        Submit for Review
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <LandingPage onSearch={navigateToBusinessListings} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;

