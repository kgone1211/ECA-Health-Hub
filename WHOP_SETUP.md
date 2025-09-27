# Whop Integration Setup Guide

This guide will help you set up the ECA Health Hub v2.0 app for deployment on the Whop platform.

## Environment Variables

### Required Environment Variables

Add these environment variables to your Vercel deployment:

```bash
# Whop API Configuration
WHOP_API_KEY=your_whop_api_key_here
NEXT_PUBLIC_WHOP_APP_ID=app_ECA_Health_Hub_v2
NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_agent_user_id
NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id
```

### How to Get Whop Credentials

1. **WHOP_API_KEY**: 
   - Go to your Whop dashboard
   - Navigate to Settings → API Keys
   - Create a new API key with appropriate permissions

2. **NEXT_PUBLIC_WHOP_APP_ID**: 
   - This is your app's unique identifier
   - Default: `app_ECA_Health_Hub_v2`
   - You can customize this in `whop-manifest.json`

3. **NEXT_PUBLIC_WHOP_AGENT_USER_ID**: 
   - Your Whop agent user ID
   - Found in your Whop dashboard under Account settings

4. **NEXT_PUBLIC_WHOP_COMPANY_ID**: 
   - Your Whop company/business ID
   - Found in your Whop dashboard

## Vercel Deployment Settings

### Import Settings for Vercel

When importing from GitHub to Vercel:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

### Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all the required environment variables listed above
4. Make sure to set them for Production, Preview, and Development environments

## Whop Dashboard Configuration

### App Settings in Whop

1. **App URL**: `https://your-app-name.vercel.app/whop`
2. **Iframe URL**: `https://your-app-name.vercel.app/whop`
3. **Redirect URIs**: 
   - `https://your-app-name.vercel.app`
   - `https://your-app-name.vercel.app/whop`
   - `http://localhost:3000` (for development)
   - `http://localhost:3000/whop` (for development)

### Webhook Configuration

Set up webhooks in your Whop dashboard:

- **Webhook URL**: `https://your-app-name.vercel.app/api/whop/webhook`
- **Events to subscribe to**:
  - `user.created`
  - `user.updated`
  - `subscription.created`
  - `subscription.updated`
  - `subscription.cancelled`

## Testing the Integration

### Local Development

1. Start your development server:
```bash
npm run dev
```

2. Test the Whop page:
```
http://localhost:3000/whop?userId=test_user_123
```

### Production Testing

1. Deploy to Vercel
2. Test the Whop page:
```
https://your-app-name.vercel.app/whop?userId=actual_whop_user_id
```

## Troubleshooting

### Common Issues

1. **Authentication Error**: 
   - Check that all environment variables are set correctly
   - Verify the WHOP_API_KEY has proper permissions

2. **Iframe Not Loading**:
   - Ensure the iframe URL is correctly set in Whop dashboard
   - Check that the `/whop` page is accessible

3. **Webhook Not Working**:
   - Verify the webhook URL is correct
   - Check that the webhook endpoint is accessible
   - Review webhook logs in Vercel function logs

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

This will enable test mode for Whop authentication.

## Security Considerations

1. **API Key Security**: Never commit API keys to version control
2. **Environment Variables**: Use Vercel's environment variable system
3. **Webhook Verification**: Implement webhook signature verification for production
4. **User Data**: Ensure proper handling of user data according to privacy regulations

## Support

For issues with Whop integration:
1. Check the Vercel function logs
2. Review the browser console for client-side errors
3. Verify all environment variables are set correctly
4. Test with Whop's development tools

For Whop-specific issues, consult the [Whop Developer Documentation](https://docs.whop.com/).

