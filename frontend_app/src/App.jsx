import React, { useState, useEffect } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [searchInput, setSearchInput] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Handle PWA installation
  const handleInstallApp = () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        window.deferredPrompt = null;
      });
    } else {
      alert('To install this app:\n\n• On Chrome/Edge: Look for the install icon in the address bar\n• On Safari: Tap Share → Add to Home Screen\n• On Firefox: Look for the install option in the menu');
    }
  };

  // Handle business form submission
  const handleBusinessSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for submitting your business! We will review your application and contact you within 2-3 business days.');
    setCurrentView('profile');
  };

  // Navigation functions
  const navigateToView = (view) => {
    setCurrentView(view);
  };

  const handleSearch = () => {
    setCurrentView('businesses');
  };

  const toggleFavorite = (businessId) => {
    setFavorites(prev => 
      prev.includes(businessId) 
        ? prev.filter(id => id !== businessId)
        : [...prev, businessId]
    );
  };

  // Business data
  const businesses = [
    {
      id: 1,
      name: 'Soul Food Kitchen',
      type: 'Restaurant',
      owner: 'Black-owned',
      description: 'Authentic soul food restaurant serving the community for over 20 years. Family recipes passed down through generations.',
      rating: '4.5 (127)',
      address: '123 Main St, Buffalo, NY',
      phone: '(716) 555-0123',
      hours: 'Mon-Sat: 11AM-9PM, Sun: 12PM-8PM',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop',
      verified: true,
    },
    {
      id: 2,
      name: 'Tech Solutions Plus',
      type: 'Technology',
      owner: 'Asian-owned',
      description: 'Full-service IT consulting and software development company specializing in small business solutions.',
      rating: '4.8 (89)',
      address: '456 Tech Ave, Buffalo, NY',
      phone: '(716) 555-0456',
      hours: 'Mon-Fri: 9AM-6PM',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop',
      verified: true,
    },
    {
      id: 3,
      name: "Abuela's Market",
      type: 'Grocery',
      owner: 'Hispanic-owned',
      description: 'Family-owned grocery store with authentic Hispanic foods, fresh produce, and traditional ingredients.',
      rating: '4.6 (203)',
      address: '789 Market St, Rochester, NY',
      phone: '(585) 555-0789',
      hours: 'Daily: 8AM-10PM',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop',
      verified: true,
    },
    {
      id: 4,
      name: 'Harmony Hair Salon',
      type: 'Beauty',
      owner: 'Black-owned',
      description: 'Professional hair care and styling for all hair types and textures. Specializing in natural hair care.',
      rating: '4.9 (156)',
      address: '321 Style Ave, Syracuse, NY',
      phone: '(315) 555-0321',
      hours: 'Tue-Sat: 9AM-7PM',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=200&fit=crop',
      verified: true,
    },
    {
      id: 5,
      name: 'Artisan Coffee Roasters',
      type: 'Coffee',
      owner: 'Latino-owned',
      description: 'Small-batch coffee roasters committed to fair trade and supporting coffee farmers worldwide.',
      rating: '4.7 (92)',
      address: '654 Bean St, Buffalo, NY',
      phone: '(716) 555-0654',
      hours: 'Mon-Fri: 6AM-6PM, Sat-Sun: 7AM-5PM',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=200&fit=crop',
      verified: true,
    },
    {
      id: 6,
      name: 'Native Wellness Center',
      type: 'Health',
      owner: 'Native American-owned',
      description: 'Holistic wellness center offering traditional healing practices and modern wellness services.',
      rating: '4.8 (74)',
      address: '987 Healing Way, Syracuse, NY',
      phone: '(315) 555-0987',
      hours: 'Mon-Fri: 8AM-8PM, Sat: 9AM-5PM',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
      verified: true,
    },
  ];

  const filteredBusinesses = businesses.filter(business => {
    const matchesCategory = selectedCategory === 'All' || business.type === selectedCategory;
    return matchesCategory;
  });

  const favoriteBusinesses = businesses.filter(business => favorites.includes(business.id));

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef7ed 0%, #fef3c7 100%)',
      fontFamily: 'Arial, sans-serif',
      paddingBottom: '80px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.1)',
    },
    logo: {
      width: '40px',
      height: '40px',
      marginRight: '10px',
      borderRadius: '8px',
      objectFit: 'contain',
      background: 'white',
      padding: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1f2937',
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '4px',
    },
    content: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    searchSection: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    searchTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '16px',
    },
    searchDescription: {
      fontSize: '16px',
      color: '#6b7280',
      marginBottom: '24px',
      lineHeight: '1.5',
    },
    searchInput: {
      width: '100%',
      maxWidth: '400px',
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #d1d5db',
      borderRadius: '8px',
      marginBottom: '16px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    button: {
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      margin: '8px',
      transition: 'all 0.2s',
    },
    primaryButton: {
      background: '#ea580c',
      color: 'white',
      width: '100%',
      maxWidth: '400px',
    },
    secondaryButton: {
      background: 'transparent',
      color: '#ea580c',
      border: '2px solid #ea580c',
      width: '100%',
      maxWidth: '400px',
    },
    cityButton: {
      background: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
      padding: '8px 16px',
      margin: '4px',
      fontSize: '14px',
    },
    bottomNav: {
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      background: 'white',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0',
      zIndex: 1000,
    },
    navButton: {
      background: 'none',
      border: 'none',
      fontSize: '12px',
      color: '#6b7280',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '4px',
    },
    activeNavButton: {
      color: '#ea580c',
    },
    businessCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'relative',
    },
    businessImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '12px',
    },
    businessName: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '4px',
    },
    businessType: {
      fontSize: '12px',
      background: '#fef3c7',
      color: '#92400e',
      padding: '4px 8px',
      borderRadius: '4px',
      display: 'inline-block',
      marginBottom: '8px',
    },
    businessDescription: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '12px',
      lineHeight: '1.4',
    },
    businessInfo: {
      fontSize: '14px',
      color: '#374151',
      marginBottom: '4px',
    },
    rating: {
      color: '#fbbf24',
      marginBottom: '12px',
    },
    backButton: {
      background: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      cursor: 'pointer',
      margin: '16px',
    },
    featureCard: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    featureIcon: {
      fontSize: '32px',
      marginBottom: '12px',
    },
    featureTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px',
    },
    featureDescription: {
      fontSize: '14px',
      color: '#6b7280',
      lineHeight: '1.4',
    },
    formContainer: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      margin: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    formTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '16px',
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#374151',
      marginBottom: '4px',
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '2px solid #d1d5db',
      borderRadius: '8px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '2px solid #d1d5db',
      borderRadius: '8px',
      outline: 'none',
      minHeight: '100px',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '2px solid #d1d5db',
      borderRadius: '8px',
      outline: 'none',
      background: 'white',
      boxSizing: 'border-box',
    },
  };

  // PWA install prompt handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Landing Page
  const renderLandingPage = () => (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="/logo.PNG" alt="Melanin Market" style={styles.logo} onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='block';}} />
