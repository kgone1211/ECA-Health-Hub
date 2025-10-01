# EFH Health Hub - Whop Setup Guide

## ✅ Completed Steps

### 1. Environment Variables Added ✅
Your Whop configuration has been added to `.env.local`:
- `WHOP_API_KEY` ✅
- `NEXT_PUBLIC_WHOP_APP_ID` = `app_bH436UXlmvv5xz` ✅
- `NEXT_PUBLIC_WHOP_AGENT_USER_ID` ✅
- `NEXT_PUBLIC_WHOP_COMPANY_ID` = `biz_0iRabAN0PuLJni` ✅

### 2. Required Routes Created ✅
- `/experiences/[experienceId]` - User experience page ✅
- `/dashboard/[companyId]` - Company dashboard ✅
- `/discover` - App marketplace page ✅
- `/whop` - Authentication handler ✅

### 3. Next.js Configuration Updated ✅
- Image optimization for Whop CDN ✅
- X-Frame-Options headers ✅
- Ready for iframe embedding ✅

## 🔧 Next Steps - Whop Dashboard Configuration

### Step 1: Configure App Paths in Whop Dashboard
Go to your [Whop Developer Dashboard](https://whop.com/developer) and update your app settings:

**App ID:** `app_bH436UXlmvv5xz`

In the **"Hosting"** section, set these paths (type them exactly):

| Setting | Value to Enter |
|---------|----------------|
| **Base URL** | `https://your-vercel-domain.vercel.app` |
| **App Path** | `/experiences/[experienceId]` |
| **Dashboard Path** | `/dashboard/[companyId]` |
| **Discover Path** | `/discover` |

⚠️ **IMPORTANT**: 
- You MUST type these paths manually - the placeholder text doesn't mean they're set!
- The brackets `[experienceId]` and `[companyId]` are part of the path - include them exactly as shown
- Wait for each field to save before moving to the next one

### Step 2: Set Webhook URL
In your Whop app settings, set the webhook callback URL to:
```
https://your-vercel-domain.vercel.app/api/whop-webhook
```

### Step 3: Add These Environment Variables to Vercel
When you deploy to Vercel, add all these environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fauwxrubxlihqjsrxrxu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhdXd4cnVieGxpaHFqc3J4cnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMTU3NjYsImV4cCI6MjA3NDg5MTc2Nn0.2TLcUiuThfID7_3OyRZmAKgD_z25aNP_DIZmzbKhHSY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhdXd4cnVieGxpaHFqc3J4cnh1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMxNTc2NiwiZXhwIjoyMDc0ODkxNzY2fQ.hasrSRoS-DP796fpfghBAI9r3j6s4H-CWn4OM4QyTXY

# Postgres
POSTGRES_URL=postgres://postgres.fauwxrubxlihqjsrxrxu:lDfmXsWcsPG7yBp4@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x

# Whop
WHOP_API_KEY=OekNJrWYKOacnr3rBmljZaPgnZH2xhMPOlxHyZkiV4k
NEXT_PUBLIC_WHOP_APP_ID=app_bH436UXlmvv5xz
NEXT_PUBLIC_WHOP_AGENT_USER_ID=user_NurS6ckwQJpTo
NEXT_PUBLIC_WHOP_COMPANY_ID=biz_0iRabAN0PuLJni
```

## 🧪 Testing Locally

1. Restart your dev server to load the new environment variables:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. In the Whop dashboard, click the translucent settings icon (top right)
3. Select "localhost"
4. The default port 3000 should work (or 3001 if 3000 is in use)

## 🚀 Deploying to Production

### Deploy to Vercel:
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add all environment variables from above
4. Deploy

### Update Whop Dashboard:
1. Copy your Vercel deployment URL (e.g., `https://efh-health-hub-v2.vercel.app`)
2. Update the "Base URL" in your Whop app settings
3. Verify webhook URL is updated too

### Test the Integration:
1. Go to your Whop company dashboard: `biz_0iRabAN0PuLJni`
2. Navigate to a product's tools section
3. Add your "EFH Health Hub" app
4. Test accessing the app from the product

## 📋 Integration Checklist

- ✅ Environment variables added to `.env.local`
- ✅ All required routes created
- ✅ Next.js config updated
- ✅ Branding updated to "EFH Health Hub"
- ⚠️ **TODO**: Set app paths in Whop dashboard
- ⚠️ **TODO**: Add environment variables to Vercel
- ⚠️ **TODO**: Deploy to Vercel
- ⚠️ **TODO**: Update Base URL in Whop dashboard
- ⚠️ **TODO**: Test all three routes in production

## 🔗 Useful Links

- **Whop Developer Dashboard**: https://whop.com/developer
- **Your App**: `app_bH436UXlmvv5xz`
- **Your Company**: `biz_0iRabAN0PuLJni`
- **Whop Docs**: https://dev.whop.com/introduction
- **Supabase Dashboard**: https://supabase.com/dashboard

## 🎯 Expected Behavior

Once configured, users will:
1. See your app in the Whop marketplace (`/discover` page)
2. After purchasing, access the app at `/experiences/[experienceId]`
3. Company admins can manage the app at `/dashboard/[companyId]`
4. All authentication flows through `/whop` endpoint
5. Webhooks update user subscriptions in your Supabase database

## ⚡ Quick Start Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server locally
npm start

# Test database connection
npx tsx test-database.ts
```

Your app is ready to deploy! 🎉

