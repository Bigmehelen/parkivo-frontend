# Smart Parking Feature Setup

## Overview
The Smart Parking feature integrates Google Maps to display available parking spots around the user's current location with real-time availability indicators.

## Features Implemented

### 1. Interactive Map View
- Google Maps integration using `react-native-maps`
- User's current location displayed
- Custom markers for parking spots with color-coded availability

### 2. Color-Coded Availability System
- **Green**: >50% spots available (plenty of parking)
- **Orange**: 20-50% spots available (limited parking)
- **Red**: <20% spots available (very few spots)

### 3. Parking Spot Information
Each parking spot displays:
- Name and location
- Available spots count
- Distance from user
- Price per hour
- Total capacity

### 4. Interactive Features
- Tap markers on map to select parking spot
- Tap parking cards to view details
- Reserve button for selected spots

## Setup Instructions

### 1. Google Maps API Key (Required for Production)

For web, add to `app.json`:
```json
{
  "expo": {
    "web": {
      "config": {
        "googleMapsApiKey": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

For iOS, add to `app.json`:
```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

For Android, add to `app.json`:
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_API_KEY_HERE"
        }
      }
    }
  }
}
```

### 2. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Maps SDK for Android, iOS, and JavaScript
4. Create credentials (API Key)
5. Add the key to your `app.json`

### 3. Location Permissions
The app automatically requests location permissions. Make sure to add to `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow Parkivo to use your location to find nearby parking spots."
        }
      ]
    ]
  }
}
```

## Backend Integration

### API Endpoints Needed

The `parkingApi.js` file is ready for backend integration. You'll need to implement:

1. **GET /api/parking/nearby**
   - Query params: `lat`, `lng`, `radius`
   - Returns: Array of nearby parking spots

2. **GET /api/parking/:spotId**
   - Returns: Detailed info for specific spot

3. **POST /api/parking/reserve**
   - Body: `{ spotId, userId, duration }`
   - Returns: Reservation confirmation

4. **PATCH /api/parking/:spotId/availability**
   - Body: `{ availableSpots }`
   - Returns: Updated spot info

### Replace Mock Data

In `smartpark.jsx`, replace the mock `parkingSpots` array with:

```javascript
import { useGetNearbyParkingSpotsQuery } from '../api/parkingApi';

// Inside component:
const { data: parkingSpots, isLoading } = useGetNearbyParkingSpotsQuery({
  latitude: location?.latitude,
  longitude: location?.longitude,
  radius: 5
});
```

## Current Mock Data

The app currently uses mock parking data for demonstration. The mock spots are positioned around San Francisco coordinates (37.788, -122.432).

## Testing

1. Run the app: `npx expo start --web`
2. Grant location permissions when prompted
3. The map should center on your location
4. Mock parking spots will appear with colored markers
5. Click markers or cards to interact

## Next Steps

1. Set up Google Maps API key
2. Connect to real backend API
3. Implement reservation system
4. Add payment integration
5. Add real-time updates for availability
6. Implement navigation to parking spots
7. Add filters (price, distance, availability)
8. Add parking history and favorites
