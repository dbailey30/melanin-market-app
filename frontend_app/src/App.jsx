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

  // Admin password - Change this to something secure
  const ADMIN_PASSWORD = 'melanin2025admin';

  // EmailJS Configuration - REPLACE WITH YOUR ACTUAL VALUES
  const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_l1mf75l',
    TEMPLATE_ID: 'template_1zwylhd',
    PUBLIC_KEY: 'jv0z8LO2xSTdzuvDz'
  };

  // GitHub API Configuration - These will be environment variables in production
  const GITHUB_CONFIG = {
    OWNER: 'dbailey30',
    REPO: 'melanin-market-app',
    BRANCH: 'main',
    TOKEN: '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', //
    FILE_PATH: 'frontend_app/public/businesses.json'
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

  // GitHub API Functions
  const fetchBusinessesFromGitHub = async () => {
    if (!GITHUB_CONFIG.TOKEN) {
      console.warn('GitHub token not configured, using local data');
      return null;
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.FILE_PATH}`, {
        headers: {
          'Authorization': `token ${GITHUB_CONFIG.TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      const content = atob(data.content);
      const businesses = JSON.parse(content);
      
      return { businesses, sha: data.sha };
    } catch (error) {
      console.error('Error fetching from GitHub:', error);
      return null;
    }
  };

  const updateBusinessesInGitHub = async (businesses, action, businessName) => {
    if (!GITHUB_CONFIG.TOKEN) {
      throw new Error('GitHub token not configured');
    }

    try {
      // First, get the current file to get the SHA
      const currentFile = await fetchBusinessesFromGitHub();
      if (!currentFile) {
        throw new Error('Could not fetch current file from GitHub');
      }

      const content = btoa(JSON.stringify(businesses, null, 2));
      
      const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.FILE_PATH}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_CONFIG.TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update businesses.json - ${action} business: ${businessName}`,
          content: content,
          sha: currentFile.sha,
          branch: GITHUB_CONFIG.BRANCH
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API error: ${errorData.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating GitHub:', error);
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

  // Load businesses from JSON file or GitHub
  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        // Try to load from GitHub first (for admin users)
        if (GITHUB_CONFIG.TOKEN && isAdminAuthenticated) {
          const githubData = await fetchBusinessesFromGitHub();
          if (githubData) {
            setBusinesses(githubData.businesses);
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

  // Business management functions with GitHub integration
  const handleAddBusiness = async (businessData) => {
    setIsUpdatingGitHub(true);
    
    try {
      const newBusiness = {
        ...businessData,
        id: Math.max(...businesses.map(b => b.id), 0) + 1,
        dateAdded: new Date().toISOString().split('T')[0],
        status: 'approved',
        verified: true
      };
      
      const updatedBusinesses = [...businesses, newBusiness];
      
      // Update GitHub if token is available
      if (GITHUB_CONFIG.TOKEN) {
        await updateBusinessesInGitHub(updatedBusinesses, 'Add', newBusiness.name);
        alert(`✅ Business "${newBusiness.name}" added successfully!\n\n🚀 GitHub updated automatically\n⏱️ Changes will be live in 2-3 minutes after Vercel redeploys`);
      } else {
        alert(`✅ Business "${newBusiness.name}" added successfully!\n\n⚠️ Note: GitHub integration not configured. Changes are temporary until you manually update businesses.json`);
      }
      
      setBusinesses(updatedBusinesses);
      setShowAddForm(false);
      
    } catch (error) {
      console.error('Error adding business:', error);
      alert(`❌ Error adding business: ${error.message}\n\nThe business was added locally but could not be saved to GitHub. Please try again or contact support.`);
    } finally {
      setIsUpdatingGitHub(false);
    }
  };

  const handleEditBusiness = async (businessData) => {
    setIsUpdatingGitHub(true);
    
    try {
      const updatedBusinesses = businesses.map(b => 
        b.id === editingBusiness.id ? { ...businessData, id: editingBusiness.id } : b
      );
      
      // Update GitHub if token is available
      if (GITHUB_CONFIG.TOKEN) {
        await updateBusinessesInGitHub(updatedBusinesses, 'Edit', businessData.name);
        alert(`✅ Business "${businessData.name}" updated successfully!\n\n🚀 GitHub updated automatically\n⏱️ Changes will be live in 2-3 minutes after Vercel redeploys`);
      } else {
        alert(`✅ Business "${businessData.name}" updated successfully!\n\n⚠️ Note: GitHub integration not configured. Changes are temporary until you manually update businesses.json`);
      }
      
      setBusinesses(updatedBusinesses);
      setEditingBusiness(null);
      
    } catch (error) {
      console.error('Error editing business:', error);
      alert(`❌ Error updating business: ${error.message}\n\nThe business was updated locally but could not be saved to GitHub. Please try again or contact support.`);
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
        const updatedBusinesses = businesses.filter(b => b.id !== businessId);
        
        // Update GitHub if token is available
        if (GITHUB_CONFIG.TOKEN) {
          await updateBusinessesInGitHub(updatedBusinesses, 'Delete', businessToDelete.name);
          alert(`✅ Business "${businessToDelete.name}" deleted successfully!\n\n🚀 GitHub updated automatically\n⏱️ Changes will be live in 2-3 minutes after Vercel redeploys`);
        } else {
          alert(`✅ Business "${businessToDelete.name}" deleted successfully!\n\n⚠️ Note: GitHub integration not configured. Changes are temporary until you manually update businesses.json`);
        }
        
        setBusinesses(updatedBusinesses);
        
      } catch (error) {
        console.error('Error deleting business:', error);
        alert(`❌ Error deleting business: ${error.message}\n\nThe business was removed locally but could not be deleted from GitHub. Please try again or contact support.`);
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
      
      const verificationMessage = businessData.verification_submitted 
        ? '\n\n🏆 Your business will receive a verified badge once approved!'
        : '';
      
      alert('🎉 Success! Your business submission has been sent for review.\n\nWe will contact you at ' + businessData.business_email + ' within 2-3 business days.' + verificationMessage + '\n\nThank you for joining the Melanin Market community!');
      e.target.reset();
      setBusinessLocationType('physical');
      setCurrentView('profile');

    } catch (error) {
      console.error('Failed to send email:', error);
      alert('❌ Submission Error\n\nThere was an issue sending your submission. Please try again or contact us directly at admin@melanin-market.com\n\nError details: ' + (error.text || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToView = (view) => setCurrentView(view);
  const handleSearch = () => setCurrentView('businesses');
  const toggleFavorite = (businessId) => {
    setFavorites(prev => 
      prev.includes(businessId) 
        ? prev.filter(id => id !== businessId)
        : [...prev, businessId]
    );
  };

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

  const filteredBusinesses = businesses.filter(business => {
    const matchesCategory = selectedCategory === 'All' || business.type === selectedCategory;
    return matchesCategory && business.status === 'approved';
  });

  const favoriteBusinesses = businesses.filter(business => favorites.includes(business.id));

  // Address component with Google Maps integration
  const AddressDisplay = ({ business }) => {
    if (business.businessType === 'online') {
      return (
        <div style={styles.businessInfo}>
          🌐 Online Business • Serves: {business.serviceArea || business.city}
        </div>
      );
    } else if (business.businessType === 'mobile') {
      return (
        <div style={styles.businessInfo}>
          🚐 Mobile Service • Serves: {business.serviceArea || business.city}
        </div>
      );
    } else {
      return (
        <div 
          style={styles.addressLink}
          onClick={() => handleAddressClick(business)}
          title="Click for directions"
        >
          📍 {business.address} (Get Directions)
        </div>
      );
    }
  };

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
      position: 'relative',
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
      cursor: 'pointer',
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
    adminButton: {
      position: 'absolute',
      bottom: '10px',
      right: '20px',
      background: 'rgba(234, 88, 12, 0.1)',
      border: '1px solid rgba(234, 88, 12, 0.3)',
      color: '#ea580c',
      padding: '6px 12px',
      fontSize: '12px',
      borderRadius: '4px',
      cursor: 'pointer',
      opacity: 0.7,
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
    businessTypeIndicator: {
      fontSize: '11px',
      padding: '2px 6px',
      borderRadius: '10px',
      marginLeft: '8px',
      fontWeight: 'bold',
    },
    physicalBadge: {
      background: '#e5e7eb',
      color: '#374151',
    },
    onlineBadge: {
      background: '#dbeafe',
      color: '#1d4ed8',
    },
    mobileBadge: {
      background: '#d1fae5',
      color: '#065f46',
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
    addressLink: {
      fontSize: '14px',
      color: '#ea580c',
      marginBottom: '4px',
      cursor: 'pointer',
      textDecoration: 'underline',
      transition: 'color 0.2s',
    },
    rating: {
      color: '#fbbf24',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px',
    },
    verifiedBadge: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      boxShadow: '0 3px 6px rgba(245, 158, 11, 0.4)',
      border: '2px solid #f59e0b',
      whiteSpace: 'nowrap',
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
    submitButton: {
      background: isSubmitting ? '#9ca3af' : '#ea580c',
      color: 'white',
      width: '100%',
      marginTop: '20px',
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      opacity: isSubmitting ? 0.7 : 1,
    },
    adminContainer: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      margin: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    adminHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      borderBottom: '2px solid #e5e7eb',
      paddingBottom: '16px',
    },
    adminTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
    },
    logoutButton: {
      background: '#ef4444',
      color: 'white',
      padding: '8px 16px',
      fontSize: '14px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
    },
    adminActions: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    adminButton: {
      background: isUpdatingGitHub ? '#9ca3af' : '#3b82f6',
      color: 'white',
      padding: '10px 20px',
      fontSize: '14px',
      border: 'none',
      borderRadius: '6px',
      cursor: isUpdatingGitHub ? 'not-allowed' : 'pointer',
      opacity: isUpdatingGitHub ? 0.7 : 1,
    },
    businessRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '8px',
      background: '#f9fafb',
    },
    businessActions: {
      display: 'flex',
      gap: '8px',
    },
    editButton: {
      background: isUpdatingGitHub ? '#9ca3af' : '#f59e0b',
      color: 'white',
      padding: '6px 12px',
      fontSize: '12px',
      border: 'none',
      borderRadius: '4px',
      cursor: isUpdatingGitHub ? 'not-allowed' : 'pointer',
      opacity: isUpdatingGitHub ? 0.7 : 1,
    },
    deleteButton: {
      background: isUpdatingGitHub ? '#9ca3af' : '#ef4444',
      color: 'white',
      padding: '6px 12px',
      fontSize: '12px',
      border: 'none',
      borderRadius: '4px',
      cursor: isUpdatingGitHub ? 'not-allowed' : 'pointer',
      opacity: isUpdatingGitHub ? 0.7 : 1,
    },
    githubStatus: {
      background: GITHUB_CONFIG.TOKEN ? '#d1fae5' : '#fef3c7',
      color: GITHUB_CONFIG.TOKEN ? '#065f46' : '#92400e',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginBottom: '16px',
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

  // Admin Login Form
  const renderAdminLogin = () => (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigateToView('landing')}>← Back</button>
      
      <div style={styles.formContainer}>
        <h1 style={styles.formTitle}>Admin Login</h1>
        <form onSubmit={handleAdminLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>
          <button style={{...styles.button, ...styles.primaryButton}} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );

  // Business Form Component (for add/edit)
  const BusinessForm = ({ business, onSubmit, onCancel, title }) => {
    const [formData, setFormData] = useState(business || {
      name: '',
      type: '',
      businessType: 'physical',
      owner: '',
      description: '',
      address: '',
      city: '',
      state: '',
      serviceArea: '',
      phone: '',
      email: '',
      website: '',
      hours: '',
      image: '',
      rating: '0.0 (0)',
      verificationSubmitted: false,
      verificationMethod: '',
      verificationDetails: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBusinessTypeChange = (type) => {
      setFormData(prev => ({
        ...prev,
        businessType: type,
        address: type === 'online' ? 'Online Business' : 
                type === 'mobile' ? 'Mobile Service' : '',
        serviceArea: type === 'online' ? 'Nationwide' : 
                    type === 'mobile' ? 'Local Area' : ''
      }));
    };

    return (
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>{title}</h2>
        
        {isUpdatingGitHub && (
          <div style={{
            background: '#dbeafe',
            color: '#1d4ed8',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            🔄 Updating GitHub repository... Please wait.
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Business Name *</label>
            <input
              style={styles.input}
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={isUpdatingGitHub}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Business Type *</label>
            <select
              style={styles.select}
              value={formData.businessType}
              onChange={(e) => handleBusinessTypeChange(e.target.value)}
              disabled={isUpdatingGitHub}
              required
            >
              <option value="physical">Physical Location/Storefront</option>
              <option value="online">Online Business Only</option>
              <option value="mobile">Mobile/Service Business</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category *</label>
            <select
              style={styles.select}
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              disabled={isUpdatingGitHub}
              required
            >
              <option value="">Select category</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Technology">Technology</option>
              <option value="Beauty">Beauty & Personal Care</option>
              <option value="Grocery">Grocery & Food</option>
              <option value="Coffee">Coffee & Beverages</option>
              <option value="Health">Health & Wellness</option>
              <option value="Retail">Retail & Shopping</option>
              <option value="Services">Professional Services</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Owner Ethnicity *</label>
            <select
              style={styles.select}
              value={formData.owner}
              onChange={(e) => handleChange('owner', e.target.value)}
              disabled={isUpdatingGitHub}
              required
            >
              <option value="">Select owner ethnicity</option>
              <option value="Black-owned">Black-owned</option>
              <option value="Hispanic-owned">Hispanic-owned</option>
              <option value="Asian-owned">Asian-owned</option>
              <option value="Native American-owned">Native American-owned</option>
              <option value="Latino-owned">Latino-owned</option>
              <option value="Other minority-owned">Other minority-owned</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              style={styles.textarea}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={isUpdatingGitHub}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              {formData.businessType === 'online' ? 'Business Base (Optional)' : 
               formData.businessType === 'mobile' ? 'Service Area Base' : 'Address *'}
            </label>
            <input
              style={styles.input}
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              disabled={isUpdatingGitHub}
              placeholder={
                formData.businessType === 'online' ? 'Online Business' :
                formData.businessType === 'mobile' ? 'Mobile Service' :
                'Street address'
              }
              required={formData.businessType === 'physical'}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{...styles.formGroup, flex: 1}}>
              <label style={styles.label}>City *</label>
              <input
                style={styles.input}
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                disabled={isUpdatingGitHub}
                required
              />
            </div>
            <div style={{...styles.formGroup, flex: 1}}>
              <label style={styles.label}>State *</label>
              <select 
                style={styles.select} 
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                disabled={isUpdatingGitHub}
                required
              >
                {US_STATES.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Service Area</label>
            <input
              style={styles.input}
              type="text"
              value={formData.serviceArea}
              onChange={(e) => handleChange('serviceArea', e.target.value)}
              disabled={isUpdatingGitHub}
              placeholder={
                formData.businessType === 'online' ? 'Nationwide, Worldwide, etc.' :
                formData.businessType === 'mobile' ? 'Buffalo Metro Area, etc.' :
                'Local area served'
              }
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone *</label>
            <input
              style={styles.input}
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={isUpdatingGitHub}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              style={styles.input}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={isUpdatingGitHub}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Website</label>
            <input
              style={styles.input}
              type="url"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              disabled={isUpdatingGitHub}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Hours</label>
            <textarea
              style={styles.textarea}
              value={formData.hours}
              onChange={(e) => handleChange('hours', e.target.value)}
              disabled={isUpdatingGitHub}
              placeholder={
                formData.businessType === 'online' ? '24/7 Online, Mon-Fri: 9AM-5PM Support, etc.' :
                'Mon-Fri: 9AM-6PM, etc.'
              }
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Image URL</label>
            <input
              style={styles.input}
              type="url"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              disabled={isUpdatingGitHub}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Rating</label>
            <input
              style={styles.input}
              type="text"
              value={formData.rating}
              onChange={(e) => handleChange('rating', e.target.value)}
              disabled={isUpdatingGitHub}
              placeholder="4.5 (123)"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Verification Status</label>
            <select
              style={styles.select}
              value={formData.verificationSubmitted ? 'verified' : 'unverified'}
              onChange={(e) => handleChange('verificationSubmitted', e.target.value === 'verified')}
              disabled={isUpdatingGitHub}
            >
              <option value="unverified">Not Verified</option>
              <option value="verified">Verified Business</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Verification Method</label>
            <select
              style={styles.select}
              value={formData.verificationMethod || ''}
              onChange={(e) => handleChange('verificationMethod', e.target.value)}
              disabled={isUpdatingGitHub}
            >
              <option value="">Select verification method</option>
              <option value="business-license">Business License</option>
              <option value="ein">EIN Number</option>
              <option value="dba">DBA Certificate</option>
              <option value="other">Other Documentation</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Verification Details</label>
            <input
              style={styles.input}
              type="text"
              value={formData.verificationDetails || ''}
              onChange={(e) => handleChange('verificationDetails', e.target.value)}
              disabled={isUpdatingGitHub}
              placeholder="License number, EIN, or other verification info"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              style={{...styles.button, ...styles.primaryButton, flex: 1}} 
              type="submit"
              disabled={isUpdatingGitHub}
            >
              {isUpdatingGitHub ? '🔄 Updating...' : (business ? 'Update Business' : 'Add Business')}
            </button>
            <button
              style={{...styles.button, ...styles.secondaryButton, flex: 1}}
              type="button"
              onClick={onCancel}
              disabled={isUpdatingGitHub}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Admin Panel
  const renderAdminPanel = () => {
    const verifiedCount = businesses.filter(b => b.verificationSubmitted).length;
    const unverifiedCount = businesses.length - verifiedCount;
    const physicalCount = businesses.filter(b => b.businessType === 'physical').length;
    const onlineCount = businesses.filter(b => b.businessType === 'online').length;
    const mobileCount = businesses.filter(b => b.businessType === 'mobile').length;

    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => navigateToView('landing')}>← Back</button>
        
        <div style={styles.adminContainer}>
          <div style={styles.adminHeader}>
            <h1 style={styles.adminTitle}>Business Management</h1>
            <button style={styles.logoutButton} onClick={handleAdminLogout}>
              Logout
            </button>
          </div>

          {/* GitHub Integration Status */}
          <div style={styles.githubStatus}>
            {GITHUB_CONFIG.TOKEN ? (
              '✅ GitHub Integration: ACTIVE - Changes will automatically update the live site'
            ) : (
              '⚠️ GitHub Integration: NOT CONFIGURED - Changes are temporary only'
            )}
          </div>

          {!showAddForm && !editingBusiness && (
            <>
              <div style={styles.adminActions}>
                <button
                  style={styles.adminButton}
                  onClick={() => setShowAddForm(true)}
                  disabled={isUpdatingGitHub}
                >
                  ➕ Add New Business
                </button>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Total: {businesses.length} | 
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}> Verified: {verifiedCount}</span> | 
                  Unverified: {unverifiedCount}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Physical: {physicalCount} | Online: {onlineCount} | Mobile: {mobileCount}
                </div>
              </div>

              <div>
                <h3 style={{ marginBottom: '16px', color: '#1f2937' }}>Current Businesses</h3>
                {businesses.map(business => (
                  <div key={business.id} style={styles.businessRow}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {business.name}
                        {business.verificationSubmitted && (
                          <span style={{
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                          }}>
                            🏆 VERIFIED
                          </span>
                        )}
                        <span style={{
                          ...styles.businessTypeIndicator,
                          ...(business.businessType === 'physical' ? styles.physicalBadge :
                              business.businessType === 'online' ? styles.onlineBadge :
                              styles.mobileBadge)
                        }}>
                          {business.businessType === 'physical' ? '🏢 Physical' :
                           business.businessType === 'online' ? '🌐 Online' :
                           '🚐 Mobile'}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {business.type} • {business.owner} • {business.address}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        Service Area: {business.serviceArea || 'Not specified'}
                      </div>
                      {business.verificationSubmitted && (
                        <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '2px' }}>
                          Verification: {business.verificationMethod} - {business.verificationDetails}
                        </div>
                      )}
                    </div>
                    <div style={styles.businessActions}>
                      <button
                        style={styles.editButton}
                        onClick={() => setEditingBusiness(business)}
                        disabled={isUpdatingGitHub}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDeleteBusiness(business.id)}
                        disabled={isUpdatingGitHub}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {showAddForm && (
            <BusinessForm
              title="Add New Business"
              onSubmit={handleAddBusiness}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {editingBusiness && (
            <BusinessForm
              business={editingBusiness}
              title="Edit Business"
              onSubmit={handleEditBusiness}
              onCancel={() => setEditingBusiness(null)}
            />
          )}
        </div>
      </div>
    );
  };

  // Landing Page
  const renderLandingPage = () => (
    <div style={styles.container}>
      <div style={styles.header}>
        <img 
          src="/logo.PNG" 
          alt="Melanin Market" 
          style={styles.logo} 
          onClick={handleLogoClick}
          onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='block';}} 
        />
        <div style={{...styles.logo, display: 'none'}} onClick={handleLogoClick}>🛍️</div>
        <div>
          <div style={styles.title}>MELANIN MARKET</div>
          <div style={styles.subtitle}>Discover • Support • Thrive</div>
        </div>
        
        {/* Hidden Admin Button */}
        <button 
          style={styles.adminButton}
          onClick={() => setCurrentView('admin')}
          title="Admin Access"
        >
          Admin
        </button>
      </div>
      
      <div style={styles.content}>
        <div style={styles.searchSection}>
          <h1 style={styles.searchTitle}>Discover Minority-Owned Businesses</h1>
          <p style={styles.searchDescription}>
            Support local entrepreneurs and build stronger communities together. Find authentic businesses owned by Black, Hispanic, Asian, Native American, and other minority entrepreneurs - both physical locations and online businesses.
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
            <button style={{...styles.button, ...styles.cityButton}} onClick={handleSearch}>Buffalo, NY</button>
            <button style={{...styles.button, ...styles.cityButton}} onClick={handleSearch}>Rochester, NY</button>
            <button style={{...styles.button, ...styles.cityButton}} onClick={handleSearch}>Syracuse, NY</button>
          </div>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🔍</div>
          <h3 style={styles.featureTitle}>Discover Local & Online</h3>
          <p style={styles.featureDescription}>
            Find authentic minority-owned businesses in your community and online, from restaurants and cafes to tech companies and e-commerce stores.
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>💝</div>
          <h3 style={styles.featureTitle}>Support & Save</h3>
          <p style={styles.featureDescription}>
            Save your favorite businesses and support entrepreneurs who are building stronger, more diverse communities both locally and globally.
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🌟</div>
          <h3 style={styles.featureTitle}>Build Community</h3>
          <p style={styles.featureDescription}>
            Connect with business owners, leave reviews, and help create a thriving ecosystem of minority-owned enterprises across all business types.
          </p>
        </div>
      </div>
    </div>
  );

  // Business Listings
  const renderBusinessListings = () => (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigateToView('landing')}>← Back</button>
      
      <div style={styles.content}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>All Businesses</h1>
        
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button style={{...styles.button, ...styles.cityButton, ...(selectedCategory === 'All' ? {background: '#ea580c', color: 'white'} : {})}} onClick={() => setSelectedCategory('All')}>All</button>
          <button style={{...styles.button, ...styles.cityButton, ...(selectedCategory === 'Restaurant' ? {background: '#ea580c', color: 'white'} : {})}} onClick={() => setSelectedCategory('Restaurant')}>Restaurant</button>
          <button style={{...styles.button, ...styles.cityButton, ...(selectedCategory === 'Technology' ? {background: '#ea580c', color: 'white'} : {})}} onClick={() => setSelectedCategory('Technology')}>Technology</button>
          <button style={{...styles.button, ...styles.cityButton, ...(selectedCategory === 'Grocery' ? {background: '#ea580c', color: 'white'} : {})}} onClick={() => setSelectedCategory('Grocery')}>Grocery</button>
          <button style={{...styles.button, ...styles.cityButton, ...(selectedCategory === 'Entertainment' ? {background: '#ea580c', color: 'white'} : {})}} onClick={() => setSelectedCategory('Entertainment')}>Entertainment</button>
        </div>
        
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
          {filteredBusinesses.length} businesses found
        </p>
        
        {filteredBusinesses.map(business => (
          <div key={business.id} style={styles.businessCard}>
            {business.image && (
              <img 
                src={business.image} 
                alt={business.name}
                style={styles.businessImage}
                onError={(e) => {e.target.style.display='none';}}
              />
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={styles.businessName}>{business.name}</h3>
              <span style={{
                ...styles.businessTypeIndicator,
                ...(business.businessType === 'physical' ? styles.physicalBadge :
                    business.businessType === 'online' ? styles.onlineBadge :
                    styles.mobileBadge)
              }}>
                {business.businessType === 'physical' ? '🏢' :
                 business.businessType === 'online' ? '🌐' :
                 '🚐'}
              </span>
            </div>
            
            <span style={styles.businessType}>{business.type}</span>
            <p style={styles.businessDescription}>{business.description}</p>
            
            <div style={styles.rating}>
              ⭐⭐⭐⭐⭐ {business.rating}
              {business.verificationSubmitted && (
                <span style={styles.verifiedBadge}>
                  🏆 Verified Business
                </span>
              )}
            </div>
            
            <AddressDisplay business={business} />
            
            {business.serviceArea && business.businessType !== 'online' && business.businessType !== 'mobile' && (
              <div style={styles.businessInfo}>🗺️ Service Area: {business.serviceArea}</div>
            )}
            
            <div style={styles.businessInfo}>📞 {business.phone}</div>
            {business.hours && <div style={styles.businessInfo}>🕒 {business.hours}</div>}
            {business.website && (
              <div style={styles.businessInfo}>
                🌐 <a href={business.website} target="_blank" rel="noopener noreferrer" style={{color: '#ea580c'}}>{business.website}</a>
              </div>
            )}
            
            <button 
              style={{
                ...styles.button,
                background: favorites.includes(business.id) ? '#ef4444' : '#ea580c',
                color: 'white',
                width: '100%',
                marginTop: '12px'
              }}
              onClick={() => toggleFavorite(business.id)}
            >
              {favorites.includes(business.id) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Profile/Add Business Page
  const renderProfile = () => (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigateToView('landing')}>← Back</button>
      
      <div style={styles.content}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>📱</div>
          <h3 style={styles.featureTitle}>Install Melanin Market</h3>
          <p style={styles.featureDescription}>
            Add this app to your home screen for quick access to minority-owned businesses in your area.
          </p>
          <button style={{...styles.button, ...styles.primaryButton}} onClick={handleInstallApp}>
            📲 Install App
          </button>
        </div>

        <div style={styles.formContainer}>
          <h1 style={styles.formTitle}>Add Your Business</h1>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '24px' }}>
            Join our community of minority-owned businesses and reach more customers. We support physical locations, online businesses, and mobile services.
          </p>
          
          <form onSubmit={handleBusinessSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Business Name *</label>
              <input
                style={styles.input}
                type="text"
                name="businessName"
                required
                placeholder="Enter your business name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Business Type *</label>
              <select 
                style={styles.select} 
                name="businessLocationType"
                value={businessLocationType}
                onChange={(e) => setBusinessLocationType(e.target.value)}
                required
              >
                <option value="physical">Physical Location/Storefront</option>
                <option value="online">Online Business Only</option>
                <option value="mobile">Mobile/Service Business</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Business Category *</label>
              <select style={styles.select} name="businessCategory" required>
                <option value="">Select a category</option>
                <option value="restaurant">Restaurant</option>
                <option value="technology">Technology</option>
                <option value="beauty">Beauty & Personal Care</option>
                <option value="grocery">Grocery & Food</option>
                <option value="coffee">Coffee & Beverages</option>
                <option value="health">Health & Wellness</option>
                <option value="retail">Retail & Shopping</option>
                <option value="services">Professional Services</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Owner Ethnicity *</label>
              <select style={styles.select} name="ownerEthnicity" required>
                <option value="">Select owner ethnicity</option>
                <option value="black">Black-owned</option>
                <option value="hispanic">Hispanic-owned</option>
                <option value="asian">Asian-owned</option>
                <option value="native-american">Native American-owned</option>
                <option value="latino">Latino-owned</option>
                <option value="other">Other minority-owned</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Business Description *</label>
              <textarea
                style={styles.textarea}
                name="businessDescription"
                required
                placeholder="Describe your business, products, or services"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                {businessLocationType === 'online' ? 'Business Base (Optional)' : 
                 businessLocationType === 'mobile' ? 'Service Area Base' : 'Street Address *'}
              </label>
              <input
                style={styles.input}
                type="text"
                name="businessAddress"
                required={businessLocationType === 'physical'}
                placeholder={
                  businessLocationType === 'online' ? 'Online Business (auto-filled)' :
                  businessLocationType === 'mobile' ? 'Mobile Service (auto-filled)' :
                  '123 Main Street'
                }
                defaultValue={
                  businessLocationType === 'online' ? 'Online Business' :
                  businessLocationType === 'mobile' ? 'Mobile Service' : ''
                }
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{...styles.formGroup, flex: 1}}>
                <label style={styles.label}>City *</label>
                <input
                  style={styles.input}
                  type="text"
                  name="businessCity"
                  required
                  placeholder={businessLocationType === 'online' ? 'Base city' : 'Buffalo'}
                />
              </div>
              <div style={{...styles.formGroup, flex: 1}}>
                <label style={styles.label}>State *</label>
                <select style={styles.select} name="businessState" required>
                  {US_STATES.map(state => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Service Area</label>
              <input
                style={styles.input}
                type="text"
                name="serviceArea"
                placeholder={
                  businessLocationType === 'online' ? 'Nationwide, Worldwide, etc.' :
                  businessLocationType === 'mobile' ? 'Buffalo Metro Area, Western NY, etc.' :
                  'Local area you serve'
                }
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number *</label>
              <input
                style={styles.input}
                type="tel"
                name="businessPhone"
                required
                placeholder="(716) 555-0123"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address *</label>
              <input
                style={styles.input}
                type="email"
                name="businessEmail"
                required
                placeholder="info@yourbusiness.com"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Website (Optional)</label>
              <input
                style={styles.input}
                type="url"
                name="businessWebsite"
                placeholder="https://www.yourbusiness.com"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Business Hours (Optional)</label>
              <textarea
                style={styles.textarea}
                name="businessHours"
                placeholder={
                  businessLocationType === 'online' ? '24/7 Online, Mon-Fri: 9AM-5PM Support, etc.' :
                  'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed'
                }
              />
            </div>

            <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <h4 style={{ color: '#92400e', marginBottom: '8px', fontSize: '16px' }}>🏆 Business Verification (Optional)</h4>
              <p style={{ color: '#92400e', fontSize: '14px', marginBottom: '12px' }}>
                Provide verification details to receive a verified business badge and build customer trust.
              </p>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Verification Method</label>
                <select style={styles.select} name="verificationMethod">
                  <option value="">Select verification method</option>
                  <option value="business-license">Business License</option>
                  <option value="ein">EIN Number</option>
                  <option value="dba">DBA Certificate</option>
                  <option value="other">Other Documentation</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Verification Details</label>
                <input
                  style={styles.input}
                  type="text"
                  name="verificationDetails"
                  placeholder="License number, EIN, or other verification info"
                />
              </div>
            </div>

            <button 
              style={{...styles.button, ...styles.submitButton}} 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? '📤 Submitting...' : '📤 Submit Business for Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // Favorites Page
  const renderFavorites = () => (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigateToView('landing')}>← Back</button>
      
      <div style={styles.content}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>My Favorites</h1>
        
        {favoriteBusinesses.length === 0 ? (
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🤍</div>
            <h3 style={styles.featureTitle}>No Favorites Yet</h3>
            <p style={styles.featureDescription}>
              Start exploring businesses and add your favorites to see them here.
            </p>
            <button style={{...styles.button, ...styles.primaryButton}} onClick={() => navigateToView('businesses')}>
              🔍 Find Businesses
            </button>
          </div>
        ) : (
          favoriteBusinesses.map(business => (
            <div key={business.id} style={styles.businessCard}>
              {business.image && (
                <img 
                  src={business.image} 
                  alt={business.name}
                  style={styles.businessImage}
                  onError={(e) => {e.target.style.display='none';}}
                />
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={styles.businessName}>{business.name}</h3>
                <span style={{
                  ...styles.businessTypeIndicator,
                  ...(business.businessType === 'physical' ? styles.physicalBadge :
                      business.businessType === 'online' ? styles.onlineBadge :
                      styles.mobileBadge)
                }}>
                  {business.businessType === 'physical' ? '🏢' :
                   business.businessType === 'online' ? '🌐' :
                   '🚐'}
                </span>
              </div>
              
              <span style={styles.businessType}>{business.type}</span>
              <p style={styles.businessDescription}>{business.description}</p>
              
              <div style={styles.rating}>
                ⭐⭐⭐⭐⭐ {business.rating}
                {business.verificationSubmitted && (
                  <span style={styles.verifiedBadge}>
                    🏆 Verified Business
                  </span>
                )}
              </div>
              
              <AddressDisplay business={business} />
              
              <div style={styles.businessInfo}>📞 {business.phone}</div>
              {business.hours && <div style={styles.businessInfo}>🕒 {business.hours}</div>}
              {business.website && (
                <div style={styles.businessInfo}>
                  🌐 <a href={business.website} target="_blank" rel="noopener noreferrer" style={{color: '#ea580c'}}>{business.website}</a>
                </div>
              )}
              
              <button 
                style={{
                  ...styles.button,
                  background: '#ef4444',
                  color: 'white',
                  width: '100%',
                  marginTop: '12px'
                }}
                onClick={() => toggleFavorite(business.id)}
              >
                ❤️ Remove from Favorites
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Main render logic
  const renderCurrentView = () => {
    if (currentView === 'admin') {
      return isAdminAuthenticated ? renderAdminPanel() : renderAdminLogin();
    }

    switch (currentView) {
      case 'businesses':
        return renderBusinessListings();
      case 'favorites':
        return renderFavorites();
      case 'profile':
        return renderProfile();
      default:
        return renderLandingPage();
    }
  };

  return (
    <>
      {renderCurrentView()}
      
      {/* Bottom Navigation */}
      <div style={styles.bottomNav}>
        <button 
          style={{...styles.navButton, ...(currentView === 'landing' ? styles.activeNavButton : {})}}
          onClick={() => navigateToView('landing')}
        >
          <div style={{fontSize: '20px', marginBottom: '4px'}}>🏠</div>
          Home
        </button>
        <button 
          style={{...styles.navButton, ...(currentView === 'businesses' ? styles.activeNavButton : {})}}
          onClick={() => navigateToView('businesses')}
        >
          <div style={{fontSize: '20px', marginBottom: '4px'}}>🔍</div>
          Search
        </button>
        <button 
          style={{...styles.navButton, ...(currentView === 'favorites' ? styles.activeNavButton : {})}}
          onClick={() => navigateToView('favorites')}
        >
          <div style={{fontSize: '20px', marginBottom: '4px'}}>❤️</div>
          Favorites
        </button>
        <button 
          style={{...styles.navButton, ...(currentView === 'profile' ? styles.activeNavButton : {})}}
          onClick={() => navigateToView('profile')}
        >
          <div style={{fontSize: '20px', marginBottom: '4px'}}>👤</div>
          Profile
        </button>
      </div>
    </>
  );
}

export default App;

