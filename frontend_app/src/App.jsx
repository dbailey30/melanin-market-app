import React, { useState } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [searchCity, setSearchCity] = useState('');
  const [searchState, setSearchState] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const toggleFavorite = (businessId) => {
    setFavorites(prev => 
      prev.includes(businessId) 
        ? prev.filter(id => id !== businessId)
        : [...prev, businessId]
    );
  };

  const navigateToView = (view) => {
    setCurrentView(view);
  };

  // Enhanced business data with more details
  const mockBusinesses = [
    {
      id: 1,
      name: "Soul Food Kitchen",
      category: "Restaurant",
      address: "123 Main St, Buffalo, NY",
      phone: "(716) 555-0123",
      email: "info@soulfoodkitchen.com",
      website: "www.soulfoodkitchen.com",
      description: "Authentic soul food restaurant serving the community for over 20 years. Family recipes passed down through generations.",
      rating: 4.5,
      reviews_count: 127,
      owner_ethnicity: "Black-owned",
      verified: true,
      hours: "Mon-Sat: 11AM-9PM, Sun: 12PM-8PM",
      price_range: "$$",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Tech Solutions Plus",
      category: "Technology",
      address: "456 Tech Ave, Buffalo, NY",
      phone: "(716) 555-0456",
      email: "contact@techsolutionsplus.com",
      website: "www.techsolutionsplus.com",
      description: "Full-service IT consulting and software development company specializing in small business solutions.",
      rating: 4.8,
      reviews_count: 89,
      owner_ethnicity: "Asian-owned",
      verified: true,
      hours: "Mon-Fri: 9AM-6PM",
      price_range: "$$$",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Abuela's Market",
      category: "Grocery",
      address: "789 Market St, Rochester, NY",
      phone: "(585) 555-0789",
      email: "info@abuelasmarket.com",
      website: "www.abuelasmarket.com",
      description: "Family-owned grocery store with authentic Hispanic foods, fresh produce, and traditional ingredients.",
      rating: 4.6,
      reviews_count: 203,
      owner_ethnicity: "Hispanic-owned",
      verified: true,
      hours: "Daily: 8AM-10PM",
      price_range: "$",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Harmony Hair Salon",
      category: "Beauty",
      address: "321 Style Ave, Syracuse, NY",
      phone: "(315) 555-0321",
      email: "book@harmonyhair.com",
      website: "www.harmonyhair.com",
      description: "Professional hair care and styling for all hair types and textures. Specializing in natural hair care.",
      rating: 4.9,
      reviews_count: 156,
      owner_ethnicity: "Black-owned",
      verified: true,
      hours: "Tue-Sat: 9AM-7PM",
      price_range: "$$",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      name: "Artisan Coffee Roasters",
      category: "Coffee",
      address: "654 Bean St, Buffalo, NY",
      phone: "(716) 555-0654",
      email: "hello@artisancoffee.com",
      website: "www.artisancoffee.com",
      description: "Small-batch coffee roasters committed to fair trade and supporting coffee farmers worldwide.",
      rating: 4.7,
      reviews_count: 92,
      owner_ethnicity: "Latino-owned",
      verified: true,
      hours: "Mon-Fri: 6AM-6PM, Sat-Sun: 7AM-5PM",
      price_range: "$$",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      name: "Native Wellness Center",
      category: "Health",
      address: "987 Healing Way, Syracuse, NY",
      phone: "(315) 555-0987",
      email: "info@nativewellness.com",
      website: "www.nativewellness.com",
      description: "Holistic wellness center offering traditional healing practices and modern wellness services.",
      rating: 4.8,
      reviews_count: 74,
      owner_ethnicity: "Native American-owned",
      verified: true,
      hours: "Mon-Fri: 8AM-8PM, Sat: 9AM-5PM",
      price_range: "$$$",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    }
  ];

  const categories = ['All', 'Restaurant', 'Technology', 'Beauty', 'Grocery', 'Coffee', 'Health'];

  const filteredBusinesses = mockBusinesses.filter(business => {
    const matchesCity = !searchCity || business.address.toLowerCase().includes(searchCity.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory;
    return matchesCity && matchesCategory;
  });

  const favoriteBusinesses = mockBusinesses.filter(business => favorites.includes(business.id));

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 50%, #f97316 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      textAlign: 'center',
      paddingTop: '3rem',
      paddingBottom: '2rem'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem'
    },
    logo: {
      width: '60px',
      height: '60px',
      marginRight: '1rem',
      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      borderRadius: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: 'white',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: '0',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#6b7280',
      marginTop: '0.5rem',
      fontWeight: '500'
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
      fontSize: '1.75rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1rem'
    },
    heroDescription: {
      color: '#4b5563',
      fontSize: '1.1rem',
      lineHeight: '1.6',
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
      outline: 'none',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease'
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
      marginBottom: '1rem',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
      transition: 'all 0.2s ease'
    },
    buttonSecondary: {
      width: '100%',
      padding: '1rem',
      backgroundColor: 'white',
      color: '#f97316',
      border: '2px solid #f97316',
      borderRadius: '0.75rem',
      fontSize: '1.125rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease'
    },
    popularCities: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    cityButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: 'rgba(255,255,255,0.9)',
      color: '#ea580c',
      border: '1px solid #fed7aa',
      borderRadius: '2rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      margin: '0.25rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease'
    },
    featureCard: {
      textAlign: 'center',
      marginBottom: '2rem',
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: '2rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
      color: 'white',
      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
    },
    featureTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    featureDescription: {
      fontSize: '0.95rem',
      color: '#6b7280',
      lineHeight: '1.5'
    },
    bottomNav: {
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      padding: '0.75rem 1rem',
      boxShadow: '0 -4px 12px rgba(0,0,0,0.1)'
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
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    navIcon: {
      fontSize: '1.5rem',
      marginBottom: '0.25rem'
    },
    navText: {
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      color: '#f97316',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      marginBottom: '1rem',
      fontWeight: '600'
    },
    businessCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease'
    },
    businessImage: {
      width: '100%',
      height: '200px',
      borderRadius: '0.75rem',
      objectFit: 'cover',
      marginBottom: '1rem'
    },
    businessName: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    businessCategory: {
      fontSize: '0.75rem',
      backgroundColor: '#fed7aa',
      color: '#ea580c',
      padding: '0.25rem 0.75rem',
      borderRadius: '1rem',
      display: 'inline-block',
      marginBottom: '0.5rem',
      fontWeight: '600'
    },
    businessEthnicity: {
      fontSize: '0.875rem',
      color: '#f97316',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    businessDescription: {
      fontSize: '0.875rem',
      color: '#4b5563',
      marginBottom: '1rem',
      lineHeight: '1.5'
    },
    businessInfo: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    stars: {
      color: '#fbbf24',
      marginRight: '0.5rem',
      fontSize: '1rem'
    },
    favoriteButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      backgroundColor: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '2.5rem',
      height: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontSize: '1.25rem'
    },
    categoryFilter: {
      display: 'flex',
      overflowX: 'auto',
      padding: '1rem 0',
      marginBottom: '1rem',
      gap: '0.5rem'
    },
    categoryButton: {
      padding: '0.5rem 1rem',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s ease'
    },
    categoryButtonActive: {
      backgroundColor: '#f97316',
      color: 'white',
      borderColor: '#f97316'
    }
  };

  // Favorites View
  if (currentView === 'favorites') {
    return (
      <div style={styles.container}>
        <div style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => navigateToView('landing')} style={styles.backButton}>
              ← Back
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937' }}>
              My Favorites
            </h1>
            <div style={{ width: '3rem' }}></div>
          </div>
        </div>

        <div style={{ padding: '1rem' }}>
          {favoriteBusinesses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💝</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                No favorites yet
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                Start exploring businesses and add them to your favorites!
              </p>
              <button 
                onClick={() => navigateToView('listings')} 
                style={styles.button}
              >
                Discover Businesses
              </button>
            </div>
          ) : (
            favoriteBusinesses.map((business) => (
              <div key={business.id} style={{ ...styles.businessCard, position: 'relative' }}>
                <button
                  onClick={() => toggleFavorite(business.id)}
                  style={{
                    ...styles.favoriteButton,
                    color: favorites.includes(business.id) ? '#ef4444' : '#d1d5db'
                  }}
                >
                  ♥
                </button>

                <img src={business.image} alt={business.name} style={styles.businessImage} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={styles.businessName}>{business.name}</h3>
                  <span style={styles.businessCategory}>{business.category}</span>
                </div>

                <p style={styles.businessEthnicity}>{business.owner_ethnicity}</p>
                <p style={styles.businessDescription}>{business.description}</p>

                <div style={styles.rating}>
                  <span style={styles.stars}>★★★★★</span>
                  <span style={{ fontWeight: '600' }}>{business.rating}</span>
                  <span style={{ marginLeft: '0.25rem' }}>({business.reviews_count})</span>
                </div>

                <div style={styles.businessInfo}>
                  <span style={{ marginRight: '0.5rem' }}>📍</span>
                  {business.address}
                </div>
                <div style={styles.businessInfo}>
                  <span style={{ marginRight: '0.5rem' }}>📞</span>
                  {business.phone}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ height: '5rem' }}></div>

        <div style={styles.bottomNav}>
          <div style={styles.navContainer}>
            <button onClick={() => navigateT
(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)
