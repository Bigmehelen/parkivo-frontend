# 🗺️ Enable Geocoding API - Get Real Addresses

## What You're Seeing
The warning "Address not available - Enable Geocoding API in Google Cloud Console to see your address" means you need to enable one more API.

## Quick Fix (30 seconds)

### Enable Geocoding API
Click this direct link:
👉 **https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com**

1. Click the blue **"ENABLE"** button
2. Wait 10-30 seconds
3. Refresh your app

That's it! Now when you click the blue marker (your location), you'll see your real address instead of just coordinates.

## What You'll See After Enabling

Instead of:
```
⚠️ Address not available
Location: Lagos, Nigeria
Coordinates: 6.556977, 3.248900
```

You'll see:
```
📍 Your Current Location

Victoria Island
Ahmadu Bello Way

📮 Full Address:
123 Ahmadu Bello Way, Victoria Island, Lagos 101241, Nigeria

🏙️ City: Lagos
🗺️ State: Lagos State
```

## All Required APIs for Full Functionality

Make sure these are all enabled:

1. ✅ **Maps JavaScript API** (for the interactive map)
   - https://console.cloud.google.com/apis/library/maps-backend.googleapis.com

2. ✅ **Geocoding API** (for address lookup)
   - https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com

3. ⚪ **Directions API** (optional - for navigation routes)
   - https://console.cloud.google.com/apis/library/directions-backend.googleapis.com

4. ⚪ **Places API** (optional - for location search)
   - https://console.cloud.google.com/apis/library/places-backend.googleapis.com

## Your API Key
```
AIzaSyCeXQMardrYV9PtExu0ev8VkY72bNlbVKE
```

## Billing Note
- Geocoding API is included in your $200 FREE monthly credit
- You get 40,000 FREE geocoding requests per month
- More than enough for development and normal usage

## After Enabling
1. Wait 1-2 minutes for the API to activate
2. Refresh your browser (Ctrl+R or Cmd+R)
3. Click the blue marker on the map
4. You should now see your real address!

## Troubleshooting

### Still showing "Address not available"?
- Clear browser cache and refresh
- Wait 2-3 minutes after enabling
- Check browser console (F12) for errors
- Verify billing is enabled on your Google Cloud project

### API enabled but not working?
- Make sure you're using the correct Google Cloud project
- Check that your API key has Geocoding API in its restrictions (if you set restrictions)
