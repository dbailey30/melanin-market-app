import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

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
  const [apiStatus, setApiStatus] = useState('checking');
  const [citySearch, setCitySearch] = useState('');

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

  // Load businesses from GitHub via Vercel serverless API
  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/businesses', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const err = await response.json();
        console.error('Error loading businesses:', err);
        setApiStatus('error');
        return;
      }

      const data = await response.json();
      setBusinesses(data.businesses || []);
      setApiStatus('connected');
    } catch (error) {
      console.error('Error connecting to businesses API:', error);
      setApiStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Add new business
  const addBusiness = async (businessData) => {
    try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminAuth: ADMIN_PASSWORD,
          businessData: businessData,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        return { success: false, error: result.error || result.message || 'Unknown error' };
      }
      await loadBusinesses();
      return { success: true, data: result.business };
    } catch (error) {
      console.error('Error adding business:', error);
      return { success: false, error: error.message };
    }
  };

  // Update existing business
  const updateBusiness = async (id, businessData) => {
    try {
      const response = await fetch('/api/businesses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminAuth: ADMIN_PASSWORD,
          businessId: id,
          businessData: businessData,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        return { success: false, error: result.error || result.message || 'Unknown error' };
      }
      await loadBusinesses();
      return { success: true, data: result.business };
    } catch (error) {
      console.error('Error updating business:', error);
      return { success: false, error: error.message };
    }
  };

  // Delete business
  const deleteBusiness = async (id) => {
    try {
      const response = await fetch('/api/businesses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminAuth: ADMIN_PASSWORD,
          businessId: id,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        return { success: false, error: result.error || result.message || 'Unknown error' };
      }
      await loadBusinesses();
      return { success: true };
    } catch (error) {
      console.error('Error deleting business:', error);
      return { success: false, error: error.message };
    }
  };

  // Load businesses on mount
  useEffect(() => {
    loadBusinesses();
    const savedFavorites = localStorage.getItem('melanin-market-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Filter businesses
  useEffect(() => {
    let filtered = businesses;

    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (citySearch) {
      filtered = filtered.filter(business =>
        business.city.toLowerCase().includes(citySearch.toLowerCase()) ||
        business.state.toLowerCase().includes(citySearch.toLowerCase())
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
  }, [businesses, searchTerm, citySearch, selectedCategory, selectedState, selectedBusinessType, currentView, favorites]);

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setShowAdminPanel(true);
      setAdminPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setShowAdminPanel(false);
    setCurrentView('home');
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    if (editingBusiness) {
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

  const toggleFavorite = (businessId) => {
    const newFavorites = favorites.includes(businessId)
      ? favorites.filter(id => id !== businessId)
      : [...favorites, businessId];
    setFavorites(newFavorites);
    localStorage.setItem('melanin-market-favorites', JSON.stringify(newFavorites));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
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

  const getBusinessTypeDisplay = (type) => {
    switch (type) {
      case 'physical': return '🏢 Physical';
      case 'online': return '💻 Online';
      case 'mobile': return '🚚 Mobile';
      default: return '🏢 Physical';
    }
  };

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
          <img src="/logo.PNG" alt="Melanin Market" className="w-16 h-16 rounded-xl mx-auto mb-4 object-contain" />
          <p className="text-amber-800 text-lg font-medium">Loading businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 pb-20">

      {/* ── HEADER ── */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Title */}
            <div className="flex items-center space-x-3">
              <img
                src="/logo.PNG"
                alt="Melanin Market Logo"
                className="w-12 h-12 rounded-lg object-contain bg-white p-1"
              />
              <div>
                <h1 className="text-2xl font-extrabold tracking-wide">MELANIN MARKET</h1>
                <p className="text-amber-100 text-xs">Discover • Support • Thrive</p>
              </div>
            </div>

            {/* Right side: status + admin */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  apiStatus === 'connected' ? 'bg-green-400' :
                  apiStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                }`}></div>
              </div>
              {!isAdminAuthenticated ? (
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="text-sm bg-white text-amber-700 font-semibold px-4 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  Admin
                </button>
              ) : (
                <button
                  onClick={handleAdminLogout}
                  className="text-sm bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── ADMIN LOGIN PANEL ── */}
      {showAdminPanel && !isAdminAuthenticated && (
        <div className="bg-amber-100 border-l-4 border-amber-500 p-4">
          <div className="container mx-auto flex items-center space-x-4">
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
      )}

      {/* ── ADMIN MANAGEMENT BAR ── */}
      {isAdminAuthenticated && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-green-800">Business Management</h2>
              <p className="text-green-600 text-sm">
                GitHub API: {apiStatus === 'connected' ? 'CONNECTED' : 'ERROR'} • Changes saved directly to repository
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => { resetBusinessForm(); setEditingBusiness(null); setShowBusinessForm(true); }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>➕</span><span>Add New Business</span>
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
      )}

      {/* ── HERO SECTION (home view only) ── */}
      {currentView === 'home' && (
        <section className="bg-gradient-to-b from-amber-50 to-orange-50 py-10 px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
            Discover Minority-Owned Businesses
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-sm md:text-base">
            Support local entrepreneurs and build stronger communities together. Find authentic businesses owned by
            Black, Hispanic, Asian, Native American, and other minority entrepreneurs — both physical locations and online businesses.
          </p>

          {/* City/State search */}
          <div className="max-w-lg mx-auto mb-4">
            <input
              type="text"
              placeholder="Enter City, State (e.g., Buffalo, NY)"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700"
            />
          </div>

          {/* Find Businesses button */}
          <div className="max-w-lg mx-auto mb-3">
            <button
              onClick={() => setCurrentView('search')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl shadow transition-colors text-lg"
            >
              🔍 Find Businesses
            </button>
          </div>

          {/* List Your Business button */}
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => { resetBusinessForm(); setEditingBusiness(null); setShowBusinessForm(true); }}
              className="w-full bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-bold py-3 rounded-2xl transition-colors text-lg"
            >
              + List Your Business
            </button>
          </div>
        </section>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="container mx-auto px-4 py-6">

        {/* Business Form Modal */}
        {showBusinessForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-amber-800">
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
                    onClick={() => { setShowBusinessForm(false); setEditingBusiness(null); resetBusinessForm(); }}
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

        {/* ── SEARCH VIEW FILTERS ── */}
        {currentView === 'search' && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-xl font-bold text-amber-800 mb-4">Search Businesses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <input
                    type="text"
                    placeholder="Search by name, description..."
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
                      {type === 'All' ? 'All Types' : type === 'physical' ? 'Physical' : type === 'online' ? 'Online' : 'Mobile'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── BUSINESS STATISTICS ── */}
        {(currentView === 'home' || currentView === 'search' || currentView === 'favorites') && (
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-amber-500">
                <div className="text-2xl font-bold text-amber-600">{businesses.length}</div>
                <div className="text-sm text-gray-600">Total Businesses</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-green-500">
                <div className="text-2xl font-bold text-green-600">
                  {businesses.filter(b => b.verification_status === 'verified').length}
                </div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-blue-500">
                <div className="text-2xl font-bold text-blue-600">
                  {businesses.filter(b => b.business_type === 'physical').length}
                </div>
                <div className="text-sm text-gray-600">Physical</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center border-t-4 border-purple-500">
                <div className="text-2xl font-bold text-purple-600">
                  {businesses.filter(b => b.business_type === 'online').length}
                </div>
                <div className="text-sm text-gray-600">Online</div>
              </div>
            </div>
          </div>
        )}

        {/* ── BUSINESS LISTINGS ── */}
        {(currentView === 'home' || currentView === 'search' || currentView === 'favorites') && (
          <div>
            <div className="flex justify-between items-center mb-4">
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
                  <div key={business.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-amber-100">
                    {/* Card header */}
                    <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-t-xl px-5 py-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white">{business.name}</h3>
                        {business.category && (
                          <span className="text-xs bg-white bg-opacity-20 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
                            {business.category}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleFavorite(business.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          favorites.includes(business.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white bg-opacity-20 text-white hover:bg-red-500'
                        }`}
                      >
                        ❤️
                      </button>
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <div className="space-y-1 mb-3 text-sm text-gray-600">
                        <div><span className="font-medium">Type:</span> {getBusinessTypeDisplay(business.business_type)}</div>
                        {business.city && business.state && (
                          <div><span className="font-medium">Location:</span> {business.city}, {business.state}</div>
                        )}
                        {getVerificationBadge(business.verification_status)}
                      </div>

                      {business.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{business.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        {business.phone && (
                          <a href={`tel:${business.phone}`} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors">
                            📞 Call
                          </a>
                        )}
                        {business.email && (
                          <a href={`mailto:${business.email}`} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors">
                            ✉️ Email
                          </a>
                        )}
                        {business.website && (
                          <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 transition-colors">
                            🌐 Website
                          </a>
                        )}
                      </div>

                      {isAdminAuthenticated && (
                        <div className="flex space-x-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleEditBusiness(business)}
                            className="flex-1 bg-yellow-500 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBusiness(business)}
                            className="flex-1 bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600 transition-colors"
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

        {/* ── PROFILE / CONTACT VIEW ── */}
        {currentView === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" name="from_name" required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" name="from_email" required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input type="text" name="subject" required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea name="message" required rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
                </div>
                <button type="submit"
                  className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors font-medium">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-800 text-white py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <img src="/logo.PNG" alt="Melanin Market" className="w-8 h-8 rounded-md object-contain bg-white p-0.5" />
            <span className="text-xl font-bold">Melanin Market</span>
          </div>
          <p className="text-gray-400 mb-3 text-sm">
            Supporting and celebrating Black-owned businesses across America
          </p>
          <div className="text-sm text-gray-500">
            <p>© 2024 Melanin Market. All rights reserved.</p>
            <p className="mt-1">Powered by GitHub • {businesses.length} businesses and growing</p>
          </div>
        </div>
      </footer>

      {/* ── BOTTOM NAVIGATION ── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="grid grid-cols-4">
          {[
            { view: 'home', icon: '🏠', label: 'Home' },
            { view: 'search', icon: '🔍', label: 'Search' },
            { view: 'favorites', icon: '❤️', label: 'Favorites' },
            { view: 'profile', icon: '👤', label: 'Profile' },
          ].map(({ view, icon, label }) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`flex flex-col items-center justify-center py-3 text-xs font-medium transition-colors ${
                currentView === view
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-xl mb-0.5">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
}

export default App;
