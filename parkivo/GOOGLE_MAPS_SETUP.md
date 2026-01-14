# Google Maps API Setup Guide

## Your API Key
```
AIzaSyCeXQMardrYV9PtExu0ev8VkY72bNlbVKE
```

## Required APIs to Enable

You need to enable these APIs in Google Cloud Console:

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/library

### 2. Enable the following APIs:

#### For Static Maps (Currently Used)
- **Maps Static API**
  - Direct link: https://console.cloud.google.com/apis/library/static-maps-backend.googleapis.com

#### For Embed Maps (Optional)
- **Maps Embed API**
  - Direct link: https://console.cloud.google.com/apis/library/maps-embed-backend.googleapis.com

#### For JavaScript Maps (Future Enhancement)
- **Maps JavaScript API**
  - Direct link: https://console.cloud.google.com/apis/library/maps-backend.googleapis.com

### 3. Steps to Enable Each API:
1. Click on the API name
2. Click the "Enable" button
3. Wait for it to activate (usually takes a few seconds)

### 4. Verify API Key Restrictions (Optional but Recommended)

For security, you should restrict your API key:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your API key
3. Under "Application restrictions":
   - For development: Choose "None" or "HTTP referrers" and add `http://localhost:*`
   - For production: Add your domain
4. Under "API restrictions":
   - Choose "Restrict key"
   - Select only the APIs you're using

## Current Implementation

The app currently uses:
- **Maps Static API** - Shows a static map image with markers
- Fallback to OpenStreetMap if Google Maps fails

## Billing Note

Google Maps Platform requires a billing account, but includes:
- $200 free credit per month
- Static Maps: 100,000 loads free per month
- More than enough for development and small-scale production

## Troubleshooting

If you see errors:
1. Make sure billing is enabled on your Google Cloud project
2. Verify the APIs are enabled
3. Check that your API key is not restricted in a way that blocks your requests
4. Wait a few minutes after enabling APIs for changes to propagate
