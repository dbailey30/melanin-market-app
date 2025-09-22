// Vercel API function to check GitHub integration status
// This allows the frontend to know if GitHub integration is working

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // GitHub configuration
  const GITHUB_CONFIG = {
    OWNER: process.env.GITHUB_OWNER || 'dbailey30',
    REPO: process.env.GITHUB_REPO || 'melanin-market-app',
    TOKEN: process.env.GITHUB_TOKEN,
    FILE_PATH: 'frontend_app/public/businesses.json'
  };

  try {
    // Check if GitHub token is configured
    if (!GITHUB_CONFIG.TOKEN) {
      return res.status(200).json({
        status: 'disabled',
        message: 'GitHub integration not configured',
        hasToken: false,
        timestamp: new Date().toISOString()
      });
    }

    // Test GitHub API access
    const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}`, {
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Melanin-Market-App'
      }
    });

    if (!response.ok) {
      return res.status(200).json({
        status: 'error',
        message: `GitHub API error: ${response.status} ${response.statusText}`,
        hasToken: true,
        timestamp: new Date().toISOString()
      });
    }

    const repoData = await response.json();

    // Test file access
    const fileResponse = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.FILE_PATH}`, {
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Melanin-Market-App'
      }
    });

    const fileExists = fileResponse.ok;

    return res.status(200).json({
      status: 'active',
      message: 'GitHub integration is working',
      hasToken: true,
      repository: {
        name: repoData.name,
        fullName: repoData.full_name,
        private: repoData.private,
        lastPush: repoData.pushed_at
      },
      file: {
        exists: fileExists,
        path: GITHUB_CONFIG.FILE_PATH
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('GitHub status check error:', error);
    return res.status(200).json({
      status: 'error',
      message: `Connection error: ${error.message}`,
      hasToken: !!GITHUB_CONFIG.TOKEN,
      timestamp: new Date().toISOString()
    });
  }
}
