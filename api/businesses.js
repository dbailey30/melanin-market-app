// Secure Vercel API function for GitHub operations
// This keeps the GitHub token server-side and secure

export default async function handler(req, res) {
  // CORS headers for frontend access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GitHub configuration from environment variables (server-side only)
  const GITHUB_CONFIG = {
    OWNER: process.env.GITHUB_OWNER || 'dbailey30',
    REPO: process.env.GITHUB_REPO || 'melanin-market-app',
    BRANCH: process.env.GITHUB_BRANCH || 'main',
    TOKEN: process.env.GITHUB_TOKEN, // Server-side only, no REACT_APP_ prefix
    FILE_PATH: 'frontend_app/public/businesses.json'
  };

  // Admin password hash (in production, use proper hashing)
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'melanin2025admin';

  // Verify GitHub token is configured
  if (!GITHUB_CONFIG.TOKEN) {
    return res.status(500).json({ 
      error: 'GitHub integration not configured',
      message: 'GitHub token not found in environment variables'
    });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGetBusinesses(req, res, GITHUB_CONFIG);
      
      case 'POST':
        return await handleAddBusiness(req, res, GITHUB_CONFIG, ADMIN_PASSWORD);
      
      case 'PUT':
        return await handleUpdateBusiness(req, res, GITHUB_CONFIG, ADMIN_PASSWORD);
      
      case 'DELETE':
        return await handleDeleteBusiness(req, res, GITHUB_CONFIG, ADMIN_PASSWORD);
      
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// GET: Fetch businesses from GitHub
async function handleGetBusinesses(req, res, config) {
  try {
    const response = await fetch(`https://api.github.com/repos/${config.OWNER}/${config.REPO}/contents/${config.FILE_PATH}`, {
      headers: {
        'Authorization': `token ${config.TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Melanin-Market-App'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const businesses = JSON.parse(content);
    
    return res.status(200).json({
      success: true,
      businesses: businesses,
      sha: data.sha,
      lastUpdated: data.commit?.committer?.date || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch businesses',
      message: error.message 
    });
  }
}

// POST: Add new business (requires admin authentication)
async function handleAddBusiness(req, res, config, adminPassword) {
  // Verify admin authentication
  const { adminAuth, businessData } = req.body;
  
  if (!adminAuth || adminAuth !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials' });
  }

  if (!businessData) {
    return res.status(400).json({ error: 'Business data is required' });
  }

  try {
    // Get current businesses
    const currentData = await fetchCurrentBusinesses(config);
    if (!currentData) {
      throw new Error('Could not fetch current businesses from GitHub');
    }

    // Add new business
    const newBusiness = {
      ...businessData,
      id: Math.max(...currentData.businesses.map(b => b.id), 0) + 1,
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'approved',
      verified: true
    };

    const updatedBusinesses = [...currentData.businesses, newBusiness];

    // Update GitHub
    await updateBusinessesInGitHub(config, updatedBusinesses, currentData.sha, `Add business: ${newBusiness.name}`);

    return res.status(201).json({
      success: true,
      message: `Business "${newBusiness.name}" added successfully`,
      business: newBusiness
    });
  } catch (error) {
    console.error('Error adding business:', error);
    return res.status(500).json({ 
      error: 'Failed to add business',
      message: error.message 
    });
  }
}

// PUT: Update existing business (requires admin authentication)
async function handleUpdateBusiness(req, res, config, adminPassword) {
  const { adminAuth, businessId, businessData } = req.body;
  
  if (!adminAuth || adminAuth !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials' });
  }

  if (!businessId || !businessData) {
    return res.status(400).json({ error: 'Business ID and data are required' });
  }

  try {
    // Get current businesses
    const currentData = await fetchCurrentBusinesses(config);
    if (!currentData) {
      throw new Error('Could not fetch current businesses from GitHub');
    }

    // Update business
    const updatedBusinesses = currentData.businesses.map(b => 
      b.id === businessId ? { ...businessData, id: businessId } : b
    );

    // Check if business was found
    const businessExists = currentData.businesses.some(b => b.id === businessId);
    if (!businessExists) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Update GitHub
    await updateBusinessesInGitHub(config, updatedBusinesses, currentData.sha, `Update business: ${businessData.name}`);

    return res.status(200).json({
      success: true,
      message: `Business "${businessData.name}" updated successfully`,
      business: { ...businessData, id: businessId }
    });
  } catch (error) {
    console.error('Error updating business:', error);
    return res.status(500).json({ 
      error: 'Failed to update business',
      message: error.message 
    });
  }
}

// DELETE: Remove business (requires admin authentication)
async function handleDeleteBusiness(req, res, config, adminPassword) {
  const { adminAuth, businessId } = req.body;
  
  if (!adminAuth || adminAuth !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials' });
  }

  if (!businessId) {
    return res.status(400).json({ error: 'Business ID is required' });
  }

  try {
    // Get current businesses
    const currentData = await fetchCurrentBusinesses(config);
    if (!currentData) {
      throw new Error('Could not fetch current businesses from GitHub');
    }

    // Find business to delete
    const businessToDelete = currentData.businesses.find(b => b.id === businessId);
    if (!businessToDelete) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Remove business
    const updatedBusinesses = currentData.businesses.filter(b => b.id !== businessId);

    // Update GitHub
    await updateBusinessesInGitHub(config, updatedBusinesses, currentData.sha, `Delete business: ${businessToDelete.name}`);

    return res.status(200).json({
      success: true,
      message: `Business "${businessToDelete.name}" deleted successfully`,
      deletedBusiness: businessToDelete
    });
  } catch (error) {
    console.error('Error deleting business:', error);
    return res.status(500).json({ 
      error: 'Failed to delete business',
      message: error.message 
    });
  }
}

// Helper function to fetch current businesses from GitHub
async function fetchCurrentBusinesses(config) {
  try {
    const response = await fetch(`https://api.github.com/repos/${config.OWNER}/${config.REPO}/contents/${config.FILE_PATH}`, {
      headers: {
        'Authorization': `token ${config.TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Melanin-Market-App'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const businesses = JSON.parse(content);
    
    return { businesses, sha: data.sha };
  } catch (error) {
    console.error('Error fetching current businesses:', error);
    return null;
  }
}

// Helper function to update businesses in GitHub
async function updateBusinessesInGitHub(config, businesses, sha, commitMessage) {
  const content = Buffer.from(JSON.stringify(businesses, null, 2)).toString('base64');
  
  const response = await fetch(`https://api.github.com/repos/${config.OWNER}/${config.REPO}/contents/${config.FILE_PATH}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${config.TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Melanin-Market-App'
    },
    body: JSON.stringify({
      message: commitMessage,
      content: content,
      sha: sha,
      branch: config.BRANCH
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`GitHub update failed: ${errorData.message}`);
  }

  return await response.json();
}
