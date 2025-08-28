import React, { useState } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [searchCity, setSearchCity] = useState('');
  const [searchState, setSearchState] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    if (searchInput.trim()) {
      const parts = searchInput.split(',').map(part => part.trim());
      const city = parts[0] || '';
      const state = parts[1] || 'NY';
      setSearchCity(city);
      setSearchState(state);
      setCurrentView('listings');
    }
  };

  const handleCityClick = (city, state) => {
    setSearchCity(city);
    setSearchState(state);
    setCurrentView('listings');
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
  };

  const navigateToAddBusiness = () => {
    alert('Add business feature coming soon!');
  };

  // Mock business data
  const mockBusinesses = [
    {
      id: 1,
      name: "Soul Food Kitchen",
      category: "Restaurant",
      address: "123 Main St, Buffalo, NY",
      phone: "(716) 555-0123",
      description: "Authentic soul food restaurant serving the community for over 20 years.",
      rating: 4.5,
      reviews_count: 127,
      owner_ethnicity: "Black-owned",
      verified: true
    },
    {
      id: 2,
      name: "Tech Solutions Plus",
      category: "Technology",
      address: "456 Tech Ave, Buffalo, NY",
      phone: "(716) 555-0456",
      description: "Full-service IT consulting and software development company.",
      rating: 4.8,
      reviews_count: 89,
      owner_ethnicity: "Asian-owned",
      verified: true
    },
    {
      id: 3,
      name: "Abuela's Market",
      category: "Grocery",
      address: "789 Market St, Rochester, NY",
      phone: "(585) 555-0789",
      description: "Family-owned grocery store with authentic Hispanic foods and ingredients.",
      rating: 4.6,
      reviews_count: 203,
      owner_ethnicity: "Hispanic-owned",
      verified: true
    },
    {
      id: 4,
      name: "Harmony Hair Salon",
      category: "Beauty",
      address: "321 Style Ave, Syracuse, NY",
      phone: "(315) 555-0321",
      description: "Professional hair care and styling for all hair types and textures.",
      rating: 4.9,
      reviews_count: 156,
      owner_ethnicity: "Black-owned",
      verified: true
    }
  ];

  const filteredBusinesses = searchCity 
    ? mockBusinesses.filter(business =>
        business.address.toLowerCase().includes(searchCity.toLowerCase())
      )
    : mockBusinesses;

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef7ed 0%, #fef3c7 100%)',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      paddingTop: '4rem',
      paddingBottom: '2rem'
    },
    logo: {
      width: '80px',
      height: '80px',
      margin: '0 auto 1rem',
      background: 'linear-gradient(135deg, #f97316 0%, #d97706 100%)',
      borderRadius: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      color: 'white'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#374151',
      margin: '0.5rem 0'
    },
    subtitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#6b7280',
      marginBottom: '2rem'
    },
    content: {
      maxWidth: '28rem',
      margin: '0 auto',
      padding: '0 1rem'
    },
    heroText: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    heroTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#374151',
      marginBottom: '1rem'
    },
    heroDescription: {
      color: '#6b7280',
      marginBottom: '2rem'
    },
    searchSection: {
      marginBottom: '2rem'
    },
    input: {
      width: '100%',
      padding: '1rem',
      border: '2px solid #fed7aa',
      borderRadius: '0.75rem',
      textAlign: 'center',
      fontSize: '1rem',
      marginBottom: '1rem',
      outline: 'none'
    },
    button: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#f97316',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      fontSize: '1.125rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '1rem'
    },
    buttonSecondary: {
      width: '100%',
      padding: '1rem',
      backgroundColor: 'transparent',
      color: '#f97316',
      border: '2px solid #f97316',
      borderRadius: '0.75rem',
      fontSize: '1.125rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '1rem'
    },
    popularCities: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    cityButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#fed7aa',
      color: '#c2410c',
      border: 'none',
      borderRadius: '1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      margin: '0 0.25rem'
    },
    featureCard: {
      textAlign: 'center',
      marginBottom: '1.5rem'
    },
    featureIcon: {
      width: '4rem',
      height: '4rem',
      backgroundColor: '#f97316',
      borderRadius: '1rem',
      margin: '0 auto 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      color: 'white'
    },
    featureTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    featureDescription: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    bottomNav: {
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      padding: '0.5rem 1rem'
    },
    navContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      maxWidth: '28rem',
      margin: '0 auto'
    },
    navButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0.5rem',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer'
    },
    navIcon: {
      fontSize: '1.5rem',
      marginBottom: '0.25rem'
    },
    navText: {
      fontSize: '0.75rem'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      color: '#f97316',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      marginBottom: '1rem'
    },
    businessCard: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    businessName: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    businessCategory: {
      fontSize: '0.75rem',
      backgroundColor: '#fed7aa',
      color: '#c2410c',
      padding: '0.25rem 0.5rem',
      borderRadius: '1rem',
      display: 'inline-block',
      marginBottom: '0.5rem'
    },
    businessEthnicity: {
      fontSize: '0.875rem',
      color: '#f97316',
      fontWeight: '500',
      marginBottom: '0.5rem'
    },
    businessDescription: {
      fontSize: '0.875rem',
      color: '#374151',
      marginBottom: '1rem'
    },
    businessInfo: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '0.5rem'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    stars: {
      color: '#fbbf24',
      marginRight: '0.5rem'
    }
  };

  if (currentView === 'listings') {
    return (
      <div style={styles.container}>
        <div style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={navigateToLanding} style={styles.backButton}>
              ← Back
            </button>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>
              {searchCity ? `${searchCity}, ${searchState}` : 'Businesses'}
            </h1>
            <div style={{ width: '3rem' }}></div>
          </div>
        </div>

        <div style={{ padding: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
            {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'} found
          </p>

          {filteredBusinesses.map((business) => (
            <div key={business.id} style={styles.businessCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={styles.businessName}>{business.name}</h3>
                <span style={styles.businessCategory}>{business.category}</span>
              </div>

              <p style={styles.businessEthnicity}>{business.owner_ethnicity}</p>
              <p style={styles.businessDescription}>{business.description}</p>

              <div style={styles.rating}>
                <span style={styles.stars}>★★★★★</span>
                <span style={{ fontWeight: '500' }}>{business.rating}</span>
                <span style={{ marginLeft: '0.25rem' }}>({business.reviews_count})</span>
              </div>

              <div style={styles.businessInfo}>
                📍 {business.address}
              </div>
              <div style={styles.businessInfo}>
                📞 {business.phone}
              </div>

              <button style={styles.button}>
                View Details
              </button>
            </div>
          ))}
        </div>

        <div style={{ height: '5rem' }}></div>

        <div style={styles.bottomNav}>
          <div style={styles.navContainer}>
            <button onClick={navigateToLanding} style={styles.navButton}>
              <div style={{ ...styles.navIcon, color: '#9ca3af' }}>🏠</div>
              <span style={{ ...styles.navText, color: '#9ca3af' }}>Home</span>
            </button>
            <button style={styles.navButton}>
              <div style={{ ...styles.navIcon, color: '#9ca3af' }}>❤️</div>
              <span style={{ ...styles.navText, color: '#9ca3af' }}>Favorites</span>
            </button>
            <button style={styles.navButton}>
              <div style={{ ...styles.navIcon, color: '#f97316' }}>🔍</div>
              <span style={{ ...styles.navText, color: '#f97316', fontWeight: '500' }}>Search</span>
            </button>
            <button style={styles.navButton}>
              <div style={{ ...styles.navIcon, color: '#9ca3af' }}>👤</div>
              <span style={{ ...styles.navText, color: '#9ca3af' }}>Profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>🛍️</div>
        <div style={styles.title}>MELANIN</div>
        <div style={styles.title}>MARKET</div>
      </div>

      <div style={styles.content}>
        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>Discover Minority-Owned Businesses</h1>
          <p style={styles.heroDescription}>
            Support local entrepreneurs and build stronger communities together
          </p>
        </div>

        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Enter City, State"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          
          <button onClick={handleSearch} style={styles.button}>
            🔍 Find Businesses
          </button>

          <button onClick={navigateToAddBusiness} style={styles.buttonSecondary}>
            ➕ List Your Business
          </button>
        </div>

        <div style={styles.popularCities}>
          <p style={{ color: '#6b7280', marginBottom: '1rem', fontWeight: '500' }}>Popular Cities:</p>
          <div>
            <button onClick={() => handleCityClick('Buffalo', 'NY')} style={styles.cityButton}>
              Buffalo, NY
            </button>
            <button onClick={() => handleCityClick('Rochester', 'NY')} style={styles.cityButton}>
              Rochester, NY
            </button>
            <button onClick={() => handleCityClick('Syracuse', 'NY')} style={styles.cityButton}>
              Syracuse, NY
            </button>
          </div>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🔍</div>
          <h3 style={styles.featureTitle}>Discover Local</h3>
          <p style={styles.featureDescription}>
            Find authentic minority-owned businesses in your community
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>📍</div>
          <h3 style={styles.featureTitle}>Build Community</h3>
          <p style={styles.featureDescription}>
            Support entrepreneurs and strengthen local economies
          </p>
        </div>
      </div>

      <div style={{ height: '5rem' }}></div>

      <div style={styles.bottomNav}>
        <div style={styles.navContainer}>
          <button style={styles.navButton}>
            <div style={{ ...styles.navIcon, color: '#f97316' }}>🏠</div>
            <span style={{ ...styles.navText, color: '#f97316', fontWeight: '500' }}>Home</span>
          </button>
          <button style={styles.navButton}>
            <div style={{ ...styles.navIcon, color: '#9ca3af' }}>❤️</div>
            <span style={{ ...styles.navText, color: '#9ca3af' }}>Favorites</span>
          </button>
          <button style={styles.navButton}>
            <div style={{ ...styles.navIcon, color: '#9ca3af' }}>🔍</div>
            <span style={{ ...styles.navText, color: '#9ca3af' }}>Search</span>
          </button>
          <button style={styles.navButton}>
            <div style={{ ...styles.navIcon, color: '#9ca3af' }}>👤</div>
            <span style={{ ...styles.navText, color: '#9ca3af' }}>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
