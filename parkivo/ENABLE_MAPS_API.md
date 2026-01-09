# 🗺️ Enable Google Maps JavaScript API

## The Error You're Seeing
"This page can't load Google Maps correctly" means the **Maps JavaScript API** is not enabled for your API key.

## Quick Fix (5 minutes)

### Step 1: Enable Required APIs

You need to enable TWO APIs:

#### A. Maps JavaScript API (for the map)
👉 **https://console.cloud.google.com/apis/library/maps-backend.googleapis.com**

1. Click the blue **"ENABLE"** button
2. Wait 10-30 seconds

#### B. Geocoding API (for addresses)
👉 **https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com**

1. Click the blue **"ENABLE"** button
2. Wait 10-30 seconds

**Both APIs are required** for the map to show your address!

### Step 2: Enable Billing (Required)
Google Maps requires a billing account, but don't worry:
- You get **$200 FREE credit every month**
- Maps JavaScript API: **28,000 loads FREE per month**
- You won't be charged unless you exceed the free tier

To enable billing:
1. Go to: https://console.cloud.google.com/billing
2. Link a billing account (credit card required but won't be charged)
3. Accept the terms

### Step 3: Refresh Your App
After enabling the API:
1. Wait 1-2 minutes for changes to propagate
2. Refresh your browser (Ctrl+R or Cmd+R)
3. The map should now load!

## Your API Key
```
AIzaSyCeXQMardrYV9PtExu0ev8VkY72bNlbVKE
```

## Additional APIs You Might Need

For full functionality, also enable these (optional):

1. **Maps Static API** (for static map images)
   - https://console.cloud.google.com/apis/library/static-maps-backend.googleapis.com

2. **Places API** (for location search - future feature)
   - https://console.cloud.google.com/apis/library/places-backend.googleapis.com

3. **Directions API** (for navigation - future feature)
   - https://console.cloud.google.com/apis/library/directions-backend.googleapis.com

## Security Recommendations

After it's working, secure your API key:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your API key
3. Under "Application restrictions":
   - For development: Add `http://localhost:*`
   - For production: Add your domain
4. Under "API restrictions":
   - Select "Restrict key"
   - Choose only the APIs you're using

## Troubleshooting

### Still seeing the error?
- Clear browser cache and refresh
- Wait 2-3 minutes after enabling the API
- Check that billing is enabled
- Verify you're using the correct Google Cloud project

### Map loads but shows "For development purposes only"
- This is normal! It means billing isn't enabled yet
- The map will work, but will show this watermark
- Enable billing to remove it

### Need Help?
Check the browser console (F12) for detailed error messages.
