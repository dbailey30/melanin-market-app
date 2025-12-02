import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin password for business management
const ADMIN_PASSWORD = 'melanin2025admin';

function App() {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedBusinessType, setSelectedBusinessType] = useState('All');
  const [currentView, setCurrentView] = useState('home');
  const [favorites, setFavorites] = useState([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [supabaseStatus, setSupabaseStatus] = useState('checking');

  // Business form states
  const [businessForm, setBusinessForm] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    website: '',
    business_type: 'physical',
    verification_document: ''
  });

  const [editingBusiness, setEditingBusiness] = useState(null);
  const [showBusinessForm, setShowBusinessForm] = useState(false);

  // Categories for filtering
  const categories = [
    'All', 'Restaurant', 'Retail', 'Beauty & Wellness', 'Professional Services',
    'Entertainment', 'Health & Fitness', 'Education', 'Technology', 'Real Estate',
    'Automotive', 'Home & Garden', 'Financial Services', 'Legal Services',
    'Marketing & Advertising', 'Construction', 'Transportation', 'Other'
  ];

  // US States
  const states = [
    'All', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID',
    'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO',
    'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA',
    'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // Business types
  const businessTypes = ['All', 'physical', 'online', 'mobile'];

  // Load businesses from Supabase
  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading businesses:', error);
        setSupabaseStatus('error');
        return;
      }

      setBusinesses(data || []);
      setSupabaseStatus('connected');
    } catch (error) {
      console.error('Error connecting to Supabase:', error);
      setSupabaseStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Add new business to Supabase
  const addBusiness = async (businessData) => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .insert([businessData])
        .select();

      if (error) {
        throw error;
      }

      // Reload businesses to get the latest data
      await loadBusinesses();
      return { success: true, data };
    } catch (error) {
      console.error('Error adding business:', error);
      return { success: false, error: error.message };
    }
  };

  // Update business in Supabase
  const updateBusiness = async (id, businessData) => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .update({ ...businessData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      // Reload businesses to get the latest data
      await loadBusinesses();
      return { success: true, data };
    } catch (error) {
      console.error('Error updating business:', error);
      return { success: false, error: error.message };
    }
  };

  // Delete business from Supabase
  const deleteBusiness = async (id) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Reload businesses to get the latest data
      await loadBusinesses();
      return { success: true };
    } catch (error) {
      console.error('Error deleting business:', error);
      return { success: false, error: error.message };
    }
  };

  // Load businesses on component mount
  useEffect(() => {
    loadBusinesses();
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('melanin-market-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Filter businesses based on search and filters
  useEffect(() => {
    let filtered = businesses;

    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(business => business.category === selectedCategory);
    }

    if (selectedState !== 'All') {
      filtered = filtered.filter(business => business.state === selectedState);
    }

    if (selectedBusinessType !== 'All') {
      filtered = filtered.filter(business => business.business_type === selectedBusinessType);
    }

    if (currentView === 'favorites') {
      filtered = filtered.filter(business => favorites.includes(business.id));
    }

    setFilteredBusinesses(filtered);
  }, [businesses, searchTerm, selectedCategory, selectedState, selectedBusinessType, currentView, favorites]);

  // Handle admin authentication
  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setShowAdminPanel(true);
      setAdminPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setShowAdminPanel(false);
    setCurrentView('home');
  };

  // Handle business form submission
  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    
    if (editingBusiness) {
      // Update existing business
      const result = await updateBusiness(editingBusiness.id, businessForm);
      if (result.success) {
        alert('Business updated successfully!');
        setEditingBusiness(null);
        setShowBusinessForm(false);
        resetBusinessForm();
      } else {
        alert(`Error updating business: ${result.error}`);
      }
    } else {
      // Add new business
      const result = await addBusiness(businessForm);
      if (result.success) {
        alert('Business added successfully!');
        setShowBusinessForm(false);
        resetBusinessForm();
      } else {
        alert(`Error adding business: ${result.error}`);
      }
    }
  };

  // Handle business deletion
  const handleDeleteBusiness = async (business) => {
    if (window.confirm(`Are you sure you want to delete "${business.name}"?`)) {
      const result = await deleteBusiness(business.id);
      if (result.success) {
        alert('Business deleted successfully!');
      } else {
        alert(`Error deleting business: ${result.error}`);
      }
    }
  };

  // Handle business editing
  const handleEditBusiness = (business) => {
    setBusinessForm({
      name: business.name,
      category: business.category,
      description: business.description,
      address: business.address,
      city: business.city,
      state: business.state,
      zip: business.zip,
      phone: business.phone,
      email: business.email,
      website: business.website,
      business_type: business.business_type,
      verification_document: business.verification_document || ''
    });
    setEditingBusiness(business);
    setShowBusinessForm(true);
  };

  // Reset business form
  const resetBusinessForm = () => {
    setBusinessForm({
      name: '',
      category: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: '',
      website: '',
      business_type: 'physical',
      verification_document: ''
    });
  };

  // Handle favorites
  const toggleFavorite = (businessId) => {
    const newFavorites = favorites.includes(businessId)
      ? favorites.filter(id => id !== businessId)
      : [...favorites, businessId];
    
    setFavorites(newFavorites);
    localStorage.setItem('melanin-market-favorites', JSON.stringify(newFavorites));
  };

  // Handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const _formData = new FormData(e.target);
    
    emailjs.sendForm('service_your_id', 'template_your_id', e.target, 'your_public_key')
      .then(() => {
        alert('Message sent successfully!');
        e.target.reset();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        alert('Failed to send message. Please try again.');
      });
  };

  // Get business type display name
  const getBusinessTypeDisplay = (type) => {
    switch (type) {
      case 'physical': return '🏢 Physical';
      case 'online': return '💻 Online';
      case 'mobile': return '🚚 Mobile';
      default: return '🏢 Physical';
    }
  };

  // Get verification badge
  const getVerificationBadge = (status) => {
    if (status === 'verified') {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Verified</span>;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800">Loading businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🏪</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Melanin Market</h1>
                <p className="text-amber-100">Supporting Black-Owned Businesses</p>
              </div>
            </div>
            
            {/* Database Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  supabaseStatus === 'connected' ? 'bg-green-400' : 
                  supabaseStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                }`}></div>
                <span className="text-sm">
                  Database: {supabaseStatus === 'connected' ? 'Connected' : 
                           supabaseStatus === 'error' ? 'Error' : 'Checking...'}
                </span>
              </div>
              
              {/* Admin Access */}
              {!isAdminAuthenticated ? (
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="text-sm bg-amber-700 hover:bg-amber-800 px-3 py-1 rounded transition-colors"
                >
                  Admin
                </button>
              ) : (
                <button
                  onClick={handleAdminLogout}
                  className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Admin Login Panel */}
      {showAdminPanel && !isAdminAuthenticated && (
        <div className="bg-amber-100 border-l-4 border-amber-500 p-4">
          <div className="container mx-auto">
            <div className="flex items-center space-x-4">
              <input
                type="password"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="px-3 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
              <button
                onClick={handleAdminLogin}
                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="text-amber-600 hover:text-amber-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {isAdminAuthenticated && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-green-800">Business Management</h2>
                <p className="text-green-600">Database: {supabaseStatus === 'connected' ? 'CONNECTED' : 'ERROR'} • Real-time updates enabled</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    resetBusinessForm();
                    setEditingBusiness(null);
                    setShowBusinessForm(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>➕</span>
                  <span>Add New Business</span>
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {['home', 'search', 'favorites', 'profile'].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  currentView === view
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {view === 'home' && '🏠 Home'}
                {view === 'search' && '🔍 Search'}
                {view === 'favorites' && '❤️ Favorites'}
                {view === 'profile' && '👤 Profile'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Business Form Modal */}
        {showBusinessForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingBusiness ? 'Edit Business' : 'Add New Business'}
              </h2>
              
              <form onSubmit={handleBusinessSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                    <input
                      type="text"
                      required
                      value={businessForm.name}
                      onChange={(e) => setBusinessForm({...businessForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      required
                      value={businessForm.category}
                      onChange={(e) => setBusinessForm({...businessForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select Category</option>
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={businessForm.description}
                    onChange={(e) => setBusinessForm({...businessForm, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={businessForm.address}
                      onChange={(e) => setBusinessForm({...businessForm, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={businessForm.city}
                      onChange={(e) => setBusinessForm({...businessForm, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select
                      value={businessForm.state}
                      onChange={(e) => setBusinessForm({...businessForm, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select State</option>
                      {states.slice(1).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={businessForm.zip}
                      onChange={(e) => setBusinessForm({...businessForm, zip: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                    <select
                      value={businessForm.business_type}
                      onChange={(e) => setBusinessForm({...businessForm, business_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="physical">Physical Location</option>
                      <option value="online">Online Only</option>
                      <option value="mobile">Mobile Service</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={businessForm.phone}
                      onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={businessForm.email}
                      onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={businessForm.website}
                    onChange={(e) => setBusinessForm({...businessForm, website: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification Document</label>
                  <input
                    type="text"
                    value={businessForm.verification_document}
                    onChange={(e) => setBusinessForm({...businessForm, verification_document: e.target.value})}
                    placeholder="e.g., business-license - BL-2024-001234"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBusinessForm(false);
                      setEditingBusiness(null);
                      resetBusinessForm();
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                  >
                    {editingBusiness ? 'Update Business' : 'Add Business'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        {(currentView === 'home' || currentView === 'search' || currentView === 'favorites') && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <input
                    type="text"
                    placeholder="Search businesses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {states.map(state => (
                    <option key={state} value={state}>{state === 'All' ? 'All States' : state}</option>
                  ))}
                </select>
                
                <select
                  value={selectedBusinessType}
                  onChange={(e) => setSelectedBusinessType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {businessTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'All' ? 'All Types' : 
                       type === 'physical' ? 'Physical' :
                       type === 'online' ? 'Online' : 'Mobile'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Business Statistics */}
        {(currentView === 'home' || currentView === 'search' || currentView === 'favorites') && (
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">{businesses.length}</div>
                <div className="text-sm text-gray-600">Total Businesses</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {businesses.filter(b => b.verification_status === 'verified').length}
                </div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {businesses.filter(b => b.business_type === 'physical').length}
                </div>
                <div className="text-sm text-gray-600">Physical</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {businesses.filter(b => b.business_type === 'online').length}
                </div>
                <div className="text-sm text-gray-600">Online</div>
              </div>
            </div>
          </div>
        )}

        {/* Business Listings */}
        {(currentView === 'home' || currentView === 'search' || currentView === 'favorites') && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentView === 'favorites' ? 'Your Favorites' : 'Current Businesses'}
              </h2>
              <div className="text-sm text-gray-600">
                Showing {filteredBusinesses.length} of {businesses.length} businesses
              </div>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {currentView === 'favorites' ? 'No favorites yet' : 'No businesses found'}
                </h3>
                <p className="text-gray-500">
                  {currentView === 'favorites' 
                    ? 'Start adding businesses to your favorites!' 
                    : 'Try adjusting your search criteria.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <div key={business.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-1">{business.name}</h3>
                          {getVerificationBadge(business.verification_status)}
                        </div>
                        <button
                          onClick={() => toggleFavorite(business.id)}
                          className={`ml-2 text-2xl ${
                            favorites.includes(business.id) ? 'text-red-500' : 'text-gray-300'
                          } hover:text-red-500 transition-colors`}
                        >
                          ❤️
                        </button>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium mr-2">Category:</span>
                          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                            {business.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium mr-2">Type:</span>
                          <span>{getBusinessTypeDisplay(business.business_type)}</span>
                        </div>
                        
                        {business.city && business.state && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium mr-2">Location:</span>
                            <span>{business.city}, {business.state}</span>
                          </div>
                        )}
                      </div>
                      
                      {business.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{business.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {business.phone && (
                          <a
                            href={`tel:${business.phone}`}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                          >
                            📞 Call
                          </a>
                        )}
                        {business.email && (
                          <a
                            href={`mailto:${business.email}`}
                            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                          >
                            ✉️ Email
                          </a>
                        )}
                        {business.website && (
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                          >
                            🌐 Website
                          </a>
                        )}
                      </div>

                      {/* Admin Controls */}
                      {isAdminAuthenticated && (
                        <div className="flex space-x-2 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleEditBusiness(business)}
                            className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBusiness(business)}
                            className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile/Contact View */}
        {currentView === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
              
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="from_name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="from_email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
              <span className="text-lg">🏪</span>
            </div>
            <span className="text-xl font-bold">Melanin Market</span>
          </div>
          <p className="text-gray-400 mb-4">
            Supporting and celebrating Black-owned businesses across America
          </p>
          <div className="text-sm text-gray-500">
            <p>© 2024 Melanin Market. All rights reserved.</p>
            <p className="mt-2">
              Powered by Supabase • {businesses.length} businesses and growing
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;


