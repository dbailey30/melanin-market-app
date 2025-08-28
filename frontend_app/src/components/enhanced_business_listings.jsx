import React, { useState, useEffect } from 'react';

// Mock data for businesses
const mockBusinesses = [
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
  },
  {
    id: 3,
    name: "Abuela's Market",
    category: "Grocery",
    address: "789 Market St, Rochester, NY",
    phone: "(585) 555-0789",
    description: "Family-owned grocery store with authentic Hispanic foods and ingredients.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    rating: 4.6,
    reviews_count: 203,
    owner_ethnicity: "Hispanic-owned",
    verified: true
  },
  {
    id: 4,
    name: "Harmony Hair Salon",
    category: "Beauty",
    address: "321 Style Ave, Syracuse, NY",
    phone: "(315) 555-0321",
    description: "Professional hair care and styling for all hair types and textures.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
    rating: 4.9,
    reviews_count: 156,
    owner_ethnicity: "Black-owned",
    verified: true
  },
  {
    id: 5,
    name: "Mama Rosa's Pizzeria",
    category: "Restaurant",
    address: "654 Pizza Blvd, Rochester, NY",
    phone: "(585) 555-0654",
    description: "Traditional Italian pizza made with family recipes passed down for generations.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    rating: 4.7,
    reviews_count: 312,
    owner_ethnicity: "Hispanic-owned",
    verified: true
  },
  {
    id: 6,
    name: "Urban Threads Boutique",
    category: "Retail",
    address: "987 Fashion St, Syracuse, NY",
    phone: "(315) 555-0987",
    description: "Trendy clothing and accessories for the modern urban professional.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    rating: 4.4,
    reviews_count: 98,
    owner_ethnicity: "Black-owned",
    verified: true
  }
];

const BusinessListings = ({ searchCity = '', searchState = '', selectedCategory = '', onBusinessClick, onBack }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categories = ['All', 'Restaurant', 'Technology', 'Beauty', 'Retail', 'Grocery'];

  useEffect(() => {
    const loadBusinesses = () => {
      setLoading(true);
      
      let filteredBusinesses = mockBusinesses;
      
      if (searchCity) {
        filteredBusinesses = filteredBusinesses.filter(business =>
          business.address.toLowerCase().includes(searchCity.toLowerCase())
        );
      }
      
      if (selectedCategory) {
        filteredBusinesses = filteredBusinesses.filter(business =>
          business.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
      
      setTimeout(() => {
        setBusinesses(filteredBusinesses);
        setLoading(false);
      }, 500);
    };

    loadBusinesses();
  }, [searchCity, searchState, selectedCategory]);

  const toggleFavorite = (businessId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(businessId)) {
      newFavorites.delete(businessId);
    } else {
      newFavorites.add(businessId);
    }
    setFavorites(newFavorites);
  };

  const filteredBusinesses = selectedFilter === 'All' 
    ? businesses 
    : businesses.filter(b => b.category === selectedFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

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

      {/* Category Filter */}
      <div className="px-4 py-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedFilter === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-orange-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 mb-4">
        <p className="text-gray-600 text-sm">
          {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'} found
        </p>
      </div>

      {/* Business grid */}
      <div className="px-4 space-y-4">
        {filteredBusinesses.map((business) => (
          <div 
            key={business.id} 
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            onClick={() => onBusinessClick && onBusinessClick(business)}
          >
            {/* Business image */}
            <div className="relative h-48">
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400';
                }}
              />
              {business.verified && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ✓ Verified
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(business.id);
                }}
                className={`absolute top-3 left-3 p-2 rounded-full ${
                  favorites.has(business.id) 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-600'
                } hover:scale-110 transition-transform shadow-sm`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>

            {/* Business info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 flex-1">{business.name}</h3>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full ml-2">
                  {business.category}
                </span>
              </div>

              <p className="text-sm text-orange-600 font-medium mb-2">{business.owner_ethnicity}</p>
              <p className="text-gray-700 text-sm mb-3 line-clamp-2">{business.description}</p>

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

      {/* No results */}
      {filteredBusinesses.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="text-gray-500 text-lg mb-4">No businesses found</div>
          <p className="text-gray-400">
            Try adjusting your search criteria or check back later for new listings.
          </p>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button 
            onClick={onBack}
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
            <svg className="w-6 h-6 text-orange-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs font-medium text-orange-500">Search</span>
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
};

export default BusinessListings;

