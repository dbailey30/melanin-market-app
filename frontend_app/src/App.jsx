import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

// Admin password for business management
const ADMIN_PASSWORD = 'melanin2025admin';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_l1mf75l',
  TEMPLATE_ID: 'template_1zwylhd',
  CONFIRMATION_TEMPLATE_ID: 'template_confirmation',
  PUBLIC_KEY: 'jv0z8LO2xSTdzuvDz'
};

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
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [showPublicSubmitForm, setShowPublicSubmitForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Admin business form state
  const [businessForm, setBusinessForm] = useState({
    name: '', type: '', owner: '', category: '', description: '',
    address: '', city: '', state: '', zip: '', phone: '', email: '',
    website: '', hours: '', image: '', rating: '0.0 (0)', service_area: '',
    business_type: 'physical', verificationSubmitted: false,
    verificationMethod: '', verificationDetails: '', verification_document: ''
  });

  // Public submission form state (separate from admin form)
  const [publicForm, setPublicForm] = useState({
    name: '', business_type: 'physical', category: '', owner: '',
    description: '', address: '', city: '', state: '', service_area: '',
    phone: '', email: '', website: '', hours: '', image: '',
    business_base: '', logo_url: '',
    verificationMethod: '', verificationDetails: ''
  });

  const categoryTabs = ['All', 'Restaurant', 'Technology', 'Grocery', 'Entertainment', 'Beauty', 'Health', 'Retail', 'Services', 'Other'];

  const allCategories = [
    'Restaurant', 'Technology', 'Grocery', 'Entertainment', 'Beauty',
    'Health', 'Retail', 'Services', 'Coffee', 'Other'
  ];

  const states = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID',
    'IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO',
    'MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA',
    'RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
  ];

  // PWA install prompt listener
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      setShowInstallModal(true);
    }
  };

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  // Load businesses from API
  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/businesses', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
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

  // Admin: Add new business directly
  const addBusiness = async (businessData) => {
    try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminAuth: ADMIN_PASSWORD, businessData }),
      });
      const result = await response.json();
      if (!response.ok) return { success: false, error: result.error || 'Unknown error' };
      await loadBusinesses();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Admin: Update existing business
  const updateBusiness = async (id, businessData) => {
    try {
      const response = await fetch('/api/businesses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminAuth: ADMIN_PASSWORD, businessId: id, businessData }),
      });
      const result = await response.json();
      if (!response.ok) return { success: false, error: result.error || 'Unknown error' };
      await loadBusinesses();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Admin: Delete business
  const deleteBusiness = async (id) => {
    try {
      const response = await fetch('/api/businesses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminAuth: ADMIN_PASSWORD, businessId: id }),
      });
      const result = await response.json();
      if (!response.ok) return { success: false, error: result.error || 'Unknown error' };
      await loadBusinesses();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    loadBusinesses();
    const savedFavorites = localStorage.getItem('melanin-market-favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // Filter businesses
  useEffect(() => {
    let filtered = businesses;
    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (citySearch) {
      filtered = filtered.filter(b =>
        b.city?.toLowerCase().includes(citySearch.toLowerCase()) ||
        b.state?.toLowerCase().includes(citySearch.toLowerCase()) ||
        b.address?.toLowerCase().includes(citySearch.toLowerCase())
      );
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(b =>
        (b.category || b.type || '').toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (selectedState !== 'All') {
      filtered = filtered.filter(b => b.state === selectedState);
    }
    if (selectedBusinessType !== 'All') {
      filtered = filtered.filter(b => b.business_type === selectedBusinessType);
    }
    if (currentView === 'favorites') {
      filtered = filtered.filter(b => favorites.includes(b.id));
    }
    setFilteredBusinesses(filtered);
  }, [businesses, searchTerm, citySearch, selectedCategory, selectedState, selectedBusinessType, currentView, favorites]);

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setShowAdminPanel(false);
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

  const resetBusinessForm = () => {
    setBusinessForm({
      name: '', type: '', owner: '', category: '', description: '',
      address: '', city: '', state: '', zip: '', phone: '', email: '',
      website: '', hours: '', image: '', rating: '0.0 (0)', service_area: '',
      business_type: 'physical', verificationSubmitted: false,
      verificationMethod: '', verificationDetails: '', verification_document: ''
    });
  };

  const resetPublicForm = () => {
    setPublicForm({
      name: '', business_type: 'physical', category: '', owner: '',
      description: '', address: '', city: '', state: '', service_area: '',
      phone: '', email: '', website: '', hours: '', image: '',
      business_base: '', logo_url: '',
      verificationMethod: '', verificationDetails: ''
    });
  };

  // Admin form submit (direct add/update to live app)
  const handleAdminBusinessSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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
    setIsSubmitting(false);
  };

  // Public form submit — sends email to admin for approval, does NOT add to app
  const handlePublicSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const templateParams = {
      to_email: 'admin@melanin-market.com',
      subject: `New Business Submission - ${publicForm.name}`,
      business_name: publicForm.name,
      business_type: publicForm.business_type,
      category: publicForm.category,
      owner_ethnicity: publicForm.owner,
      description: publicForm.description,
      address: publicForm.business_type === 'physical' ? publicForm.address : 'Online/Mobile Business',
      city: publicForm.city,
      state: publicForm.state,
      service_area: publicForm.service_area,
      phone: publicForm.phone,
      email: publicForm.email,
      website: publicForm.website,
      hours: publicForm.hours,
      verification_method: publicForm.verificationMethod || 'Not provided',
      verification_details: publicForm.verificationDetails || 'Not provided',
      message: `New business submission for review:\n\nBusiness: ${publicForm.name}\nType: ${publicForm.business_type}\nCategory: ${publicForm.category}\nOwner: ${publicForm.owner}\nDescription: ${publicForm.description}\nAddress: ${publicForm.address}, ${publicForm.city}, ${publicForm.state}\nService Area: ${publicForm.service_area}\nPhone: ${publicForm.phone}\nEmail: ${publicForm.email}\nWebsite: ${publicForm.website}\nHours: ${publicForm.hours}\nVerification Method: ${publicForm.verificationMethod || 'Not provided'}\nVerification Details: ${publicForm.verificationDetails || 'Not provided'}`
    };

    try {
      // Send admin notification
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      // Send owner confirmation email
      const confirmationParams = {
        to_email: publicForm.email,
        to_name: publicForm.owner || 'Business Owner',
        business_name: publicForm.name,
        reply_to: 'admin@melanin-market.com',
        message: `Thank you for submitting ${publicForm.name} to Melanin Market. We have received your submission and it is currently under review by our team. You will receive a follow-up email once your business has been approved and added to our directory. We appreciate your interest in joining our community of minority-owned businesses.\n\nIf you have any questions in the meantime, please feel free to reach out to us at admin@melanin-market.com.\n\nWarm regards,\nThe Melanin Market Team`
      };

      try {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.CONFIRMATION_TEMPLATE_ID,
          confirmationParams,
          EMAILJS_CONFIG.PUBLIC_KEY
        );
      } catch (confirmErr) {
        // Confirmation email failure is non-blocking
        console.warn('Confirmation email failed:', confirmErr);
      }

      setSubmitSuccess(true);
      resetPublicForm();
    } catch (error) {
      console.error('EmailJS error:', error);
      alert('There was an error submitting your business. Please try again or contact us directly at admin@melanin-market.com');
    }
    setIsSubmitting(false);
  };

  const handleDeleteBusiness = async (business) => {
    if (window.confirm(`Are you sure you want to delete "${business.name}"?`)) {
      const result = await deleteBusiness(business.id);
      if (!result.success) alert(`Error deleting business: ${result.error}`);
    }
  };

  const handleEditBusiness = (business) => {
    setBusinessForm({
      name: business.name || '',
      type: business.type || '',
      owner: business.owner || '',
      category: business.category || business.type || '',
      description: business.description || '',
      address: business.address || '',
      city: business.city || '',
      state: business.state || '',
      zip: business.zip || '',
      phone: business.phone || '',
      email: business.email || '',
      website: business.website || '',
      hours: business.hours || '',
      image: business.image || '',
      rating: business.rating || '0.0 (0)',
      service_area: business.service_area || '',
      business_type: business.business_type || 'physical',
      verificationSubmitted: business.verificationSubmitted || business.verified || false,
      verificationMethod: business.verificationMethod || '',
      verificationDetails: business.verificationDetails || '',
      verification_document: business.verification_document || ''
    });
    setEditingBusiness(business);
    setShowBusinessForm(true);
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
    emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, e.target, EMAILJS_CONFIG.PUBLIC_KEY)
      .then(() => { alert('Message sent successfully!'); e.target.reset(); })
      .catch(() => alert('Failed to send message. Please try again.'));
  };

  const getDirectionsUrl = (business) => {
    const addr = [business.address, business.city, business.state].filter(Boolean).join(', ');
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
  };

  const isVerified = (b) => b.verificationSubmitted || b.verified || b.verification_status === 'verified';
  const getCategoryDisplay = (b) => b.category || b.type || '';

  const renderStars = (ratingStr) => {
    if (!ratingStr) return null;
    const num = parseFloat(ratingStr);
    if (isNaN(num)) return null;
    const full = Math.floor(num);
    return '⭐'.repeat(Math.min(full, 5));
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <img src="/logo.PNG" alt="Melanin Market" className="w-16 h-16 rounded-xl mx-auto mb-4 object-contain"
            onError={(e) => { e.target.style.display='none'; }} />
          <p className="text-amber-800 text-lg font-medium">Loading businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 pb-20">

      {/* ── INSTALL APP MODAL ── */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center mb-4">
              <span className="text-4xl">📱</span>
              <h2 className="text-xl font-bold text-gray-800 mt-2">Install Melanin Market</h2>
              <p className="text-gray-500 text-sm mt-1">Add to your home screen for quick access</p>
            </div>
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="font-semibold text-amber-800 text-sm">📱 iPhone / iPad (Safari)</p>
                <p className="text-gray-600 text-xs mt-1">Tap the <strong>Share</strong> button (box with arrow) at the bottom → then tap <strong>"Add to Home Screen"</strong></p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="font-semibold text-amber-800 text-sm">🤖 Android (Chrome)</p>
                <p className="text-gray-600 text-xs mt-1">Tap the <strong>menu (⋮)</strong> in the top right → tap <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong></p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="font-semibold text-amber-800 text-sm">💻 Desktop (Chrome / Edge)</p>
                <p className="text-gray-600 text-xs mt-1">Look for the <strong>install icon (⊕)</strong> in the address bar on the right side and click it</p>
              </div>
            </div>
            <button
              onClick={() => setShowInstallModal(false)}
              className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 rounded-xl"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.PNG"
                alt="Melanin Market Logo"
                className="w-12 h-12 rounded-lg object-contain bg-white p-1"
                onError={(e) => { e.target.style.display='none'; }}
              />
              <div>
                <h1 className="text-2xl font-extrabold tracking-wide">MELANIN MARKET</h1>
                <p className="text-amber-100 text-xs">Discover • Support • Thrive</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-2.5 h-2.5 rounded-full ${
                apiStatus === 'connected' ? 'bg-green-400' :
                apiStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
              }`}></div>
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
            <button onClick={handleAdminLogin}
              className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors">
              Login
            </button>
            <button onClick={() => setShowAdminPanel(false)} className="text-amber-600 hover:text-amber-800">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── ADMIN MANAGEMENT BAR ── */}
      {isAdminAuthenticated && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4">
          <div className="container mx-auto flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-semibold text-green-800">Business Management</h2>
              <p className="text-green-600 text-sm">
                API: {apiStatus === 'connected' ? '✅ CONNECTED' : '❌ ERROR'} • Changes saved to repository
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => { resetBusinessForm(); setEditingBusiness(null); setShowBusinessForm(true); }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>➕</span><span>Add New Business</span>
              </button>
              <button onClick={handleAdminLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
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
          <div className="max-w-lg mx-auto mb-4">
            <input
              type="text"
              placeholder="Enter City, State (e.g., Buffalo, NY)"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-700"
            />
          </div>
          <div className="max-w-lg mx-auto mb-3">
            <button
              onClick={() => setCurrentView('search')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl shadow transition-colors text-lg"
            >
              🔍 Find Businesses
            </button>
          </div>
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => { setShowPublicSubmitForm(true); setSubmitSuccess(false); }}
              className="w-full bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-bold py-3 rounded-2xl transition-colors text-lg"
            >
              + List Your Business
            </button>
          </div>
          <div className="max-w-lg mx-auto mt-3">
            <button
              onClick={handleInstallApp}
              className="w-full bg-transparent border-2 border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white font-bold py-3 rounded-2xl transition-colors text-lg"
            >
              📲 Install App
            </button>
          </div>
        </section>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="container mx-auto px-4 py-6">

        {/* ── PUBLIC BUSINESS SUBMISSION FORM (modal) ── */}
        {showPublicSubmitForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">

              {submitSuccess ? (
                <div className="text-center py-10">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-green-700 mb-3">Submission Received!</h2>
                  <p className="text-gray-600 mb-2">
                    Thank you for submitting <strong>{publicForm.name || 'your business'}</strong>!
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    Our team will review your submission and add it to the Melanin Market directory after approval.
                    You will be contacted at the email you provided.
                  </p>
                  <button
                    onClick={() => { setShowPublicSubmitForm(false); setSubmitSuccess(false); }}
                    className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Add Your Business</h2>
                      <p className="text-gray-500 text-sm mt-1">
                        Join our community of minority-owned businesses and reach more customers.
                        We support physical locations, online businesses, and mobile services.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPublicSubmitForm(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold ml-4"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Install App Banner */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📱</span>
                      <div>
                        <p className="font-semibold text-amber-800 text-sm">Install Melanin Market</p>
                        <p className="text-amber-600 text-xs">Add to your home screen for quick access</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleInstallApp}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors whitespace-nowrap"
                    >
                      Install App
                    </button>
                  </div>

                  <form onSubmit={handlePublicSubmit} className="space-y-4">

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name *</label>
                      <input type="text" required value={publicForm.name}
                        onChange={(e) => setPublicForm({...publicForm, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Business Type *</label>
                        <select required value={publicForm.business_type}
                          onChange={(e) => setPublicForm({...publicForm, business_type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                          <option value="physical">Physical Location/Storefront</option>
                          <option value="online">Online Business Only</option>
                          <option value="mobile">Mobile/Service Business</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                        <select required value={publicForm.category}
                          onChange={(e) => setPublicForm({...publicForm, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                          <option value="">Select category</option>
                          {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Owner Ethnicity *</label>
                      <select required value={publicForm.owner}
                        onChange={(e) => setPublicForm({...publicForm, owner: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                        <option value="">Select owner ethnicity</option>
                        <option value="Black-owned">Black-owned</option>
                        <option value="Hispanic-owned">Hispanic-owned</option>
                        <option value="Asian-owned">Asian-owned</option>
                        <option value="Native American-owned">Native American-owned</option>
                        <option value="Latino-owned">Latino-owned</option>
                        <option value="Other minority-owned">Other minority-owned</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                      <textarea required value={publicForm.description} rows="3"
                        onChange={(e) => setPublicForm({...publicForm, description: e.target.value})}
                        placeholder="Tell customers about your business..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>

                    {/* Business Base — auto-filled for online businesses */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Business Base (Optional)</label>
                      <input
                        type="text"
                        value={publicForm.business_type === 'online' ? 'Online Business' : publicForm.business_base}
                        onChange={(e) => setPublicForm({...publicForm, business_base: e.target.value})}
                        readOnly={publicForm.business_type === 'online'}
                        placeholder={publicForm.business_type === 'mobile' ? 'e.g., Buffalo, NY' : 'e.g., Buffalo, NY'}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${publicForm.business_type === 'online' ? 'bg-amber-50 text-amber-800 font-semibold' : ''}`}
                      />
                    </div>

                    {/* Address — only required for physical */}
                    {publicForm.business_type === 'physical' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Address *</label>
                        <input type="text" required value={publicForm.address}
                          onChange={(e) => setPublicForm({...publicForm, address: e.target.value})}
                          placeholder="Street address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          City {publicForm.business_type === 'physical' ? '*' : ''}
                        </label>
                        <input
                          type="text"
                          required={publicForm.business_type === 'physical'}
                          value={publicForm.city}
                          onChange={(e) => setPublicForm({...publicForm, city: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          State {publicForm.business_type === 'physical' ? '*' : ''}
                        </label>
                        <select
                          required={publicForm.business_type === 'physical'}
                          value={publicForm.state}
                          onChange={(e) => setPublicForm({...publicForm, state: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                          <option value="">Select State</option>
                          {states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Service Area</label>
                      <input type="text" value={publicForm.service_area}
                        onChange={(e) => setPublicForm({...publicForm, service_area: e.target.value})}
                        placeholder={publicForm.business_type === 'online' ? 'e.g., Nationwide, Worldwide Shipping' : 'Local area served'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                        <input type="tel" required value={publicForm.phone}
                          onChange={(e) => setPublicForm({...publicForm, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                        <input type="email" required value={publicForm.email}
                          onChange={(e) => setPublicForm({...publicForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                      <input type="url" value={publicForm.website}
                        onChange={(e) => setPublicForm({...publicForm, website: e.target.value})}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Hours</label>
                      <textarea value={publicForm.hours} rows="2"
                        onChange={(e) => setPublicForm({...publicForm, hours: e.target.value})}
                        placeholder="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>

                    {/* Business Logo / Photo */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Business Logo or Photo URL (Optional)</label>
                      <input
                        type="url"
                        value={publicForm.logo_url}
                        onChange={(e) => setPublicForm({...publicForm, logo_url: e.target.value, image: e.target.value})}
                        placeholder="https://yourwebsite.com/logo.png"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">Paste a direct link to your business logo or photo image</p>
                    </div>

                    {/* Business Verification Section */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h3 className="text-base font-bold text-amber-800 mb-1">🏆 Business Verification (Optional)</h3>
                      <p className="text-amber-700 text-sm mb-4">
                        Provide verification details to receive a verified business badge and build customer trust.
                      </p>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Verification Method</label>
                          <select value={publicForm.verificationMethod}
                            onChange={(e) => setPublicForm({...publicForm, verificationMethod: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <option value="">Select verification method</option>
                            <option value="business-license">Business License</option>
                            <option value="ein">EIN Number</option>
                            <option value="dba">DBA Certificate</option>
                            <option value="other">Other Documentation</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Verification Details</label>
                          <input type="text" value={publicForm.verificationDetails}
                            onChange={(e) => setPublicForm({...publicForm, verificationDetails: e.target.value})}
                            placeholder="License number, EIN, or other verification info"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        </div>
                      </div>
                    </div>

                    <button type="submit" disabled={isSubmitting}
                      className="w-full bg-orange-500 text-white py-4 rounded-xl hover:bg-orange-600 transition-colors font-bold text-lg disabled:opacity-60 flex items-center justify-center gap-2">
                      {isSubmitting ? 'Submitting...' : '📋 Submit Business for Review'}
                    </button>

                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── ADMIN BUSINESS FORM MODAL ── */}
        {showBusinessForm && isAdminAuthenticated && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-amber-800">
                {editingBusiness ? 'Edit Business' : 'Add New Business (Admin)'}
              </h2>
              <form onSubmit={handleAdminBusinessSubmit} className="space-y-4">

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name *</label>
                  <input type="text" required value={businessForm.name}
                    onChange={(e) => setBusinessForm({...businessForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Business Type *</label>
                    <select required value={businessForm.business_type}
                      onChange={(e) => setBusinessForm({...businessForm, business_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="physical">Physical Location/Storefront</option>
                      <option value="online">Online Business Only</option>
                      <option value="mobile">Mobile/Service Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                    <select required value={businessForm.category || businessForm.type}
                      onChange={(e) => setBusinessForm({...businessForm, category: e.target.value, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="">Select category</option>
                      {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Owner Ethnicity *</label>
                  <select required value={businessForm.owner}
                    onChange={(e) => setBusinessForm({...businessForm, owner: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">Select owner ethnicity</option>
                    <option value="Black-owned">Black-owned</option>
                    <option value="Hispanic-owned">Hispanic-owned</option>
                    <option value="Asian-owned">Asian-owned</option>
                    <option value="Native American-owned">Native American-owned</option>
                    <option value="Latino-owned">Latino-owned</option>
                    <option value="Other minority-owned">Other minority-owned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                  <textarea required value={businessForm.description} rows="3"
                    onChange={(e) => setBusinessForm({...businessForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                  <input type="text" value={businessForm.address}
                    onChange={(e) => setBusinessForm({...businessForm, address: e.target.value})}
                    placeholder="Street address (leave blank for online businesses)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                    <input type="text" value={businessForm.city}
                      onChange={(e) => setBusinessForm({...businessForm, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                    <select value={businessForm.state}
                      onChange={(e) => setBusinessForm({...businessForm, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="">Select State</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Service Area</label>
                  <input type="text" value={businessForm.service_area}
                    onChange={(e) => setBusinessForm({...businessForm, service_area: e.target.value})}
                    placeholder="Local area served"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                    <input type="tel" required value={businessForm.phone}
                      onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                    <input type="email" required value={businessForm.email}
                      onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                  <input type="url" value={businessForm.website}
                    onChange={(e) => setBusinessForm({...businessForm, website: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hours</label>
                  <textarea value={businessForm.hours} rows="2"
                    onChange={(e) => setBusinessForm({...businessForm, hours: e.target.value})}
                    placeholder="Mon-Fri: 9AM-6PM, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                  <input type="url" value={businessForm.image}
                    onChange={(e) => setBusinessForm({...businessForm, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
                  <input type="text" value={businessForm.rating}
                    onChange={(e) => setBusinessForm({...businessForm, rating: e.target.value})}
                    placeholder="4.5 (123)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Verification Status</label>
                  <select value={businessForm.verificationSubmitted ? 'verified' : 'unverified'}
                    onChange={(e) => setBusinessForm({...businessForm, verificationSubmitted: e.target.value === 'verified'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="unverified">Not Verified</option>
                    <option value="verified">Verified Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Verification Method</label>
                  <select value={businessForm.verificationMethod}
                    onChange={(e) => setBusinessForm({...businessForm, verificationMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">Select verification method</option>
                    <option value="business-license">Business License</option>
                    <option value="ein">EIN Number</option>
                    <option value="dba">DBA Certificate</option>
                    <option value="other">Other Documentation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Verification Details</label>
                  <input type="text" value={businessForm.verificationDetails}
                    onChange={(e) => setBusinessForm({...businessForm, verificationDetails: e.target.value})}
                    placeholder="License number, EIN, or other verification info"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-bold text-lg disabled:opacity-60">
                    {isSubmitting ? 'Saving...' : (editingBusiness ? 'Update Business' : 'Add Business')}
                  </button>
                  <button type="button"
                    onClick={() => { setShowBusinessForm(false); setEditingBusiness(null); resetBusinessForm(); }}
                    className="flex-1 border-2 border-orange-500 text-orange-600 py-3 rounded-lg hover:bg-orange-500 hover:text-white transition-colors font-bold text-lg">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── SEARCH VIEW ── */}
        {currentView === 'search' && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <button onClick={() => setCurrentView('home')}
                className="flex items-center text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm mr-4">
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-gray-800">All Businesses</h1>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Search by name, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <select value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="All">All States</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={selectedBusinessType}
                  onChange={(e) => setSelectedBusinessType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="All">All Types</option>
                  <option value="physical">Physical</option>
                  <option value="online">Online</option>
                  <option value="mobile">Mobile</option>
                </select>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categoryTabs.map(cat => (
                <button key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500 mb-4">{filteredBusinesses.length} businesses found</p>
          </div>
        )}

        {/* ── FAVORITES VIEW HEADER ── */}
        {currentView === 'favorites' && (
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Your Favorites</h1>
            <p className="text-sm text-gray-500 mt-1">{filteredBusinesses.length} saved businesses</p>
          </div>
        )}

        {/* ── HOME FEATURE CARDS (home view only) ── */}
        {currentView === 'home' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Popular Cities */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">Popular Cities:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Buffalo, NY', 'Rochester, NY', 'Syracuse, NY'].map(city => (
                  <button key={city}
                    onClick={() => { setCitySearch(city); setCurrentView('search'); }}
                    className="px-5 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:border-orange-400 hover:text-orange-600 shadow-sm transition-colors">
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Cards */}
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Discover Local & Online</h3>
              <p className="text-gray-500 text-sm">Find authentic minority-owned businesses in your community and online, from restaurants and cafes to tech companies and e-commerce stores.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Support & Save</h3>
              <p className="text-gray-500 text-sm">Save your favorite businesses and support entrepreneurs who are building stronger, more diverse communities both locally and globally.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Build Community</h3>
              <p className="text-gray-500 text-sm">Connect with business owners, leave reviews, and help create a thriving ecosystem of minority-owned enterprises across all business types.</p>
            </div>
          </div>
        )}

        {/* ── BUSINESS LISTINGS ── */}
        {(currentView === 'search' || currentView === 'favorites') && (
          <div>

            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {currentView === 'favorites' ? 'No favorites yet' : 'No businesses found'}
                </h3>
                <p className="text-gray-500">
                  {currentView === 'favorites'
                    ? 'Tap the heart on any business to save it here.'
                    : 'Try adjusting your search or filters.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBusinesses.map((business) => (
                  <div key={business.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-amber-100">

                    {/* Business image */}
                    {business.image && (
                      <img
                        src={business.image}
                        alt={business.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => { e.target.style.display='none'; }}
                      />
                    )}

                    <div className="p-5">
                      {/* Name + verified badge */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-bold text-gray-900">{business.name}</h3>
                          {isVerified(business) && (
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                              🏆 Verified Business
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => toggleFavorite(business.id)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ml-2 ${
                            favorites.includes(business.id) ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-red-100'
                          }`}
                        >
                          ❤️
                        </button>
                      </div>

                      {/* Category tag */}
                      {getCategoryDisplay(business) && (
                        <span className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
                          {getCategoryDisplay(business)}
                        </span>
                      )}

                      {/* Description */}
                      {business.description && (
                        <p className="text-gray-600 text-sm mb-3">{business.description}</p>
                      )}

                      {/* Rating */}
                      {business.rating && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-base">{renderStars(business.rating)}</span>
                          <span className="text-amber-700 font-semibold text-sm">{business.rating}</span>
                        </div>
                      )}

                      {/* Address with directions (physical only) */}
                      {business.business_type !== 'online' && business.address && (
                        <div className="mb-1">
                          <a
                            href={getDirectionsUrl(business)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-orange-600 hover:text-orange-800 underline"
                          >
                            📍 {[business.address, business.city, business.state].filter(Boolean).join(', ')} (Get Directions)
                          </a>
                        </div>
                      )}

                      {/* Online business indicator */}
                      {business.business_type === 'online' && (
                        <div className="text-sm text-gray-600 mb-1">
                          🌐 Online Business{business.service_area ? ` • Serves: ${business.service_area}` : ''}
                        </div>
                      )}

                      {/* Service area (for non-online) */}
                      {business.business_type !== 'online' && business.service_area && (
                        <div className="text-sm text-gray-600 mb-1">🗺️ Service Area: {business.service_area}</div>
                      )}

                      {/* Phone */}
                      {business.phone && (
                        <div className="text-sm text-gray-600 mb-1">
                          <a href={`tel:${business.phone}`} className="hover:text-orange-600">📞 {business.phone}</a>
                        </div>
                      )}

                      {/* Hours */}
                      {business.hours && (
                        <div className="text-sm text-gray-600 mb-1">🕒 {business.hours}</div>
                      )}

                      {/* Website */}
                      {business.website && (
                        <div className="text-sm mb-3">
                          <a href={business.website} target="_blank" rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-800 underline">
                            🌐 {business.website}
                          </a>
                        </div>
                      )}

                      {/* Add to Favorites button */}
                      <button
                        onClick={() => toggleFavorite(business.id)}
                        className={`w-full py-3 rounded-xl font-bold text-base transition-colors mt-2 ${
                          favorites.includes(business.id)
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                      >
                        {favorites.includes(business.id) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                      </button>

                      {/* Admin edit/delete */}
                      {isAdminAuthenticated && (
                        <div className="flex space-x-2 pt-3 border-t border-gray-100 mt-3">
                          <button onClick={() => handleEditBusiness(business)}
                            className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors font-medium">
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDeleteBusiness(business)}
                            className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors font-medium">
                            🗑️ Delete
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

        {/* ── PROFILE VIEW ── */}
        {currentView === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">

            {/* PWA Install Card */}
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="text-5xl mb-3">📱</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Install Melanin Market</h2>
              <p className="text-gray-500 text-sm mb-5">
                Add this app to your home screen for quick access to minority-owned businesses in your area.
              </p>
              <button
                onClick={handleInstallApp}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors text-lg flex items-center justify-center gap-2"
              >
                📲 Install App
              </button>
            </div>

            {/* Add Your Business Card */}
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Add Your Business</h2>
              <p className="text-gray-500 text-sm mb-5">
                Join our community of minority-owned businesses and reach more customers.
                We support physical locations, online businesses, and mobile services.
              </p>
              <button
                onClick={() => { setShowPublicSubmitForm(true); setSubmitSuccess(false); }}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors text-lg"
              >
                + List Your Business
              </button>
            </div>

            {/* Contact Us */}
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                  <input type="text" name="from_name" required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" name="from_email" required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                  <input type="text" name="subject" required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                  <textarea name="message" required rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
                </div>
                <button type="submit"
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors font-bold text-lg">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-amber-900 text-amber-100 py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <img src="/logo.PNG" alt="Melanin Market" className="w-8 h-8 rounded-md object-contain bg-white p-0.5"
              onError={(e) => { e.target.style.display='none'; }} />
            <span className="text-xl font-bold text-white">Melanin Market</span>
          </div>
          <p className="text-amber-200 mb-3 text-sm">Supporting and celebrating minority-owned businesses across America</p>
          <div className="text-sm text-amber-300">
            <p>© 2024 Melanin Market. All rights reserved.</p>
            <p className="mt-1">Powered by GitHub • {businesses.length} businesses and growing</p>
          </div>
        </div>
      </footer>

      {/* ── BOTTOM NAVIGATION ── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex justify-around items-center py-2">
          {[
            { view: 'home', icon: '🏠', label: 'Home' },
            { view: 'search', icon: '🔍', label: 'Search' },
            { view: 'favorites', icon: '❤️', label: 'Favorites' },
            { view: 'profile', icon: '👤', label: 'Profile' },
          ].map(({ view, icon, label }) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`flex flex-col items-center py-1 px-4 transition-colors ${
                currentView === view ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs mt-0.5 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
}

export default App;
