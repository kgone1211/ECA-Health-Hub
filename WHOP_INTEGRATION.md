# Whop Platform Integration - EFH Health Hub

## ✅ Completed Integration Steps

### 1. Required Routes Created
Based on the [Whop Next.js App Template](https://github.com/whopio/whop-nextjs-app-template):

- ✅ `/experiences/[experienceId]` - Main app experience route for users
- ✅ `/dashboard/[companyId]` - Company dashboard for app management
- ✅ `/discover` - Discovery page for the Whop marketplace
- ✅ `/whop` - Whop authentication handler (already existed)

### 2. Next.js Configuration Updated
Updated `next.config.ts` with:
- Image optimization for Whop CDN (`*.whop.com`)
- X-Frame-Options set to `ALLOWALL` for iframe embedding
- Proper headers for Whop platform integration

### 3. Environment Variables Needed

Add these to your `.env.local` (get from Whop Developer Dashboard):

```env
# Whop Configuration
NEXT_PUBLIC_WHOP_APP_ID="your_app_id_here"
NEXT_PUBLIC_WHOP_API_KEY="your_api_key_here"
WHOP_WEBHOOK_SECRET="your_webhook_secret_here"
```

## 🔧 Whop Developer Dashboard Configuration

### Step 1: Create/Update Your Whop App
1. Go to your [Whop Developer Dashboard](https://whop.com/developer)
2. Create a new app or select your existing "EFH Health Hub" app

### Step 2: Configure App Paths
In the "Hosting" section of your app settings, set:

| Setting | Value |
|---------|-------|
| **Base URL** | `https://your-domain.vercel.app` (or your production URL) |
| **App Path** | `/experiences/[experienceId]` |
| **Dashboard Path** | `/dashboard/[companyId]` |
| **Discover Path** | `/discover` |

⚠️ **Important**: The placeholder text in the UI does not mean it's set - you must explicitly enter the paths!

### Step 3: Webhook Configuration
Set your webhook callback URL to:
```
https://your-domain.vercel.app/api/whop-webhook
```

### Step 4: Get Environment Variables
From your Whop app settings, copy:
- App ID
- API Key
- Webhook Secret

Add these to your Vercel environment variables.

## 📝 Testing Your Integration

### Local Development
1. Install dependencies: `npm install`
2. Create `.env.local` with all required variables
3. Run `npm run dev`
4. In the Whop dashboard, find the settings icon (top right) and select "localhost"
5. The default port 3000 should work

### Production Deployment
1. Deploy to Vercel with environment variables set
2. Update "Base URL" in Whop dashboard to your Vercel URL
3. Go to a Whop product in the same org as your app
4. Navigate to the tools section and add your app
5. Test the app experience

## 🎯 How the Routes Work

### `/experiences/[experienceId]`
- **Purpose**: Main user experience for members who have access
- **Usage**: This is where users interact with your health coaching platform
- **Access**: Shown to users who have purchased/have access to your product

### `/dashboard/[companyId]`
- **Purpose**: Company/product admin dashboard
- **Usage**: Manage app settings, view analytics, configure the app
- **Access**: Shown to company owners/admins

### `/discover`
- **Purpose**: Marketing/discovery page for your app
- **Usage**: Showcase features, benefits, and convince users to install/subscribe
- **Access**: Public, shown in the Whop app marketplace

## 🔐 Authentication Flow

Your app uses Whop's authentication:
1. User clicks on your app in Whop
2. Whop redirects to `/whop` with authentication tokens
3. App validates the user via `@whop/react` and Whop API
4. User is redirected to the appropriate experience or dashboard

## 📚 Additional Resources

- [Whop Developer Documentation](https://dev.whop.com/introduction)
- [Whop Next.js Template](https://github.com/whopio/whop-nextjs-app-template)
- [Whop React SDK](https://www.npmjs.com/package/@whop/react)
- [Whop API Reference](https://dev.whop.com/api-reference)

## ✨ Current Status

- ✅ All required routes created
- ✅ Next.js config updated for Whop
- ✅ Branding updated to "EFH Health Hub"
- ✅ Supabase database configured
- ✅ Webhook handler exists
- ⚠️ Need to add Whop environment variables
- ⚠️ Need to configure paths in Whop dashboard
- ⚠️ Need to test in production

## 🚀 Next Steps

1. Add Whop environment variables to `.env.local` and Vercel
2. Configure app paths in Whop Developer Dashboard
3. Deploy to Vercel
4. Test the integration by adding the app to a Whop product
5. Verify all three routes load correctly within Whop

