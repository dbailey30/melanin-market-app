import { useState } from 'react'
import { Search, MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LandingPage = ({ onSearch, onAddBusiness }) => {
  const [location, setLocation] = useState('')

  const handleSearch = () => {
    if (location.trim()) {
      onSearch(location)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-24 h-24 mb-6 mx-auto">
          <img 
            src="/melanin_market_logo.png" 
            alt="Melanin Market" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl font-bold text-amber-900 mb-4 leading-tight">
        Discover Minority-Owned Businesses
      </h1>
      <p className="text-lg text-amber-700 mb-8 max-w-md">
        Support local entrepreneurs and build stronger communities together
      </p>

      {/* Search Section */}
      <div className="w-full max-w-md space-y-4">
        {/* Location Input */}
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" size={20} />
          <input
            type="text"
            placeholder="Enter City, State"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-12 pr-4 py-4 rounded-2xl text-lg bg-white/90 backdrop-blur-sm border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-amber-500 shadow-lg"
          />
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Search className="mr-2" size={20} />
          Find Businesses
        </Button>

        {/* Add Business Button */}
        <Button
          onClick={onAddBusiness}
          variant="outline"
          className="w-full py-4 text-lg font-semibold bg-white/80 backdrop-blur-sm border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 rounded-2xl shadow-lg transition-all duration-300"
        >
          <Plus className="mr-2" size={20} />
          List Your Business
        </Button>
      </div>

      {/* Quick Access Cities */}
      <div className="mt-12 w-full max-w-md">
        <p className="text-amber-700 mb-4 text-sm font-medium">Popular Cities:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {['Buffalo, NY', 'Rochester, NY', 'Syracuse, NY'].map((city) => (
            <button
              key={city}
              onClick={() => {
                setLocation(city)
                onSearch(city)
              }}
              className="px-4 py-2 bg-white/60 backdrop-blur-sm text-amber-700 rounded-full text-sm hover:bg-white/80 hover:shadow-md transition-all duration-200 border border-amber-200"
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 gap-8 w-full max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Search className="text-white" size={28} />
          </div>
          <h3 className="text-amber-900 font-bold text-lg mb-2">Discover Local</h3>
          <p className="text-amber-700 text-sm leading-relaxed">Find authentic minority-owned businesses in your community</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MapPin className="text-white" size={28} />
          </div>
          <h3 className="text-amber-900 font-bold text-lg mb-2">Build Community</h3>
          <p className="text-amber-700 text-sm leading-relaxed">Support entrepreneurs and strengthen local economies</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

