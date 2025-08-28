import React, { useState } from 'react';
import './App.css';

// Simple Landing Page Component
const LandingPage = ({ onSearch, onAddBusiness }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    if (searchInput.trim()) {
      const parts = searchInput.split(',').map(part => part.trim());
      const city = parts[0] || '';
      const state = parts[1] || 'NY';
      onSearch(city, state);
    }
  };

  const handleCityClick = (city, state) => {
    onSearch(city, state);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="text-center pt-16 pb-8">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-orange-400 to-amber-600 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
            </svg>
          </div>
          <div className="text-4xl font-bold text-gray-800 mb-2">MELANIN</div>
          <div className="text-4xl font-bold text-gray-800">MARKET</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-md">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Discover Minority-Owned Businesses
          </h1>
          <p className="text-gray-600 mb-8">
            Support local entrepreneurs and build stronger communities together
          </p>
        </div>

        {/* Search Section */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter City, State"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-4 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-400 text-center text-gray-700 placeholder-orange-400"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <button
            onClick={handleSearch}
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Businesses
          </button>

          <button
            onClick={onAddBusiness}
            className="w-full border-2 border-orange-500 text-orange-500 py-4 rounded-xl font-semibold text-lg hover:bg-orange-50 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            List Your Business
          </button>
        </div>

        {/* Popular Cities */}
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4 font-medium">Popular Cities:</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => handleCityClick('Buffalo', 'NY')}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors"
            >
              Buffalo, NY
            </button>
            <button
              onClick={() => handleCityClick('Rochester', 'NY')}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors"
            >
              Rochester, NY
            </button>
            <button
              onClick={() => handleCityClick('Syracuse', 'NY')}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors"
            >
              Syracuse, NY
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="space-y-6 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Discover Local</h3>
            <p className="text-gray-600 text-sm">
              Find authentic minority-owned businesses in your community
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Build Community</h3>
            <p className="text-gray-600 text-sm">
              Support entrepreneurs and strengthen local economies
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button className="flex flex-col items-center py-2 px-3">
            <svg className="w-6 h-6 text-orange-500 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-xs font-medium text-orange-500">Home</span>
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

      {/* Bottom spacing for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
};

// Simple Business Listings Component
const BusinessListings = ({ searchCity = '', searchState = '', onBack }) => {
  const mockBusinesses = [
    {
      id: 1,
      name: "Soul Food Kitchen",
      category: "Restaurant",
      address: "123 Main St, Buffalo, NY",
      phone: "(716) 555-0123",
      description: "Authentic soul food restaurant serving the community for over 20 years.",
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
      rating: 4.8,
      reviews_count: 89,
      owner_ethnicity: "Asian-owned",
      verified: true
    },
    {
      id: 3,
      name: "Abuela's Market",
      category: "Grocery",
      address: "789 Market St, Rochester, NY",
      phone: "(585) 555-0789",
      description: "Family-owned grocery store with authentic Hispanic foods and ingredients.",
      rating: 4.6,
      reviews_count: 203,
      owner_ethnicity: "Hispanic-owned",
      verified: true
    }
  ];

  const filteredBusinesses = searchCity 
    ? mockBusinesses.filter(business =>
        business.address.toLowerCase().includes(searchCity.toLowerCase())
      )
    : mockBusinesses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-orange-600 hover:text-orange-700"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              {searchCity ? `${searchCity}, ${searchState}` : 'Businesses'}
            </h1>
            <div className="w-12"></div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 mb-4 pt-4">
        <p className="text-gray-600 text-sm">
          {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'} found
        </p>
      </div>

      {/* Business grid */}
      <div className="px-4 space-y-4">
        {filteredBusinesses.map((business) => (
          <div key={business.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 flex-1">{business.name}</h3>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full ml-2">
                  {business.category}
                </span>
              </div>

              <p className="text-sm text-orange-600 font-medium mb-2">{business.owner_ethnicity}</p>
              <p className="text-gray-700 text-sm mb-3">{business.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.floor(business.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-700 font-medium">{business.rating}</span>
                  <span className="ml-1">({business.reviews_count})</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {business.address}
                </p>
                <p className="flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {business.phone}
                </p>
              </div>

              <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [searchCity, setSearchCity] = useState('');
  const [searchState, setSearchState] = useState('');

  const navigateToBusinessListings = (city, state) => {
    setSearchCity(city);
    setSearchState(state);
    setCurrentView('listings');
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
  };

  const navigateToAddBusiness = () => {
    alert('Add business feature coming soon!');
  };

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
            onBack={navigateToLanding}
          />
        );
      default:
        return (
          <LandingPage
            onSearch={navigateToBusinessListings}
            onAddBusiness={navigateToAddBusiness}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;

