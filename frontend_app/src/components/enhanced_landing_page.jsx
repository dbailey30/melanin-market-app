import React, { useState } from 'react';

const LandingPage = ({ onSearch, onAddBusiness }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    if (searchInput.trim()) {
      // Parse city, state from input
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
          <img 
            src="/melanin_market_logo.png" 
            alt="Melanin Market" 
            className="w-20 h-20 mx-auto mb-4"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
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

export default LandingPage;

