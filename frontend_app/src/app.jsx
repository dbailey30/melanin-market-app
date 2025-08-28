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
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 pb-20">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={navigateToLanding}
                    className="flex items-center text-orange-600 hover:text-orange-700"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <h1 className="text-lg font-semibold text-gray-800">Add Your Business</h1>
                  <div className="w-12"></div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="container mx-auto px-4 py-6">
              <div className="max-w-lg mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">List Your Business</h2>
                    <p className="text-gray-600 text-sm">Join our community of minority-owned businesses</p>
                  </div>

                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your business name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Type *
                        </label>
                        <select
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="">Select Type</option>
                          <option value="llc">LLC</option>
                          <option value="corporation">Corporation</option>
                          <option value="sole-proprietorship">Sole Proprietorship</option>
                          <option value="partnership">Partnership</option>
                        </select>
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="2020"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Owner Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter owner's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Address *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="123 Main St, City, State, ZIP"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="business@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Description *
                      </label>
                      <textarea
                        required
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Describe your business, services, and what makes you unique..."
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

                    <div className="border-t pt-4 mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business License Number
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Optional"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax ID/EIN
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg"
                      >
                        Submit for Review
                      </button>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Your business will be reviewed and approved within 24-48 hours
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
              <div className="flex justify-around items-center max-w-md mx-auto">
                <button 
                  onClick={navigateToLanding}
                  className="flex flex-col items-center py-2 px-3"
                >
                  <svg className="w-6 h-6 text-gray-400 mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                  <span className="text-xs text-gray-400">Home</span>
                </button>
                
                <button className="flex flex-col items-center py-2 px-3">
                  <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-xs text-gray-400">Favorites</span>
                </button>
                
                <button className="flex flex-col items-center py-2 px-3">
                  <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-xs text-gray-400">Search</span>
                </button>
                
                <button className="flex flex-col items-center py-2 px-3">
                  <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs text-gray-400">Profile</span>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <LandingPage onSearch={navigateToBusinessListings} onAddBusiness={navigateToAddBusiness} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;

