import { Heart, MapPin, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Favorites = () => {
  // Sample favorite businesses
  const favoriteBusinesses = [
    {
      id: 1,
      name: "Asempe Kitchen",
      category: "Restaurant",
      rating: 4.8,
      reviewCount: 87,
      distance: "0.5 mi",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      address: "123 Main St, Syracuse, NY",
      minorityType: "Black-owned"
    },
    {
      id: 2,
      name: "Fashion Forward Boutique",
      category: "Retail",
      rating: 4.6,
      reviewCount: 42,
      distance: "0.7 mi",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      address: "456 Fashion Ave, Syracuse, NY",
      minorityType: "Women-owned"
    }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ))
  }

  if (favoriteBusinesses.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h2>
          <p className="text-gray-600 mb-8 max-w-sm">
            Start exploring and save your favorite minority-owned businesses to see them here.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Discover Businesses
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Your Favorites</h1>
        <p className="text-white/80">{favoriteBusinesses.length} saved businesses</p>
      </div>

      {/* Favorites List */}
      <div className="px-6 py-6 space-y-4">
        {favoriteBusinesses.map((business) => (
          <div key={business.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="flex">
              {/* Business Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={business.image}
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
                    <p className="text-xs text-purple-600 font-medium">{business.minorityType}</p>
                  </div>
                  <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <Heart size={18} className="text-red-500 fill-current" />
                  </button>
                </div>

                {/* Rating and Distance */}
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(business.rating)}
                    <span className="text-sm text-gray-600 ml-1">
                      {business.rating} ({business.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin size={12} />
                    <span>{business.distance}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  size="sm"
                  className="w-full text-xs bg-purple-600 hover:bg-purple-700"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Share Favorites */}
      <div className="px-6 py-4">
        <Button
          variant="outline"
          className="w-full py-3 text-purple-600 border-purple-600 hover:bg-purple-50"
          onClick={() => {
            // Simple share implementation
            if (navigator.share) {
              navigator.share({
                title: 'My Favorite Minority-Owned Businesses',
                text: 'Check out these amazing minority-owned businesses I found on Melanin Market!',
                url: window.location.href
              })
            } else {
              // Fallback for browsers that don't support Web Share API
              const shareText = `Check out these amazing minority-owned businesses I found on Melanin Market! ${window.location.href}`
              navigator.clipboard.writeText(shareText).then(() => {
                alert('Share link copied to clipboard!')
              }).catch(() => {
                alert('Share feature coming soon! You can manually share this page URL with friends.')
              })
            }
          }}
        >
          Share Your Favorites
        </Button>
      </div>
    </div>
  )
}

export default Favorites

