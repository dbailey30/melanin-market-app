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
  }
];

const BusinessListings = ({ searchCity = '', searchState = '', selectedCategory = '' }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    // Simulate API call with mock data
    const loadBusinesses = () => {
      setLoading(true);
      
      // Filter businesses based on search criteria
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
      
      // Simulate loading delay
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

  const shareBusinesses = () => {
    const favoriteBusinesses = businesses.filter(b => favorites.has(b.id));
    if (favoriteBusinesses.length === 0) {
      alert('Please add some businesses to your favorites first!');
      return;
    }
    
    const shareText = `Check out these amazing minority-owned businesses:\n${favoriteBusinesses.map(b => `• ${b.name} - ${b.address}`).join('\n')}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Melanin Market - Support Local Businesses',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Business list copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {searchCity ? `Businesses in ${searchCity}` : 'Featured Businesses'}
        </h2>
        <button
          onClick={shareBusinesses}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Share Favorites
        </button>
      </div>

      {/* Results count */}
      <p className="text-gray-600">
        {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'} found
      </p>

      {/* Business grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <div key={business.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  ✓ Verified
                </div>
              )}
              <button
                onClick={() => toggleFavorite(business.id)}
                className={`absolute top-2 left-2 p-2 rounded-full ${
                  favorites.has(business.id) 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-600'
                } hover:scale-110 transition-transform`}
              >
                ♥
              </button>
            </div>

            {/* Business info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{business.name}</h3>
                <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  {business.category}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">{business.owner_ethnicity}</p>
              <p className="text-gray-700 text-sm mb-3 line-clamp-2">{business.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{business.rating}</span>
                  <span className="ml-1">({business.reviews_count} reviews)</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <p>{business.address}</p>
                <p>{business.phone}</p>
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load more button */}
      {businesses.length > 0 && (
        <div className="text-center">
          <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
            Load More Businesses
          </button>
        </div>
      )}

      {/* No results */}
      {businesses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No businesses found</div>
          <p className="text-gray-400">
            Try adjusting your search criteria or check back later for new listings.
          </p>
        </div>
      )}
    </div>
  );
};

export default BusinessListings;
