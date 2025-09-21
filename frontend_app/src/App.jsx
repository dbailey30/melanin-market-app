import './App.css';
import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

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
  const [githubIntegrationStatus, setGithubIntegrationStatus] = useState('checking');

  // Admin password - This is now only used for frontend validation
  // The real authentication happens on the server side
  const ADMIN_PASSWORD = 'melanin2025admin';

  // EmailJS Configuration - REPLACE WITH YOUR ACTUAL VALUES
  const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_l1mf75l',
    TEMPLATE_ID: 'template_1zwylhd',
    PUBLIC_KEY: 'jv0z8LO2xSTdzuvDz'
  };

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
    { value: 'DC', label: 'District of Columbia' },
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

  // Secure API Functions - These call Vercel API functions instead of GitHub directly
  const checkGitHubIntegration = async () => {
    try {
      const response = await fetch('/api/github-status');
      const data = await response.json();
      setGithubIntegrationStatus(data.status);
      return data.status === 'active';
    } catch (error) {
      console.error('Error checking GitHub integration:', error);
      setGithubIntegrationStatus('error');
      return false;
    }
  };

  const fetchBusinessesFromAPI = async () => {
    try {
      const response = await fetch('/api/businesses');
      const data = await response.json();
      
      if (data.success) {
        return data.businesses;
      } else {
        throw new Error(data.message || 'Failed to fetch businesses');
      }
    } catch (error) {
      console.error('Error fetching businesses from API:', error);
      return null;
    }
  };

  const updateBusinessInAPI = async (action, businessData, businessId = null) => {
    try {
      let url = '/api/businesses';
      let method = 'POST';
      let body = {
        adminAuth: ADMIN_PASSWORD,
        businessData: businessData
      };

      if (action === 'edit') {
        method = 'PUT';
        body.businessId = businessId;
      } else if (action === 'delete') {
        method = 'DELETE';
        body = {
          adminAuth: ADMIN_PASSWORD,
          businessId: businessId
        };
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} business`);
      }

      return data;
    } catch (error) {
      console.error(`Error ${action}ing business:`, error);
      throw error;
    }
  };

  // Google Maps integration
  const createGoogleMapsUrl = (address, businessName) => {
    const query = encodeURIComponent(`${businessName}, ${address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const handleAddressClick = (business) => {
    if (business.businessType === 'physical') {
      const mapsUrl = createGoogleMapsUrl(business.address, business.name);
      window.open(mapsUrl, '_blank');
    }
  };

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  // Check for admin access via URL hash
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setCurrentView('admin');
    }
  }, []);

  // Load businesses and check GitHub integration
  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        // Check GitHub integration status
        const githubActive = await checkGitHubIntegration();
        
        if (githubActive && isAdminAuthenticated) {
          // Try to load from API (GitHub) for admin users
          const apiBusinesses = await fetchBusinessesFromAPI();
          if (apiBusinesses) {
            setBusinesses(apiBusinesses);
            setIsLoading(false);
            return;
          }
        }

        // Fallback to local JSON file
        const response = await fetch('/businesses.json');
        if (response.ok) {
          const data = await response.json();
          setBusinesses(data);
        } else {
          // Fallback to sample data if file doesn't exist
          setBusinesses(getSampleBusinesses());
        }
      } catch (error) {
        console.error('Error loading businesses:', error);
        setBusinesses(getSampleBusinesses());
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinesses();
  }, [isAdminAuthenticated]);

  // Handle logo clicks for admin access
  const handleLogoClick = () => {
    setLogoClickCount(prev => prev + 1);
    if (logoClickCount >= 4) { // 5 clicks total to access admin
      setCurrentView('admin');
      setLogoClickCount(0);
    }
    // Reset counter after 3 seconds if not completed
    setTimeout(() => {
      setLogoClickCount(0);
    }, 3000);
  };

  // Sample businesses fallback with online business support
  const getSampleBusinesses = () => [
    {
      id: 1,
      name: 'Soul Food Kitchen',
      type: 'Restaurant',
      businessType: 'physical',
      owner: 'Black-owned',
      description: 'Authentic soul food restaurant serving the community for over 20 years.',
      rating: '4.5 (127)',
      address: '123 Main St, Buffalo, NY',
      city: 'Buffalo',
      state: 'NY',
      serviceArea: 'Buffalo Metro Area',
      phone: '(716) 555-0123',
      hours: 'Mon-Sat: 11AM-9PM',
      email: 'info@soulfoodkitchen.com',
      website: 'https://soulfoodkitchen.com',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop',
      verified: true,
      dateAdded: '2025-01-01',
      status: 'approved',
      verificationSubmitted: true,
      verificationMethod: 'business-license',
      verificationDetails: 'BL-2024-001234'
    },
    {
      id: 2,
      name: 'Digital Dreams Marketing',
      type: 'Technology',
      businessType: 'online',
      owner: 'Black-owned',
      description: 'Full-service digital marketing agency specializing in social media management and web design.',
      rating: '4.9 (67)',
      address: 'Online Business',
      city: 'Buffalo',
      state: 'NY',
      serviceArea: 'Nationwide',
      phone: '(716) 555-DIGI',
      hours: 'Mon-Fri: 9AM-6PM EST',
      email: 'hello@digitaldreamsmarketing.com',
      website: 'https://digitaldreamsmarketing.com',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
      verified: true,
      dateAdded: '2025-01-02',
      status: 'approved',
      verificationSubmitted: true,
      verificationMethod: 'ein',
      verificationDetails: 'EIN-87-6543210'
    }
  ];

  // Admin authentication
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setAdminPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setEditingBusiness(null);
    setShowAddForm(false);
  };

  // Business management functions with secure API integration
  const handleAddBusiness = async (businessData) => {
    setIsUpdatingGitHub(true);
    
    try {
      const result = await updateBusinessInAPI('add', businessData);
      
      if (githubIntegrationStatus === 'active') {
        alert(`✅ Business "${businessData.name}" added successfully!\n\n🚀 GitHub updated automatically\n⏱️ Changes will be live in 2-3 minutes after Vercel redeploys`);
        
        // Refresh businesses from API
        const updatedBusinesses = await fetchBusinessesFromAPI();
        if (updatedBusinesses) {
          setBusinesses(updatedBusinesses);
        }
      } else {
        alert(`✅ Business "${businessData.name}" added successfully!\n\n⚠️ Note: GitHub integration not active. Changes are temporary until GitHub is configured.`);
        
        // Add locally for immediate feedback
        const newBusiness = {
          ...businessData,
          id: Math.max(...businesses.map(b => b.id), 0) + 1,
          dateAdded: new Date().toISOString().split('T')[0],
          status: 'approved',
          verified: true
        };
        setBusinesses(prev => [...prev, newBusiness]);
      }
      
      setShowAddForm(false);
      
    } catch (error) {
      console.error('Error adding business:', error);
      alert(`❌ Error adding business: ${error.message}\n\nPlease try again or contact support.`);
    } finally {
      setIsUpdatingGitHub(false);
    }
  };

  const handleEditBusiness = async (businessData) => {
    setIsUpdatingGitHub(true);
    
    try {
      const result = await updateBusinessInAPI('edit', businessData, editingBusiness.id);
      
      if (githubIntegrationStatus === 'active') {
        alert(`✅ Business "${businessData.name}" updated successfully!\n\n🚀 GitHub updated automatically\n⏱️ Changes will be live in 2-3 minutes after Vercel redeploys`);
        
        // Refresh businesses from API
        const updatedBusinesses = await fetchBusinessesFromAPI();
        if (updatedBusinesses) {
          setBusinesses(updatedBusinesses);
        }
      } else {
        alert(`✅ Business "${businessData.name}" updated successfully!\n\n⚠️ Note: GitHub integration not active. Changes are temporary until GitHub is configured.`);
        
        // Update locally for immediate feedback
        setBusinesses(prev => prev.map(b => 
          b.id === editingBusiness.id ? { ...businessData, id: editingBusiness.id } : b
        ));
      }
      
      setEditingBusiness(null);
      
    } catch (error) {
      console.error('Error editing business:', error);
      alert(`❌ Error updating business: ${error.message}\n\nPlease try again or contact support.`);
    } finally {
      setIsUpdatingGitHub(false);
    }
  };

  const handleDeleteBusiness = async (businessId) => {
    const businessToDelete = businesses.find(b => b.id === businessId);
    if (!businessToDelete) return;
    
    if (window.confirm(`Are you sure you want to delete "${businessToDelete.name}"?\n\nThis action cannot be undone.`)) {
      setIsUpdatingGitHub(true);
      
      try {
        const result = await updateBusinessInAPI('delete', null, businessId);
        
        if (githubIntegrationStatus === 'active') {
          alert(`✅ Business "${businessToDelete.name}" deleted successfully!\n\n🚀 GitHub updated automatically\n⏱️ Changes will be live in 2-3 minutes after Vercel redeploys`);
          
          // Refresh businesses from API
          const updatedBusinesses = await fetchBusinessesFromAPI();
          if (updatedBusinesses) {
            setBusinesses(updatedBusinesses);
          }
        } else {
          alert(`✅ Business "${businessToDelete.name}" deleted successfully!\n\n⚠️ Note: GitHub integration not active. Changes are temporary until GitHub is configured.`);
          
          // Remove locally for immediate feedback
          setBusinesses(prev => prev.filter(b => b.id !== businessId));
        }
        
      } catch (error) {
        console.error('Error deleting business:', error);
        alert(`❌ Error deleting business: ${error.message}\n\nPlease try again or contact support.`);
      } finally {
        setIsUpdatingGitHub(false);
      }
    }
  };

  // Handle business form submission with EmailJS
  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target);
      const verificationMethod = formData.get('verificationMethod');
      const verificationDetails = formData.get('verificationDetails');
      const locationType = formData.get('businessLocationType');
      
      const businessData = {
        business_name: formData.get('businessName'),
        business_category: formData.get('businessCategory'),
        business_location_type: locationType,
        owner_ethnicity: formData.get('ownerEthnicity'),
        business_description: formData.get('businessDescription'),
        business_address: formData.get('businessAddress'),
        business_city: formData.get('businessCity'),
        business_state: formData.get('businessState'),
        service_area: formData.get('serviceArea') || (locationType === 'online' ? 'Nationwide' : 'Local Area'),
        business_phone: formData.get('businessPhone'),
        business_email: formData.get('businessEmail'),
        business_website: formData.get('businessWebsite') || 'Not provided',
        business_hours: formData.get('businessHours') || 'Not provided',
        verification_method: verificationMethod || 'Not provided',
        verification_details: verificationDetails || 'Not provided',
        verification_submitted: !!(verificationMethod && verificationDetails),
        submission_date: new Date().toLocaleDateString(),
        submission_time: new Date().toLocaleTimeString(),
        to_email: 'admin@melanin-market.com'
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        businessData,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      console.log('Email sent successfully:', result);
      
      // Show success message
      alert('🎉 Thank you for submitting your business!\n\n' +
            '✅ Your submission has been received\n' +
            '📧 You will receive a confirmation email shortly\n' +
            '⏳ Our team will review your business within 24-48 hours\n\n' +
            'We appreciate your contribution to the Melanin Market community!');
      
      // Reset form
      e.target.reset();
      setBusinessLocationType('physical');
      setCurrentView('landing');
      
    } catch (error) {
      console.error('Error sending email:', error);
      alert('❌ There was an error submitting your business. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle favorites
  const toggleFavorite = (businessId) => {
    setFavorites(prev => 
      prev.includes(businessId) 
        ? prev.filter(id => id !== businessId)
        : [...prev, businessId]
    );
  };

  // Filter businesses based on search and category
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchInput.toLowerCase()) ||
                         business.city.toLowerCase().includes(searchInput.toLowerCase()) ||
                         business.state.toLowerCase().includes(searchInput.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || business.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['All', ...new Set(businesses.map(business => business.type))];

  // Render GitHub Integration Status (for admin)
  const renderGitHubStatus = () => {
    if (!isAdminAuthenticated) return null;

    const statusConfig = {
      'checking': { color: 'text-yellow-600', icon: '🔄', message: 'Checking GitHub integration...' },
      'active': { color: 'text-green-600', icon: '✅', message: 'GitHub integration active' },
      'disabled': { color: 'text-gray-600', icon: '⚠️', message: 'GitHub integration not configured' },
      'error': { color: 'text-red-600', icon: '❌', message: 'GitHub integration error' }
    };

    const status = statusConfig[githubIntegrationStatus] || statusConfig['error'];

    return (
      <div className={`mb-4 p-3 rounded-lg border ${status.color} bg-gray-50`}>
        <div className="flex items-center gap-2">
          <span>{status.icon}</span>
          <span className="font-medium">{status.message}</span>
        </div>
        {githubIntegrationStatus === 'disabled' && (
          <p className="text-sm mt-1 text-gray-600">
            Configure GITHUB_TOKEN in Vercel environment variables to enable automatic updates.
          </p>
        )}
      </div>
    );
  };

  // Business Form Component
  const BusinessForm = ({ business, onSubmit, onCancel }) => {
    const [formBusinessType, setFormBusinessType] = useState(business?.businessType || 'physical');

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      const businessData = {
        name: formData.get('name'),
        type: formData.get('type'),
        businessType: formBusinessType,
        owner: formData.get('owner'),
        description: formData.get('description'),
        address: formBusinessType === 'physical' ? formData.get('address') : 'Online Business',
        city: formData.get('city'),
        state: formData.get('state'),
        serviceArea: formData.get('serviceArea'),
        phone: formData.get('phone'),
        hours: formData.get('hours'),
        email: formData.get('email'),
        website: formData.get('website'),
        image: formData.get('image'),
        verificationMethod: formData.get('verificationMethod'),
        verificationDetails: formData.get('verificationDetails'),
        verificationSubmitted: !!(formData.get('verificationMethod') && formData.get('verificationDetails'))
      };
      
      onSubmit(businessData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {business ? 'Edit Business' : 'Add New Business'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Business Name *</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={business?.name || ''}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  name="type"
                  defaultValue={business?.type || ''}
                  required
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Category</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Retail">Retail</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Beauty">Beauty & Wellness</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Education">Education</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Business Type *</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="businessType"
                    value="physical"
                    checked={formBusinessType === 'physical'}
                    onChange={(e) => setFormBusinessType(e.target.value)}
                    className="mr-2"
                  />
                  Physical Location
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="businessType"
                    value="online"
                    checked={formBusinessType === 'online'}
                    onChange={(e) => setFormBusinessType(e.target.value)}
                    className="mr-2"
                  />
                  Online/Digital Business
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Owner Ethnicity *</label>
              <select
                name="owner"
                defaultValue={business?.owner || ''}
                required
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Owner Ethnicity</option>
                <option value="Black-owned">Black-owned</option>
                <option value="Latino-owned">Latino-owned</option>
                <option value="Asian-owned">Asian-owned</option>
                <option value="Native American-owned">Native American-owned</option>
                <option value="Multi-ethnic">Multi-ethnic</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                name="description"
                defaultValue={business?.description || ''}
                required
                rows="3"
                className="w-full p-2 border rounded-lg"
                placeholder="Describe your business, services, and what makes it special..."
              />
            </div>

            {formBusinessType === 'physical' && (
              <div>
                <label className="block text-sm font-medium mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  defaultValue={business?.address || ''}
                  required={formBusinessType === 'physical'}
                  className="w-full p-2 border rounded-lg"
                  placeholder="123 Main St, City, State"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  defaultValue={business?.city || ''}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">State *</label>
                <select
                  name="state"
                  defaultValue={business?.state || ''}
                  required
                  className="w-full p-2 border rounded-lg"
                >
                  {US_STATES.map(state => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Service Area</label>
              <input
                type="text"
                name="serviceArea"
                defaultValue={business?.serviceArea || ''}
                className="w-full p-2 border rounded-lg"
                placeholder={formBusinessType === 'online' ? 'Nationwide' : 'Local Area, Metro Area, etc.'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={business?.phone || ''}
                  className="w-full p-2 border rounded-lg"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Hours</label>
                <input
                  type="text"
                  name="hours"
                  defaultValue={business?.hours || ''}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Mon-Fri: 9AM-5PM"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={business?.email || ''}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input
                  type="url"
                  name="website"
                  defaultValue={business?.website || ''}
                  className="w-full p-2 border rounded-lg"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                name="image"
                defaultValue={business?.image || ''}
                className="w-full p-2 border rounded-lg"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Business Verification (Optional)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Verification Method</label>
                  <select
                    name="verificationMethod"
                    defaultValue={business?.verificationMethod || ''}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Method</option>
                    <option value="business-license">Business License</option>
                    <option value="ein">EIN (Tax ID)</option>
                    <option value="website">Official Website</option>
                    <option value="social-media">Social Media Verification</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Verification Details</label>
                  <input
                    type="text"
                    name="verificationDetails"
                    defaultValue={business?.verificationDetails || ''}
                    className="w-full p-2 border rounded-lg"
                    placeholder="License #, EIN, URL, etc."
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={isUpdatingGitHub}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {isUpdatingGitHub ? 'Saving...' : (business ? 'Update Business' : 'Add Business')}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
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
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={handleLogoClick}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">M</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Melanin Market</h1>
            </div>
            <nav className="flex gap-6">
              <button 
                onClick={() => setCurrentView('directory')}
                className="text-white hover:text-yellow-400 transition-colors"
              >
                Browse Businesses
              </button>
              <button 
                onClick={() => setCurrentView('submit')}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
              >
                Add Your Business
              </button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Discover & Support
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Minority-Owned Businesses
            </span>
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Connect with authentic businesses owned by Black, Latino, Asian, Native American, and other minority entrepreneurs in your community and beyond.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => setCurrentView('directory')}
              className="bg-white text-purple-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Explore Directory
            </button>
            <button 
              onClick={() => setCurrentView('submit')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-900 transition-colors"
            >
              List Your Business
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-bold text-white mb-2">Discover Local Gems</h3>
              <p className="text-purple-100">Find amazing minority-owned businesses in your area and across the nation.</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-white mb-2">Verified Businesses</h3>
              <p className="text-purple-100">All businesses are verified to ensure authentic minority ownership.</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-white mb-2">Support Community</h3>
              <p className="text-purple-100">Every purchase helps strengthen minority-owned businesses and communities.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Business Directory
  if (currentView === 'directory') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setCurrentView('landing')}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">M</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Melanin Market</h1>
            </div>
            <nav className="flex gap-6">
              <button 
                onClick={() => setCurrentView('landing')}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentView('submit')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Add Your Business
              </button>
            </nav>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search businesses, locations, or services..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Business Grid */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading businesses...</p>
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No businesses found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchInput('');
                  setSelectedCategory('All');
                }}
                className="mt-4 text-purple-600 hover:text-purple-700"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map(business => (
                <div key={business.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={business.image} 
                      alt={business.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop';
                      }}
                    />
                    <button
                      onClick={() => toggleFavorite(business.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full ${
                        favorites.includes(business.id) 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white text-gray-600'
                      } hover:scale-110 transition-transform`}
                    >
                      ❤️
                    </button>
                    {business.verified && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        ✓ Verified
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{business.name}</h3>
                      <span className="text-sm text-purple-600 font-medium">{business.owner}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                        {business.type}
                      </span>
                      {business.businessType === 'online' && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          Online
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{business.description}</p>
                    
                    <div className="space-y-1 text-sm text-gray-500">
                      {business.businessType === 'physical' ? (
                        <div 
                          className="flex items-center gap-1 cursor-pointer hover:text-purple-600"
                          onClick={() => handleAddressClick(business)}
                        >
                          <span>📍</span>
                          <span>{business.address}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span>🌐</span>
                          <span>Service Area: {business.serviceArea}</span>
                        </div>
                      )}
                      
                      {business.phone && (
                        <div className="flex items-center gap-1">
                          <span>📞</span>
                          <a href={`tel:${business.phone}`} className="hover:text-purple-600">
                            {business.phone}
                          </a>
                        </div>
                      )}
                      
                      {business.website && (
                        <div className="flex items-center gap-1">
                          <span>🌐</span>
                          <a 
                            href={business.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-purple-600 truncate"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                      
                      {business.hours && (
                        <div className="flex items-center gap-1">
                          <span>🕒</span>
                          <span>{business.hours}</span>
                        </div>
                      )}
                    </div>
                    
                    {business.rating && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-medium">{business.rating}</span>
                        </div>
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

  // Business Submission Form
  if (currentView === 'submit') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setCurrentView('landing')}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">M</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Melanin Market</h1>
            </div>
            <nav className="flex gap-6">
              <button 
                onClick={() => setCurrentView('landing')}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentView('directory')}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Browse Businesses
              </button>
            </nav>
          </div>
        </header>

        {/* Form */}
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Add Your Business</h2>
            <p className="text-gray-600 mb-8">
              Join our community of minority-owned businesses and reach customers who value diversity and authentic entrepreneurship.
            </p>

            <form onSubmit={handleBusinessSubmit} className="space-y-6">
              {/* Business Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="businessLocationType"
                      value="physical"
                      checked={businessLocationType === 'physical'}
                      onChange={(e) => setBusinessLocationType(e.target.value)}
                      className="mr-2"
                      required
                    />
                    Physical Location (Store, Restaurant, Office, etc.)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="businessLocationType"
                      value="online"
                      checked={businessLocationType === 'online'}
                      onChange={(e) => setBusinessLocationType(e.target.value)}
                      className="mr-2"
                      required
                    />
                    Online/Digital Business
                  </label>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your Business Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Category *
                  </label>
                  <select
                    name="businessCategory"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Restaurant">Restaurant & Food</option>
                    <option value="Retail">Retail & Shopping</option>
                    <option value="Technology">Technology & Software</option>
                    <option value="Healthcare">Healthcare & Medical</option>
                    <option value="Beauty">Beauty & Wellness</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Entertainment">Entertainment & Events</option>
                    <option value="Education">Education & Training</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Ethnicity *
                </label>
                <select
                  name="ownerEthnicity"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Owner Ethnicity</option>
                  <option value="Black-owned">Black-owned</option>
                  <option value="Latino-owned">Latino/Hispanic-owned</option>
                  <option value="Asian-owned">Asian-owned</option>
                  <option value="Native American-owned">Native American-owned</option>
                  <option value="Multi-ethnic">Multi-ethnic</option>
                  <option value="Other">Other Minority-owned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description *
                </label>
                <textarea
                  name="businessDescription"
                  required
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe your business, services, and what makes it special..."
                />
              </div>

              {/* Location Information */}
              {businessLocationType === 'physical' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address *
                  </label>
                  <input
                    type="text"
                    name="businessAddress"
                    required={businessLocationType === 'physical'}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="123 Main Street, Suite 100"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="businessCity"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    name="businessState"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {US_STATES.map(state => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {businessLocationType === 'online' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Area
                  </label>
                  <input
                    type="text"
                    name="serviceArea"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Nationwide, Regional, Specific States"
                  />
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="businessPhone"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="businessEmail"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="contact@yourbusiness.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="businessWebsite"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://yourbusiness.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Hours
                  </label>
                  <input
                    type="text"
                    name="businessHours"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Mon-Fri: 9AM-5PM"
                  />
                </div>
              </div>

              {/* Verification Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Business Verification (Optional but Recommended)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Providing verification helps build trust with customers and may qualify your business for a verified badge.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Method
                    </label>
                    <select
                      name="verificationMethod"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Method (Optional)</option>
                      <option value="business-license">Business License</option>
                      <option value="ein">EIN (Employer Identification Number)</option>
                      <option value="website">Official Website</option>
                      <option value="social-media">Social Media Verification</option>
                      <option value="other">Other Documentation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Details
                    </label>
                    <input
                      type="text"
                      name="verificationDetails"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="License number, EIN, URL, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Business for Review'}
                </button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Your business will be reviewed within 24-48 hours before being added to the directory.
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // Admin Panel
  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Admin Access</h2>
            <form onSubmit={handleAdminLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Login
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setCurrentView('landing')}
                className="text-gray-600 hover:text-purple-600"
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
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">M</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView('landing')}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                View Site
              </button>
              <button
                onClick={handleAdminLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {renderGitHubStatus()}
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Businesses</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add New Business
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading businesses...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {businesses.map(business => (
                    <tr key={business.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={business.image} 
                            alt={business.name}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop';
                            }}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{business.name}</div>
                            <div className="text-sm text-gray-500">{business.owner}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          {business.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {business.businessType === 'physical' ? `${business.city}, ${business.state}` : 'Online'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {business.verified && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Verified
                            </span>
                          )}
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {business.status || 'Active'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingBusiness(business)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBusiness(business.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={isUpdatingGitHub}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* Add/Edit Business Modal */}
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
      </div>
    );
  }

  return null;
}

export default App;
