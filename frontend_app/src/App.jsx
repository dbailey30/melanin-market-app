import { useState, useEffect } from 'react'
import { Home, Heart, Search, User, CreditCard, BarChart3, Plus } from 'lucide-react'
import LandingPage from './components/LandingPage'
import BusinessListings from './components/BusinessListings'
import BusinessDetail from './components/BusinessDetail'
import Favorites from './components/Favorites'
import Profile from './components/Profile'
import SubscriptionPlans from './components/SubscriptionPlans'
import SubscriptionStatus from './components/SubscriptionStatus'
import BusinessAnalytics from './components/BusinessAnalytics'
import AddBusiness from './components/AddBusiness'
import analytics from './services/analytics'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [searchLocation, setSearchLocation] = useState('')
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [user, setUser] = useState(null)
  const [userSubscriptions, setUserSubscriptions] = useState([])
  const [isStandalone, setIsStandalone] = useState(false)

  // Check if app is running as PWA
  useEffect(() => {
    const checkPWAMode = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone === true
      setIsStandalone(isStandalone)
      
      if (isStandalone) {
        analytics.trackPWALaunch()
      }
    }

    checkPWAMode()
    
    // Track initial page view
    analytics.trackPageView()
    
    // Set up PWA install prompt tracking
    window.addEventListener('beforeinstallprompt', (e) => {
      analytics.trackActivity('pwa_install_prompt')
    })

    // Track offline/online status
    window.addEventListener('offline', () => {
      analytics.trackOfflineUsage()
    })

    // Mock user for demo (in real app, this would come from authentication)
    const mockUser = {
      id: 1,
      username: 'demo_user',
      email: 'demo@melaninmarket.com',
      name: 'Demo User',
      userType: 'consumer' // or 'business'
    }
    setUser(mockUser)
    analytics.setUserId(mockUser.id)

  }, [])

  // Fetch user subscriptions when user is set
  useEffect(() => {
    if (user?.id) {
      fetchUserSubscriptions()
    }
  }, [user])

  const fetchUserSubscriptions = async () => {
    try {
      const response = await fetch(`/api/user/${user.id}/subscriptions`)
      const data = await response.json()
      if (data.success) {
        setUserSubscriptions(data.subscriptions)
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    }
  }

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'profile', icon: User, label: 'Profile' }
  ]

  // Add subscription and analytics tabs for business users or premium users
  const hasBusinessSubscription = userSubscriptions.some(sub => 
    sub.subscription_type.startsWith('business') && sub.is_active
  )
  
  const hasPremiumSubscription = userSubscriptions.some(sub => 
    (sub.subscription_type === 'user_premium' || sub.subscription_type.startsWith('business')) && sub.is_active
  )

  if (hasBusinessSubscription) {
    navigationItems.splice(3, 0, { id: 'analytics', icon: BarChart3, label: 'Analytics' })
  }

  if (user) {
    navigationItems.push({ id: 'subscription', icon: CreditCard, label: 'Plans' })
  }

  const handleSearch = (location) => {
    setSearchLocation(location)
    setCurrentPage('search')
    
    // Track search activity
    analytics.trackSearch(location, null, location)
  }

  const handleBusinessSelect = (business) => {
    setSelectedBusiness(business)
    setCurrentPage('business-detail')
    
    // Track business view
    analytics.trackBusinessView(business.id)
  }

  const handleBackToSearch = () => {
    setCurrentPage('search')
    setSelectedBusiness(null)
  }

  const handleBackToHome = () => {
    setCurrentPage('home')
    setSearchLocation('')
    setSelectedBusiness(null)
  }

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId)
    
    // Track page navigation
    analytics.trackPageView(`/${pageId}`)
  }

  const handleAddBusiness = () => {
    setCurrentPage('add-business')
    analytics.trackPageView('/add-business')
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onSearch={handleSearch} onAddBusiness={handleAddBusiness} />
      case 'search':
        return (
          <BusinessListings 
            searchLocation={searchLocation}
            onBack={handleBackToHome}
            onBusinessSelect={handleBusinessSelect}
            userId={user?.id}
            hasPremiumAccess={hasPremiumSubscription}
          />
        )
      case 'business-detail':
        return (
          <BusinessDetail 
            business={selectedBusiness}
            onBack={handleBackToSearch}
            userId={user?.id}
          />
        )
      case 'favorites':
        return <Favorites userId={user?.id} />
      case 'profile':
        return <Profile user={user} />
      case 'subscription':
        return (
          <div className="p-4 space-y-6">
            <SubscriptionStatus userId={user?.id} />
            <SubscriptionPlans 
              userId={user?.id} 
              userType={user?.userType || 'consumer'}
            />
          </div>
        )
      case 'analytics':
        return hasBusinessSubscription ? (
          <div className="p-4">
            <BusinessAnalytics 
              businessId={selectedBusiness?.id || 1} // In real app, get from user's business
              userId={user?.id}
            />
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-gray-600">Analytics requires a business subscription</p>
          </div>
        )
      case 'add-business':
        return <AddBusiness onBack={handleBackToHome} />
      default:
        return <LandingPage onSearch={handleSearch} />
    }
  }

  // Hide bottom navigation on business detail page
  const showBottomNav = currentPage !== 'business-detail'

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col">
      {/* PWA Status Indicator */}
      {isStandalone && (
        <div className="bg-amber-600 text-white text-center py-1 text-sm">
          ✓ Running as App
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
        {renderCurrentPage()}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-amber-200 shadow-lg">
          <div className="flex justify-around items-center py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'text-amber-600 bg-amber-50' 
                      : 'text-amber-700 hover:text-amber-600 hover:bg-amber-50/50'
                  }`}
                >
                  <Icon size={20} className="mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      )}

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  )
}

// PWA Install Prompt Component
const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        analytics.trackPWAInstall()
      }
      
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Install Melanin Market</h3>
          <p className="text-sm text-gray-600">Add to your home screen for quick access</p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Later
          </button>
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

