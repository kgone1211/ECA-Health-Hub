/** @type {import('@whop-apps/sdk').WhopConfig} */
module.exports = {
  // Your app's configuration
  appId: "app_ECA_Health_Hub_v2",
  name: "ECA Health Hub",
  description: "A comprehensive health coaching platform with M.A.R.C.H. phase detection",
  version: "2.0.0",
  
  // App settings
  app: {
    // Enable iframe embedding
    iframe: true,
    
    // App dimensions
    width: "100%",
    height: "100vh",
    
    // Permissions
    permissions: [
      "user:read",
      "company:read"
    ]
  },
  
  // Development settings
  development: {
    // Local development URL
    localUrl: "http://localhost:3000",
    
    // Enable hot reload
    hotReload: true
  },
  
  // Production settings
  production: {
    // Your production URL
    url: "https://eca-health-hub-v2.vercel.app"
  }
};
