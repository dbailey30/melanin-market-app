import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [searchInput, setSearchInput] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [businessLocationType, setBusinessLocationType] = useState('physical');

  // Admin state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [isUpdatingGitHub, setIsUpdatingGitHub] = useState(false);

  // Admin password - Change this to something secure
  const ADMIN_PASSWORD = 'melanin2025admin';

  // EmailJS Configuration - REPLACE WITH YOUR ACTUAL VALUES
  const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_l1mf75l',
    TEMPLATE_ID: 'template_1zwylhd',
    PUBLIC_KEY: 'jv0z8LO2xSTdzuvDz'
  };

  // GitHub integration now handled securely via API endpoints
  // No client-side configuration needed

  // All US States and Territories
  const US_STATES = [
    { value: '', label: 'Select State' },
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' },
    { value: 'ONLINE', label: 'Online/National' }
  ];

  // GitHub API Functions
  const fetchBusinessesFromGitHub = async () => {
    try {
      const response = await fetch('/api/businesses');
      const data = await response.json();
      
      if (data.success) {
        return { businesses: data.businesses, sha: data.sha };
      } else {
        console.warn('GitHub API not available, using local data');
        return null;
      }
    } catch (error) {
      console.error('Error fetching from secure API:', error);
      return null;
    }
  };

  const updateBusinessesInGitHub = async (businesses, action, businessName) => {
    try {
      const response = await fetch('/api/businesses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminAuth: ADMIN_PASSWORD,
          businesses: businesses,
          action: action,
          businessName: businessName
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update businesses');
      }

      return data;
    } catch (error) {
      console.error('Error updating via secure API:', error);
      throw error;
    }
  };

  // Google Maps integration
  const createGoogleMapsUrl = (address, businessName) => {
    const query = encodeURIComponent(`${businessName} ${address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  // Load businesses on component mount
  useEffect(() => {
    const loadBusinesses = async () => {
      setIsLoading(true);
      
      try {
        // Try to fetch from GitHub first
        const githubData = await fetchBusinessesFromGitHub();
        
        if (githubData && githubData.businesses) {
          setBusinesses(githubData.businesses);
        } else {
          // Fallback to local data
          const response = await fetch('/businesses.json');
          const localBusinesses = await response.json();
          setBusinesses(localBusinesses);
        }
      } catch (error) {
        console.error('Error loading businesses:', error);
        // Final fallback to empty array
        setBusinesses([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('melaninMarketFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('melaninMarketFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Business management functions
  const handleAddBusiness = async (newBusiness) => {
    try {
      setIsUpdatingGitHub(true);
      const updatedBusinesses = [...businesses, newBusiness];
      
      // Update GitHub
      await updateBusinessesInGitHub(updatedBusinesses, 'add', newBusiness.name);
      
      // Update local state
      setBusinesses(updatedBusinesses);
      setShowAddForm(false);
      
      alert('Business added successfully!');
    } catch (error) {
      console.error('Error adding business:', error);
      alert('Error adding business. Please try again.');
    } finally {
      setIsUpdatingGitHub(false);
    }
  };

  const handleEditBusiness = async (updatedBusiness) => {
    try {
      setIsUpdatingGitHub(true);
      const updatedBusinesses = businesses.map(business => 
        business.id === updatedBusiness.id ? updatedBusiness : business
      );
      
      // Update GitHub
      await updateBusinessesInGitHub(updatedBusinesses, 'edit', updatedBusiness.name);
      
      // Update local state
      setBusinesses(updatedBusinesses);
      setEditingBusiness(null);
      
      alert('Business updated successfully!');
    } catch (error) {
      console.error('Error updating business:', error);
      alert('Error updating business. Please try again.');
    } finally {
      setIsUpdatingGitHub(false);
    }
  };

  const handleDeleteBusiness = async (businessId) => {
    const businessToDelete = businesses.find(b => b.id === businessId);
    if (!businessToDelete) return;

    if (window.confirm(`Are you sure you want to delete "${businessToDelete.name}"?`)) {
      try {
        setIsUpdatingGitHub(true);
        const updatedBusinesses = businesses.filter(business => business.id !== businessId);
        
        // Update GitHub
        await updateBusinessesInGitHub(updatedBusinesses, 'delete', businessToDelete.name);
        
        // Update local state
        setBusinesses(updatedBusinesses);
        
        alert('Business deleted successfully!');
      } catch (error) {
        console.error('Error deleting business:', error);
        alert('Error deleting business. Please try again.');
      } finally {
        setIsUpdatingGitHub(false);
      }
    }
  };

  // Admin authentication
  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setAdminPassword('');
    } else {
      alert('Incorrect password');
      setAdminPassword('');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setEditingBusiness(null);
    setShowAddForm(false);
    setLogoClickCount(0);
  };

  // Logo click handler for admin access
  const handleLogoClick = () => {
    setLogoClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        setCurrentView('admin');
        return 0; // Reset count
      }
      return newCount;
    });
  };

  // Filter businesses based on search and category
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                         business.category.toLowerCase().includes(searchInput.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchInput.toLowerCase()) ||
                         business.location.toLowerCase().includes(searchInput.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory;
    const matchesLocationType = businessLocationType === 'all' || 
                               (businessLocationType === 'physical' && business.location !== 'Online/National') ||
                               (businessLocationType === 'online' && business.location === 'Online/National');
    
    return matchesSearch && matchesCategory && matchesLocationType;
  });

  // Get unique categories
  const categories = ['All', ...new Set(businesses.map(business => business.category))];

  // Toggle favorite
  const toggleFavorite = (businessId) => {
    setFavorites(prev => 
      prev.includes(businessId) 
        ? prev.filter(id => id !== businessId)
        : [...prev, businessId]
    );
  };

  // Get favorite businesses
  const favoriteBusinesses = businesses.filter(business => favorites.includes(business.id));

  // EmailJS form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const templateParams = {
      from_name: formData.get('from_name'),
      from_email: formData.get('from_email'),
      business_name: formData.get('business_name'),
      business_category: formData.get('business_category'),
      business_description: formData.get('business_description'),
      business_website: formData.get('business_website'),
      business_phone: formData.get('business_phone'),
      business_address: formData.get('business_address'),
      business_state: formData.get('business_state'),
      message: formData.get('message')
    };

    try {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      
      alert('Thank you! Your business submission has been sent successfully. We will review it and add it to our directory.');
      e.target.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      alert('Sorry, there was an error sending your submission. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Business statistics
  const stats = {
    total: businesses.length,
    verified: businesses.filter(b => b.verified).length,
    unverified: businesses.filter(b => !b.verified).length,
    physical: businesses.filter(b => b.location !== 'Online/National').length,
    online: businesses.filter(b => b.location === 'Online/National').length,
    mobile: businesses.filter(b => b.category === 'Mobile Service').length
  };

  // Check GitHub integration status
  const checkGitHubStatus = async () => {
    try {
      const response = await fetch('/api/github-status');
      const data = await response.json();
      return data.configured;
    } catch (error) {
      return false;
    }
  };

  // Business form component
  const BusinessForm = ({ business, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(business || {
      id: Date.now(),
      name: '',
      category: '',
      description: '',
      location: '',
      address: '',
      phone: '',
      website: '',
      verified: false
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {business ? 'Edit Business' : 'Add New Business'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Technology">Technology</option>
                <option value="Beauty & Wellness">Beauty & Wellness</option>
                <option value="Retail">Retail</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Professional Services">Professional Services</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Education">Education</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Automotive">Automotive</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Travel & Tourism">Travel & Tourism</option>
                <option value="Arts & Crafts">Arts & Crafts</option>
                <option value="Sports & Recreation">Sports & Recreation</option>
                <option value="Non-Profit">Non-Profit</option>
                <option value="Mobile Service">Mobile Service</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded h-20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State/Location *</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                {US_STATES.map(state => (
                  <option key={state.value} value={state.label}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Street address (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="verified"
                checked={formData.verified}
                onChange={(e) => setFormData({...formData, verified: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="verified" className="text-sm">Verified Business</label>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
                disabled={isUpdatingGitHub}
              >
                {isUpdatingGitHub ? 'Saving...' : (business ? 'Update' : 'Add')}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                disabled={isUpdatingGitHub}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Landing Page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        {/* Header */}
        <header className="bg-black bg-opacity-20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 
                  className="text-3xl font-bold text-white cursor-pointer"
                  onClick={handleLogoClick}
                >
                  Melanin Market
                </h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <button 
                  onClick={() => setCurrentView('browse')}
                  className="text-white hover:text-purple-200 transition-colors"
                >
                  Browse Businesses
                </button>
                <button 
                  onClick={() => setCurrentView('submit')}
                  className="text-white hover:text-purple-200 transition-colors"
                >
                  Add Your Business
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Discover & Support
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Minority-Owned Businesses
              </span>
            </h2>
            
            <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto">
              Connect with authentic businesses owned by Black, Latino, Asian, Native American, and other minority entrepreneurs in your community and beyond.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setCurrentView('browse')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Explore Directory
              </button>
              <button 
                onClick={() => setCurrentView('submit')}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all transform hover:scale-105"
              >
                List Your Business
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Discover Local Gems</h3>
              <p className="text-purple-100">Find amazing minority-owned businesses in your area and across the nation.</p>
            </div>
            
            <div className="text-center p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-white mb-2">Verified Businesses</h3>
              <p className="text-purple-100">All businesses are verified to ensure authentic minority ownership.</p>
            </div>
            
            <div className="text-center p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold text-white mb-2">Support Community</h3>
              <p className="text-purple-100">Every purchase helps strengthen minority-owned businesses and communities.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Browse Businesses Page
  if (currentView === 'browse') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 
                className="text-2xl font-bold text-gray-900 cursor-pointer"
                onClick={handleLogoClick}
              >
                Melanin Market
              </h1>
              <nav className="flex space-x-6">
                <button 
                  onClick={() => setCurrentView('landing')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Home
                </button>
                <button 
                  onClick={() => setCurrentView('submit')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Add Business
                </button>
                <button 
                  onClick={() => setCurrentView('favorites')}
                  className="text-gray-600 hover:text-gray-900 relative"
                >
                  Favorites ({favorites.length})
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search businesses, categories, or locations..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={businessLocationType}
                onChange={(e) => setBusinessLocationType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Locations</option>
                <option value="physical">Physical Locations</option>
                <option value="online">Online/National</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600">Loading businesses...</div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredBusinesses.length} Business{filteredBusinesses.length !== 1 ? 'es' : ''} Found
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map(business => (
                  <div key={business.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                      <button
                        onClick={() => toggleFavorite(business.id)}
                        className={`text-2xl ${favorites.includes(business.id) ? 'text-red-500' : 'text-gray-300'} hover:text-red-500 transition-colors`}
                      >
                        ♥
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                        {business.category}
                      </span>
                      {business.verified && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{business.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{business.location}</span>
                      </div>
                      
                      {business.phone && (
                        <div className="flex items-center gap-2">
                          <span>📞</span>
                          <a href={`tel:${business.phone}`} className="text-purple-600 hover:underline">
                            {business.phone}
                          </a>
                        </div>
                      )}
                      
                      {business.website && (
                        <div className="flex items-center gap-2">
                          <span>🌐</span>
                          <a 
                            href={business.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}

                      {business.address && business.location !== 'Online/National' && (
                        <div className="flex items-center gap-2">
                          <span>🗺️</span>
                          <a 
                            href={createGoogleMapsUrl(business.address, business.name)}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline"
                          >
                            View on Maps
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredBusinesses.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-lg text-gray-600 mb-4">No businesses found matching your criteria.</div>
                  <button 
                    onClick={() => {
                      setSearchInput('');
                      setSelectedCategory('All');
                      setBusinessLocationType('all');
                    }}
                    className="text-purple-600 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    );
  }

  // Favorites Page
  if (currentView === 'favorites') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 
                className="text-2xl font-bold text-gray-900 cursor-pointer"
                onClick={handleLogoClick}
              >
                Melanin Market
              </h1>
              <nav className="flex space-x-6">
                <button 
                  onClick={() => setCurrentView('landing')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Home
                </button>
                <button 
                  onClick={() => setCurrentView('browse')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Browse
                </button>
                <button 
                  onClick={() => setCurrentView('submit')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Add Business
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Favorites Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Favorite Businesses ({favoriteBusinesses.length})
          </h2>

          {favoriteBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600 mb-4">You haven't added any favorites yet.</div>
              <button 
                onClick={() => setCurrentView('browse')}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Browse Businesses
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteBusinesses.map(business => (
                <div key={business.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                    <button
                      onClick={() => toggleFavorite(business.id)}
                      className="text-2xl text-red-500 hover:text-red-600 transition-colors"
                    >
                      ♥
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                      {business.category}
                    </span>
                    {business.verified && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{business.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{business.location}</span>
                    </div>
                    
                    {business.phone && (
                      <div className="flex items-center gap-2">
                        <span>📞</span>
                        <a href={`tel:${business.phone}`} className="text-purple-600 hover:underline">
                          {business.phone}
                        </a>
                      </div>
                    )}
                    
                    {business.website && (
                      <div className="flex items-center gap-2">
                        <span>🌐</span>
                        <a 
                          href={business.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}

                    {business.address && business.location !== 'Online/National' && (
                      <div className="flex items-center gap-2">
                        <span>🗺️</span>
                        <a 
                          href={createGoogleMapsUrl(business.address, business.name)}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          View on Maps
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // Submit Business Page
  if (currentView === 'submit') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 
                className="text-2xl font-bold text-gray-900 cursor-pointer"
                onClick={handleLogoClick}
              >
                Melanin Market
              </h1>
              <nav className="flex space-x-6">
                <button 
                  onClick={() => setCurrentView('landing')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Home
                </button>
                <button 
                  onClick={() => setCurrentView('browse')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Browse Businesses
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Submit Form */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Your Business</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="from_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="from_name"
                    name="from_name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="from_email" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="from_email"
                    name="from_email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Business Information */}
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="business_category" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Category *
                </label>
                <select
                  id="business_category"
                  name="business_category"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a category</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Technology">Technology</option>
                  <option value="Beauty & Wellness">Beauty & Wellness</option>
                  <option value="Retail">Retail</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Education">Education</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Travel & Tourism">Travel & Tourism</option>
                  <option value="Arts & Crafts">Arts & Crafts</option>
                  <option value="Sports & Recreation">Sports & Recreation</option>
                  <option value="Non-Profit">Non-Profit</option>
                  <option value="Mobile Service">Mobile Service</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="business_description" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description *
                </label>
                <textarea
                  id="business_description"
                  name="business_description"
                  rows={4}
                  required
                  placeholder="Describe your business, services, and what makes it special..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              {/* Contact Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="business_website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    id="business_website"
                    name="business_website"
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="business_phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="business_phone"
                    name="business_phone"
                    placeholder="(555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="business_state" className="block text-sm font-medium text-gray-700 mb-2">
                  State/Location *
                </label>
                <select
                  id="business_state"
                  name="business_state"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {US_STATES.map(state => (
                    <option key={state.value} value={state.label}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="business_address" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address
                </label>
                <input
                  type="text"
                  id="business_address"
                  name="business_address"
                  placeholder="123 Main St, City, State 12345 (optional for online businesses)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Additional Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Any additional information you'd like to share about your business..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Business for Review'}
                </button>
              </div>

              <div className="text-sm text-gray-600 text-center">
                <p>
                  Your business will be reviewed and added to our directory within 24-48 hours.
                  We verify all businesses to ensure authentic minority ownership.
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // Admin Page
  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Access</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="admin-password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter admin password"
                />
              </div>
              
              <button
                onClick={handleAdminLogin}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              >
                Login
              </button>
              
              <button
                onClick={() => setCurrentView('landing')}
                className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Business Management</h1>
              <button
                onClick={handleAdminLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* GitHub Status */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-yellow-800">⚠️</span>
              <span className="ml-2 text-yellow-800">
                GitHub Integration: NOT CONFIGURED - Changes are temporary only
              </span>
            </div>
          </div>

          {/* Add Business Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Add New Business
            </button>
          </div>

          {/* Business Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.unverified}</div>
              <div className="text-sm text-gray-600">Unverified</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.physical}</div>
              <div className="text-sm text-gray-600">Physical</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.online}</div>
              <div className="text-sm text-gray-600">Online</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-pink-600">{stats.mobile}</div>
              <div className="text-sm text-gray-600">Mobile</div>
            </div>
          </div>

          {/* Current Businesses */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Current Businesses</h3>
            </div>
            
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-8">Loading businesses...</div>
              ) : businesses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No businesses found.</div>
              ) : (
                <div className="space-y-4">
                  {businesses.map(business => (
                    <div key={business.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{business.name}</h4>
                            {business.verified && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                ✓ VERIFIED
                              </span>
                            )}
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              📍 {business.location}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                              {business.category}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2">{business.description}</p>
                          
                          <div className="flex gap-4 text-xs text-gray-500">
                            {business.phone && (
                              <span>📞 {business.phone}</span>
                            )}
                            {business.website && (
                              <span>🌐 {business.website}</span>
                            )}
                            {business.address && (
                              <span>📍 {business.address}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => setEditingBusiness(business)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                            disabled={isUpdatingGitHub}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBusiness(business.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                            disabled={isUpdatingGitHub}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Business Form Modal */}
        {(showAddForm || editingBusiness) && (
          <BusinessForm
            business={editingBusiness}
            onSubmit={editingBusiness ? handleEditBusiness : handleAddBusiness}
            onCancel={() => {
              setShowAddForm(false);
              setEditingBusiness(null);
            }}
          />
        )}

        {/* Loading Overlay */}
        {isUpdatingGitHub && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">Updating GitHub...</div>
                <div className="text-gray-600">Please wait while we save your changes.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default App;
