import { useState, useEffect } from 'react'
import { ArrowLeft, Star, MapPin, Phone, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import apiService from '../services/api'

const BusinessListings = ({ searchLocation, onBack, onBusinessSelect }) => {
  const [businesses, setBusinesses] = useState([])
  const [filteredBusinesses, setFilteredBusinesses] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState(new Set())

  useEffect(() => {
    fetchBusinesses()
  }, [searchLocation])

  useEffect(() => {
    filterBusinesses()
  }, [businesses, selectedCategory])

  const fetchBusinesses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let data
      if (searchLocation) {
        // Parse city and state from searchLocation
        const [city, state] = searchLocation.split(',').map(s => s.trim())
        data = await apiService.getBusinesses({ city, state })
      } else {
        data = await apiService.getBusinesses()
      }
      
      setBusinesses(data.businesses || [])
      
      // Set organized categories instead of extracting from data
      const organizedCategories = [
        'All', 
        'Food & Dining', 
        'Entertainment', 
        'Services', 
        'Retail', 
        'Beauty & Personal Care', 
        'Technology', 
        'Healthcare', 
        'Education'
      ]
      setCategories(organizedCategories)
      
    } catch (err) {
      setError('Failed to load businesses. Please try again.')
      console.error('Error fetching businesses:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterBusinesses = () => {
    if (selectedCategory === 'All') {
      setFilteredBusinesses(businesses)
    } else {
      // Map new categories to existing business categories
      const categoryMapping = {
        'Food & Dining': ['Restaurant', 'Grocery Store'],
        'Entertainment': ['Entertainment'],
        'Services': ['Professional Services', 'Automotive', 'Home & Garden', 'Fitness & Wellness'],
        'Retail': ['Retail'],
        'Beauty & Personal Care': ['Beauty & Personal Care'],
        'Technology': ['Technology'],
        'Healthcare': ['Healthcare'],
        'Education': ['Education']
      }
      
      let categoriesToFilter = []
      if (categoryMapping[selectedCategory]) {
        categoriesToFilter = categoryMapping[selectedCategory]
      } else {
        categoriesToFilter = [selectedCategory]
      }
      
      const filtered = businesses.filter(business => 
        categoriesToFilter.includes(business.category)
      )
      setFilteredBusinesses(filtered)
    }
  }

  const toggleFavorite = (businessId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(businessId)) {
      newFavorites.delete(businessId)
    } else {
      newFavorites.add(businessId)
    }
    setFavorites(newFavorites)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ))
  }

  const handleBusinessClick = (business) => {
    if (onBusinessSelect) {
      onBusinessSelect(business)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading businesses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchBusinesses} className="bg-purple-600 hover:bg-purple-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 pt-12 pb-6">
        <div className="flex items-center mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors mr-3"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">
              {searchLocation || 'All Locations'}
            </h1>
            <p className="text-white/80">
              Found {filteredBusinesses.length} minority-owned business{filteredBusinesses.length !== 1 ? 'es' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-6 py-4 bg-white shadow-sm">
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Business List */}
      <div className="px-6 py-4 space-y-4">
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No businesses found in this category.</p>
            <Button
              onClick={() => setSelectedCategory('All')}
              variant="outline"
              className="text-purple-600 border-purple-600"
            >
              View All Categories
            </Button>
          </div>
        ) : (
          filteredBusinesses.map((business) => (
            <div key={business.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="flex">
                {/* Business Image */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={business.image_url}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Business Info */}
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{business.name}</h3>
                      <p className="text-sm text-gray-600">{business.category}</p>
                      <p className="text-xs text-purple-600 font-medium">{business.minority_type}</p>
                    </div>
                    <button 
                      onClick={() => toggleFavorite(business.id)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Heart 
                        size={18} 
                        className={favorites.has(business.id) ? 'text-red-500 fill-current' : 'text-gray-400'} 
                      />
                    </button>
                  </div>

                  {/* Rating and Distance */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(business.average_rating)}
                      <span className="text-sm text-gray-600 ml-1">
                        {business.average_rating > 0 ? business.average_rating : 'New'} ({business.review_count})
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin size={12} />
                      <span>{business.city}, {business.state}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {business.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                    >
                      <Phone className="mr-1" size={14} />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleBusinessClick(business)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {filteredBusinesses.length > 0 && (
        <div className="px-6 py-4">
          <Button
            variant="outline"
            className="w-full py-3 text-purple-600 border-purple-600 hover:bg-purple-50"
            onClick={() => {
              // Simple implementation: show alert for now, can be enhanced later
              alert('Load More Businesses feature coming soon! This will load additional businesses from the database.')
            }}
          >
            Load More Businesses
          </Button>
        </div>
      )}
    </div>
  )
}

export default BusinessListings