<div style={{...styles.logo, display: 'none'}}>🛍️</div>
        <div>
          <div style={styles.title}>MELANIN MARKET</div>
          <div style={styles.subtitle}>Discover • Support • Thrive</div>
        </div>
      </div>
      
      <div style={styles.content}>
        <div style={styles.searchSection}>
          <h1 style={styles.searchTitle}>Discover Minority-Owned Businesses</h1>
          <p style={styles.searchDescription}>
            Support local entrepreneurs and build stronger communities together. Find authentic businesses owned by Black, Hispanic, Asian, Native American, and other minority entrepreneurs.
          </p>
          
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Enter City, State (e.g., Buffalo, NY)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          
          <div style={{ marginBottom: '16px' }}>
            <button style={{...styles.button, ...styles.primaryButton}} onClick={handleSearch}>
              🔍 Find Businesses
            </button>
          </div>
          
          <div>
            <button style={{...styles.button, ...styles.secondaryButton}} onClick={() => navigateToView('profile')}>
              ➕ List Your Business
            </button>
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '12px' }}>Popular Cities:</p>
            <button style={{...styles.button, ...styles.cityButton}} onClick={handleSearch}>
              Buffalo, NY
            </button>
            <button style={{...styles.button, ...styles.cityButton}} onClick={handleSearch}>
              Rochester, NY
            </button>
            <button style={{...styles.button, ...styles.cityButton}} onClick={handleSearch}>
              Syracuse, NY
            </button>
          </div>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🔍</div>
          <h3 style={styles.featureTitle}>Discover Local</h3>
          <p style={styles.featureDescription}>
            Find authentic minority-owned businesses in your community, from restaurants and cafes to tech companies and wellness centers.
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>💝</div>
          <h3 style={styles.featureTitle}>Support & Save</h3>
          <p style={styles.featureDescription}>
            Save your favorite businesses and support entrepreneurs who are building stronger, more diverse communities.
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🌟</div>
          <h3 style={styles.featureTitle}>Build Community</h3>
          <p style={styles.featureDescription}>
            Connect with business owners, leave reviews, and help create a thriving ecosystem of minority-owned enterprises.
          </p>
        </div>
      </div>
    </div>
  );

  // Business Listings
  const renderBusinessListings = () => (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigateToView('landing')}>
        ← Back
      </button>
      
      <div style={styles.content}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
          All Businesses
        </h1>
        
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button 
            style={{...styles.button, ...styles.cityButton, ...(selectedCategory === 'All' ? {background: '#ea580c', color: 'white'} : {})}}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          <button 
            style={{...styles.button, ...styles.cityButton, ...(selectedCategory === 'Restaurant' ? {background: '#ea580c', color: 'white'} : {})}}
            onClick={() => setSelectedCategory('Restaurant')}
          >
            Restaurant
          </button>
          <button 
            style={{...styles.button, ...styles.cityButton, ...(selectedCategory === 'Technology' ? {background: '#ea580c', color: 'white'} : {})}}
            onClick={() => setSelectedCategory('Technology')}
          >
            Technology
          </button>
          <button 
            style={{...styles.button, ...styles.cityButton, ...(selectedCategory === 'Beauty' ? {background: '#ea580c', color: 'white'} : {})}}
            onClick={() => setSelectedCategory('Beauty')}
          >
            Beauty
          </button>
          <button 
            style={{...styles.button, ...styles.cityButton, ...(selectedCategory === 'Grocery' ? {background: '#ea580c', color: 'white'} : {})}}
            onClick={() => setSelectedCategory('Grocery')}
          >
            Grocery
          </button>
          <button 
            style={{...styles.button, ...styles.cityButton, ...(selectedCategory === 'Coffee' ? {background: '#ea580c', color: 'white'} : {})}}
            onClick={() => setSelectedCategory('Coffee')}
          >
            Coffee
          </button>
          <button 
            style={{...styles.button, ...styles.cityButton, ...(selectedCategory === 'Health' ? {background: '#ea580c', color: 'white'} : {})}}
            onClick={() => setSelectedCategory('Health')}
          >
            Health
          </button>
        </div>
        
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
          {filteredBusinesses.length} businesses found
        </p>
        
        {filteredBusinesses.map((business) => (
          <div key={business.id} style={styles.businessCard}>
            <div style={{ position: 'relative' }}>
              <img src={business.image} alt={business.name} style={styles.businessImage} />
              <button 
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  color: favorites.includes(business.id) ? '#ef4444' : '#d1d5db',
                }}
                onClick={() => toggleFavorite(business.id)}
              >
                ♥
              </button>
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: '#fbbf24',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
              }}>
                {business.type}
              </div>
            </div>
            
            <h3 style={styles.businessName}>{business.name}</h3>
            <div style={styles.businessType}>{business.owner}</div>
            <p style={styles.businessDescription}>{business.description}</p>
            
            <div style={styles.rating}>
              ⭐⭐⭐⭐⭐ {business.rating} {business.verified && '✓ Verified'}
            </div>
            
            <div style={styles.businessInfo}>📍 {business.address}</div>
            <div style={styles.businessInfo}>📞 {business.phone}</div>
            <div style={styles.businessInfo}>🕒 {business.hours}</div>
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button style={{...styles.button, ...styles.primaryButton, flex: 1}}>
                View Details
              </button>
              <button style={{...styles.button, ...styles.secondaryButton, flex: 1}}>
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Add Business Form
  const renderAddBusiness = () => (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigateToView('profile')}>
        ← Back
      </button>
      
      <div style={styles.formContainer}>
        <h1 style={styles.formTitle}>Add Your Business</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '24px' }}>
          Get your minority-owned business featured on Melanin Market and connect with customers who want to support you.
        </p>
        
        <form onSubmit={handleBusinessSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Business Name *</label>
            <input style={styles.input} type="text" placeholder="Enter your business name" required />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Business Category *</label>
            <select style={styles.select} required>
              <option value="">Select a category</option>
              <option value="restaurant">Restaurant</option>
              <option value="technology">Technology</option>
              <option value="beauty">Beauty & Personal Care</option>
              <option value="grocery">Grocery & Food</option>
              <option value="coffee">Coffee & Beverages</option>
              <option value="health">Health & Wellness</option>
              <option value="retail">Retail & Shopping</option>
              <option value="services">Professional Services</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Owner Ethnicity *</label>
            <select style={styles.select} required>
              <option value="">Select owner ethnicity</option>
              <option value="black">Black-owned</option>
              <option value="hispanic">Hispanic-owned</option>
              <option value="asian">Asian-owned</option>
              <option value="native">Native American-owned</option>
              <option value="latino">Latino-owned</option>
              <option value="other">Other minority-owned</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Business Description *</label>
            <textarea style={styles.textarea} placeholder="Describe your business, what makes it special, and what you offer..." required></textarea>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Address *</label>
            <input style={styles.input} type="text" placeholder="Street address" required />
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{...styles.formGroup, flex: 1}}>
              <label style={styles.label}>City *</label>
              <input style={styles.input} type="text" placeholder="City" required />
            </div>
            <div style={{...styles.formGroup, flex: 1}}>
              <label style={styles.label}>State *</label>
              <input style={styles.input} type="text" placeholder="State" required />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number *</label>
            <input style={styles.input} type="tel" placeholder="(555) 123-4567" required />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Website</label>
            <input style={styles.input} type="url" placeholder="https://yourbusiness.com" />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input style={styles.input} type="email" placeholder="contact@yourbusiness.com" required />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Business Hours</label>
            <textarea style={styles.textarea} placeholder="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed"></textarea>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Business Verification</label>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              To verify your business ownership, please provide one of the following:
            </p>
            <select style={styles.select}>
              <option value="">Select verification method</option>
              <option value="business-license">Business License Number</option>
              <option value="ein">Employer Identification Number (EIN)</option>
              <option value="dba">DBA (Doing Business As) Certificate</option>
              <option value="other">Other official documentation</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Verification Details</label>
            <input style={styles.input} type="text" placeholder="Enter license number, EIN, or other verification info" />
          </div>
          
          <button style={{...styles.button, ...styles.primaryButton, width: '100%', marginTop: '20px'}} type="submit">
            Submit Business for Review
          </button>
          
          <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '16px' }}>
            Your business will be reviewed within 2-3 business days. We'll contact you at the provided email address with updates.
          </p>
        </form>
      </div>
    </div>
  );

  // Favorites Page
  const renderFavorites = () => (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigateToView('landing')}>
        ← Back
      </button>
      
      <div style={styles.content}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
          My Favorites
        </h1>
        
        {favoriteBusinesses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💝</div>
            <h2 style={{ fontSize: '20px', color: '#1f2937', marginBottom: '8px' }}>No favorites yet</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Start exploring businesses and add them to your favorites!
            </p>
            <button style={{...styles.button, ...styles.primaryButton}} onClick={() => navigateToView('businesses')}>
              Discover Businesses
            </button>
          </div>
        ) : (
          favoriteBusinesses.map((business) => (
            <div key={business.id} style={styles.businessCard}>
              <div style={{ position: 'relative' }}>
                <img src={business.image} alt={business.name} style={styles.businessImage} />
                <button 
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    color: '#ef4444',
                  }}
                  onClick={() => toggleFavorite(business.id)}
                >
                  ♥
                </button>
              </div>
              
              <h3 style={styles.businessName}>{business.name}</h3>
              <div style={styles.businessType}>{business.owner}</div>
              <p style={styles.businessDescription}>{business.description}</p>
              
              <div style={styles.rating}>
                ⭐⭐⭐⭐⭐ {business.rating} {business.verified && '✓ Verified'}
              </div>
              
              <div style={styles.businessInfo}>📍 {business.address}</div>
              <div style={styles.businessInfo}>📞 {business.phone}</div>
              <div style={styles.businessInfo}>🕒 {business.hours}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Profile Page
  const renderProfile = () => (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigateToView('landing')}>
        ← Back
      </button>
      
      <div style={styles.content}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#ea580c',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '32px',
            color: 'white',
          }}>
            👤
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            Welcome to Melanin Market
          </h1>
          <p style={{ color: '#6b7280' }}>
            Discover and support minority-owned businesses in your community
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>🏪</span>
            <h3 style={styles.featureTitle}>List Your Business</h3>
          </div>
          <p style={styles.featureDescription}>
            Are you a minority business owner? Get your business featured on Melanin Market and connect with customers who want to support you.
          </p>
          <button style={{...styles.button, ...styles.primaryButton, marginTop: '12px'}} onClick={() => navigateToView('addBusiness')}>
            Add Your Business
          </button>
        </div>

        <div style={styles.featureCard}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>📱</span>
            <h3 style={styles.featureTitle}>Get the App</h3>
          </div>
          <p style={styles.featureDescription}>
            Install Melanin Market on your phone for quick access to local minority-owned businesses wherever you go.
          </p>
          <button style={{...styles.button, ...styles.secondaryButton, marginTop: '12px'}} onClick={handleInstallApp}>
            Install App
          </button>
        </div>

        <div style={styles.featureCard}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>💬</span>
            <h3 style={styles.featureTitle}>Share Feedback</h3>
          </div>
          <p style={styles.featureDescription}>
            Help us improve Melanin Market by sharing your thoughts and suggestions.
          </p>
          <button style={{...styles.button, ...styles.secondaryButton, marginTop: '12px'}} onClick={() => alert('Thank you for your interest in providing feedback! Please email us at feedback@melanin-market.com')}>
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  );

  // Bottom Navigation
  const renderBottomNav = () => (
    <div style={styles.bottomNav}>
      <button 
        style={{...styles.navButton, ...(currentView === 'landing' ? styles.activeNavButton : {})}}
        onClick={() => navigateToView('landing')}
      >
        <span style={{ fontSize: '20px', marginBottom: '2px' }}>🏠</span>
        <span>Home</span>
      </button>
      <button 
        style={{...styles.navButton, ...(currentView === 'favorites' ? styles.activeNavButton : {})}}
        onClick={() => navigateToView('favorites')}
      >
        <span style={{ fontSize: '20px', marginBottom: '2px' }}>♥</span>
        <span>Favorites</span>
      </button>
      <button 
        style={{...styles.navButton, ...(currentView === 'businesses' ? styles.activeNavButton : {})}}
        onClick={() => navigateToView('businesses')}
      >
        <span style={{ fontSize: '20px', marginBottom: '2px' }}>🔍</span>
        <span>Search</span>
      </button>
      <button 
        style={{...styles.navButton, ...(currentView === 'profile' ? styles.activeNavButton : {})}}
        onClick={() => navigateToView('profile')}
      >
        <span style={{ fontSize: '20px', marginBottom: '2px' }}>👤</span>
        <span>Profile</span>
      </button>
    </div>
  );

  // Main render
  return (
    <div>
      {currentView === 'landing' && renderLandingPage()}
      {currentView === 'businesses' && renderBusinessListings()}
      {currentView === 'addBusiness' && renderAddBusiness()}
      {currentView === 'favorites' && renderFavorites()}
      {currentView === 'profile' && renderProfile()}
      {renderBottomNav()}
    </div>
  );
}

export default App;

