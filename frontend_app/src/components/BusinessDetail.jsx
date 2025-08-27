import { useState } from 'react'
import { ArrowLeft, Star, Phone, MapPin, Clock, Heart, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'

const BusinessDetail = ({ business, onBack }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newReview, setNewReview] = useState('')

  // Sample business data if none provided
  const defaultBusiness = {
    id: 1,
    name: "Asempe Kitchen",
    category: "Restaurant",
    rating: 4.8,
    reviewCount: 87,
    distance: "0.5 mi",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
    address: "123 Main St, Syracuse, NY 13210",
    phone: "(315) 555-0123",
    website: "www.asempekitchen.com",
    hours: "Mon-Fri 9:00 AM - 5:00 PM",
    description: "Authentic African cuisine with modern flair. We specialize in traditional dishes from Ghana and Nigeria, prepared with fresh, locally-sourced ingredients.",
    minorityType: "Black-owned",
    reviews: [
      {
        id: 1,
        author: "Sarah M.",
        rating: 5,
        date: "2 days ago",
        text: "Amazing food and wonderful service! The jollof rice was incredible."
      },
      {
        id: 2,
        author: "Mike R.",
        rating: 4,
        date: "1 week ago",
        text: "Great atmosphere and authentic flavors. Will definitely be back!"
      }
    ]
  }

  const currentBusiness = business || defaultBusiness

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={interactive ? 24 : 16}
        className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} ${
          interactive ? 'cursor-pointer hover:text-yellow-400' : ''
        }`}
        onClick={interactive ? () => onStarClick(i + 1) : undefined}
      />
    ))
  }

  const handleSubmitReview = () => {
    if (newRating > 0 && newReview.trim()) {
      // Handle review submission
      console.log('Submitting review:', { rating: newRating, text: newReview })
      setShowReviewForm(false)
      setNewRating(0)
      setNewReview('')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Image */}
      <div className="relative">
        <img
          src={currentBusiness.image}
          alt={currentBusiness.name}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <Heart
              size={24}
              className={isFavorite ? 'fill-current text-red-500' : ''}
            />
          </button>
          <button className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
            <Share size={24} />
          </button>
        </div>
      </div>

      {/* Business Info */}
      <div className="px-6 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{currentBusiness.name}</h1>
          <p className="text-gray-600 mb-1">{currentBusiness.category}</p>
          <p className="text-purple-600 font-medium text-sm">{currentBusiness.minorityType}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-6">
          {renderStars(currentBusiness.rating)}
          <span className="text-gray-600">
            {currentBusiness.rating} ({currentBusiness.reviewCount} reviews)
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <MapPin className="text-gray-400" size={20} />
            <span className="text-gray-700">{currentBusiness.address}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="text-gray-400" size={20} />
            <span className="text-gray-700">{currentBusiness.phone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="text-gray-400" size={20} />
            <span className="text-gray-700">{currentBusiness.hours}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-gray-700 leading-relaxed">{currentBusiness.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-8">
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
            <Phone className="mr-2" size={18} />
            Call
          </Button>
          <Button variant="outline" className="flex-1">
            <MapPin className="mr-2" size={18} />
            Directions
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowReviewForm(true)}
            className="flex-1"
          >
            Add Review
          </Button>
        </div>

        {/* Reviews Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Reviews</h3>
          
          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-3">Write a Review</h4>
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Your Rating:</p>
                <div className="flex space-x-1">
                  {renderStars(newRating, true, setNewRating)}
                </div>
              </div>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Share your experience..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex space-x-2 mt-3">
                <Button
                  onClick={handleSubmitReview}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Submit Review
                </Button>
                <Button
                  onClick={() => setShowReviewForm(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {currentBusiness.reviews?.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{review.author}</p>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessDetail

