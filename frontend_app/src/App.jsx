import React, { useState, useEffect } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [searchInput, setSearchInput] = useState('');
  const [favorites, setFavorites] = useState([]);

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
      description: 'Authentic soul food restaurant serving the community for over 20 years.',
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
      description: 'Full-service IT consulting and software development company.',
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
      description: 'Family-owned grocery store with authentic Hispanic foods.',
      rating: '4.6 (203)',
      address: '789 Market St, Rochester, NY',
      phone: '(585) 555-0789',
      hours: 'Daily: 8AM-10PM',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop',
      verified: true,
    },
  ];

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
      fontSize: '24px',
      background: '#ea580c',
      padding: '8px',
      borderRadius: '8px',
      color: 'white',
      marginRight: '15px',
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
    },
    input: {
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
  };

  // Landing Page
  const renderLandingPage = () => (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>🛍️</div>
        <div>
          <div style={styles.title}>MELANIN MARKET</div>
          <div style={styles.subtitle}>Discover • Support • Thrive</div>
        </div>
      </div>
      
      <div style={styles.content}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
            Discover Minority-Owned Businesses
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
            Support local entrepreneurs and build stronger communities together.
          </p>
          
          <input
            style={styles.input}
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
        </div>
      </div>
    </div>
  );

  // Business Listings
  const renderBusinessListings = () => (
    <div style={styles.container}>
      <button 
        style={{ margin: '16px', padding: '8px 16px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
        onClick={() => navigateToView('landing')}
      >
        ← Back
      </button>
      
      <div style={styles.content}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
          All Businesses
        </h1>
        
        {businesses.map((business) => (
          <div key={business.id} style={styles.businessCard}>
            <img src={business.image} alt={business.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{business.name}</h3>
            <div style={{ fontSize: '12px', background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '8px' }}>
              {business.owner}
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>{business.description}</p>
            <div style={{ color: '#fbbf24', marginBottom: '12px' }}>⭐⭐⭐⭐⭐ {business.rating}</div>
            <div style={{ fontSize: '14px', marginBottom: '4px' }}>📍 {business.address}</div>
            <div style={{ fontSize: '14px', marginBottom: '4px' }}>📞 {business.phone}</div>
            <div style={{ fontSize: '14px', marginBottom: '12px' }}>🕒 {business.hours}</div>
            <button 
              style={{...styles.button, ...styles.primaryButton}}
              onClick={() => toggleFavorite(business.id)}
            >
              {favorites.includes(business.id) ? '♥ Favorited' : '♡ Add to Favorites'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Add Business Form
  const renderAddBusiness = () => (
    <div style={styles.container}>
      <button 
        style={{ margin: '16px', padding: '8px 16px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
        onClick={() => navigateToView('profile')}
      >
        ← Back
      </button>
      
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', margin: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>Add Your Business</h1>
        
        <form onSubmit={handleBusinessSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Business Name *</label>
            <input style={{ width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} type="text" required />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Business Category *</label>
            <select style={{ width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', boxSizing: 'border-box' }} required>
              <option value="">Select a category</option>
              <option value="restaurant">Restaurant</option>
              <option value="technology">Technology</option>
              <option value="beauty">Beauty & Personal Care</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Description *</label>
            <textarea style={{ width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', minHeight: '100px', boxSizing: 'border-box' }} required></textarea>
          </div>
          
          <button style={{...styles.button, ...styles.primaryButton, width: '100%'}} type="submit">
            Submit Business for Review
          </button>
        </form>
      </div>
    </div>
  );

  // Profile Page
  const renderProfile = () => (
    <div style={styles.container}>
      <button 
        style={{ margin: '16px', padding: '8px 16px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}
        onClick={() => navigateToView('landing')}
      >
        ← Back
      </button>
      
      <div style={styles.content}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Profile</h1>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>List Your Business</h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
            Get your business featured on Melanin Market.
          </p>
          <button style={{...styles.button, ...styles.primaryButton}} onClick={() => navigateToView('addBusiness')}>
            Add Your Business
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Install App</h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
            Install Melanin Market on your phone for quick access.
          </p>
          <button style={{...styles.button, ...styles.secondaryButton}} onClick={handleInstallApp}>
            Install App
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
      {currentView === 'profile' && renderProfile()}
      {renderBottomNav()}
    </div>
  );
}

export default App;
