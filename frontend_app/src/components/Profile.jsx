import { User, Settings, Heart, Star, MapPin, Bell, HelpCircle, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Profile = () => {
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    joinDate: "March 2024",
    reviewCount: 12,
    favoriteCount: 8,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  }

  const menuItems = [
    {
      icon: Heart,
      label: "My Favorites",
      count: user.favoriteCount,
      action: () => console.log("Navigate to favorites")
    },
    {
      icon: Star,
      label: "My Reviews",
      count: user.reviewCount,
      action: () => console.log("Navigate to reviews")
    },
    {
      icon: Bell,
      label: "Notifications",
      action: () => console.log("Navigate to notifications")
    },
    {
      icon: Settings,
      label: "Settings",
      action: () => console.log("Navigate to settings")
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      action: () => console.log("Navigate to help")
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 pt-12 pb-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-white/80">{user.email}</p>
            <p className="text-white/60 text-sm">Member since {user.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-6 bg-white shadow-sm">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">{user.reviewCount}</div>
            <div className="text-sm text-gray-600">Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{user.favoriteCount}</div>
            <div className="text-sm text-gray-600">Favorites</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-gray-600">Cities</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 py-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} className="text-gray-600" />
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.count && (
                    <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                  <span className="text-gray-400">›</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Business Owner Section */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg p-4 border border-orange-200">
          <h3 className="font-semibold text-gray-900 mb-2">Business Owner?</h3>
          <p className="text-sm text-gray-600 mb-3">
            List your minority-owned business and connect with customers in your community.
          </p>
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Add Your Business
          </Button>
        </div>
      </div>

      {/* App Info */}
      <div className="px-6 py-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">Melanin Market v1.0.0</p>
          <p className="text-xs text-gray-400">
            Supporting minority-owned businesses in your community
          </p>
        </div>
      </div>

      {/* Sign Out */}
      <div className="px-6 py-4">
        <button className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={18} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export default Profile

