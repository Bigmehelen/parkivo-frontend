import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';

const GoogleMap = ({ location, parkingSpots, onMarkerClick, selectedParking }) => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCeXQMardrYV9PtExu0ev8VkY72bNlbVKE&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          initMap();
        } else {
          setMapError('Failed to load Google Maps');
          setIsLoading(false);
        }
      };
      script.onerror = () => {
        setMapError('Failed to load Google Maps script');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.google) {
        setMapError('Map container not ready');
        setIsLoading(false);
        return;
      }

      try {
        // Create map
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: location.latitude, lng: location.longitude },
          zoom: 12,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        googleMapRef.current = map;
        setIsLoading(false);

        // Add user location marker with info window
        const userMarker = new window.google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
          map: map,
          title: 'Your Location',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
          zIndex: 1000,
        });

        // Create geocoder for reverse geocoding
        const geocoder = new window.google.maps.Geocoder();
        
        // Create info window for user location with loading state
        const userInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; min-width: 250px;">
              <h3 style="margin: 0 0 12px 0; font-size: 17px; font-weight: 600; color: #111827;">
                📍 Your Current Location
              </h3>
              <div style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                <div style="margin: 8px 0; padding: 8px; background: #f3f4f6; border-radius: 6px;">
                  <div style="color: #3b82f6; font-weight: 500;">🔍 Finding your address...</div>
                </div>
                <div style="margin: 8px 0; font-size: 13px; color: #9ca3af;">
                  <strong>Coordinates:</strong><br/>
                  ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}
                </div>
              </div>
            </div>
          `,
        });

        // Add click listener to user marker with reverse geocoding
        userMarker.addListener('click', () => {
          // Close all parking spot info windows
          markersRef.current.forEach(m => {
            if (m.infoWindow) m.infoWindow.close();
          });
          
          // Show loading state
          userInfoWindow.setContent(`
            <div style="padding: 12px; min-width: 250px;">
              <h3 style="margin: 0 0 12px 0; font-size: 17px; font-weight: 600; color: #111827;">
                📍 Your Current Location
              </h3>
              <div style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                <div style="margin: 8px 0; padding: 12px; background: #f3f4f6; border-radius: 6px; text-align: center;">
                  <div style="color: #3b82f6; font-weight: 500;">🔍 Getting your address...</div>
                </div>
              </div>
            </div>
          `);
          
          userInfoWindow.open(map, userMarker);
          map.panTo(userMarker.getPosition());
          
          // Perform reverse geocoding
          geocoder.geocode(
            { location: { lat: location.latitude, lng: location.longitude } },
            (results, status) => {
              if (status === 'OK' && results[0]) {
                const address = results[0].formatted_address;
                const addressComponents = results[0].address_components;
                
                // Extract specific components
                let street = '';
                let area = '';
                let city = '';
                let state = '';
                
                addressComponents.forEach(component => {
                  if (component.types.includes('route')) {
                    street = component.long_name;
                  }
                  if (component.types.includes('sublocality') || component.types.includes('neighborhood')) {
                    area = component.long_name;
                  }
                  if (component.types.includes('locality')) {
                    city = component.long_name;
                  }
                  if (component.types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                  }
                });
                
                // Update info window with address
                userInfoWindow.setContent(`
                  <div style="padding: 12px; min-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
                    <h3 style="margin: 0 0 12px 0; font-size: 17px; font-weight: 600; color: #111827;">
                      📍 Your Current Location
                    </h3>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                      <div style="color: white; font-size: 15px; font-weight: 600; line-height: 1.5;">
                        ${area || city || 'Lagos'}
                      </div>
                      ${street ? `<div style="color: rgba(255,255,255,0.9); font-size: 13px; margin-top: 4px;">${street}</div>` : ''}
                    </div>

                    <div style="font-size: 13px; color: #6b7280; line-height: 1.8;">
                      <div style="margin: 6px 0; padding: 8px; background: #f9fafb; border-radius: 6px;">
                        <strong style="color: #374151;">📮 Full Address:</strong><br/>
                        <span style="color: #4b5563;">${address}</span>
                      </div>
                      
                      ${city ? `
                        <div style="margin: 6px 0;">
                          <strong>🏙️ City:</strong> ${city}
                        </div>
                      ` : ''}
                      
                      ${state ? `
                        <div style="margin: 6px 0;">
                          <strong>🗺️ State:</strong> ${state}
                        </div>
                      ` : ''}
                      
                      <div style="margin: 8px 0; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
                        <strong>Coordinates:</strong> ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}
                      </div>
                    </div>

                    <div style="margin-top: 12px; padding: 10px; background: #dbeafe; border-radius: 6px; text-align: center;">
                      <div style="color: #1e40af; font-size: 13px; font-weight: 500;">
                        ✨ Finding parking near you
                      </div>
                    </div>
                  </div>
                `);
              } else {
                // Fallback if geocoding fails - show helpful error
                console.error('Geocoding failed:', status);
                userInfoWindow.setContent(`
                  <div style="padding: 12px; min-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
                    <h3 style="margin: 0 0 12px 0; font-size: 17px; font-weight: 600; color: #111827;">
                      📍 Your Current Location
                    </h3>
                    
                    <div style="margin: 8px 0; padding: 12px; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
                      <div style="color: #92400e; font-weight: 600; margin-bottom: 6px;">⚠️ Address not available</div>
                      <div style="color: #78350f; font-size: 12px; line-height: 1.5;">
                        Enable <strong>Geocoding API</strong> in Google Cloud Console to see your address
                      </div>
                    </div>
                    
                    <div style="font-size: 13px; color: #6b7280; line-height: 1.8; margin-top: 12px;">
                      <div style="margin: 6px 0; padding: 8px; background: #f3f4f6; border-radius: 6px;">
                        <strong style="color: #374151;">📍 Location:</strong> Lagos, Nigeria
                      </div>
                      
                      <div style="margin: 8px 0; font-size: 12px; color: #9ca3af;">
                        <strong>Coordinates:</strong><br/>
                        ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}
                      </div>
                    </div>

                    <div style="margin-top: 12px; padding: 10px; background: #e0e7ff; border-radius: 6px;">
                      <div style="color: #3730a3; font-size: 11px; line-height: 1.5;">
                        <strong>To enable:</strong><br/>
                        Visit: <span style="font-family: monospace;">console.cloud.google.com/apis/library/geocoding-backend.googleapis.com</span>
                      </div>
                    </div>
                  </div>
                `);
              }
            }
          );
        });

        // Add user location circle
        new window.google.maps.Circle({
          strokeColor: '#4285F4',
          strokeOpacity: 0.3,
          strokeWeight: 2,
          fillColor: '#4285F4',
          fillOpacity: 0.1,
          map: map,
          center: { lat: location.latitude, lng: location.longitude },
          radius: 500,
        });

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add parking spot markers
        parkingSpots.forEach((spot) => {
          const percentage = (spot.availableSpots / spot.totalSpots) * 100;
          let markerColor = '#10b981'; // Green
          let statusText = 'Plenty Available';
          let statusEmoji = '✅';
          
          if (percentage <= 50) {
            markerColor = '#f59e0b'; // Orange
            statusText = 'Limited Spots';
            statusEmoji = '⚠️';
          }
          if (percentage <= 20) {
            markerColor = '#ef4444'; // Red
            statusText = 'Almost Full';
            statusEmoji = '🔴';
          }

          const marker = new window.google.maps.Marker({
            position: { lat: spot.latitude, lng: spot.longitude },
            map: map,
            title: spot.name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 14,
              fillColor: markerColor,
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
            label: {
              text: spot.availableSpots.toString(),
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 'bold',
            },
            animation: window.google.maps.Animation.DROP,
          });

          // Enhanced info window for parking spots
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; min-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
                <h3 style="margin: 0 0 8px 0; font-size: 17px; font-weight: 600; color: #111827;">
                  🅿️ ${spot.name}
                </h3>
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #3b82f6; font-weight: 500;">
                  📍 ${spot.area}
                </p>
                
                <div style="background: ${markerColor}15; padding: 8px; border-radius: 6px; margin-bottom: 12px;">
                  <div style="font-size: 14px; font-weight: 600; color: ${markerColor};">
                    ${statusEmoji} ${statusText}
                  </div>
                </div>

                <div style="font-size: 14px; color: #4b5563; line-height: 1.8;">
                  <div style="display: flex; align-items: center; margin: 6px 0;">
                    <span style="margin-right: 8px;">🚗</span>
                    <strong>${spot.availableSpots}</strong> of ${spot.totalSpots} spots available
                  </div>
                  <div style="display: flex; align-items: center; margin: 6px 0;">
                    <span style="margin-right: 8px;">💰</span>
                    <strong style="color: #059669;">₦${spot.pricePerHour}</strong>/hour
                  </div>
                  <div style="display: flex; align-items: center; margin: 6px 0;">
                    <span style="margin-right: 8px;">📏</span>
                    ${spot.distance} away
                  </div>
                </div>

                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                  <button 
                    onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}', '_blank')"
                    style="width: 100%; padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;"
                  >
                    🧭 Get Directions
                  </button>
                </div>
              </div>
            `,
          });

          marker.addListener('click', () => {
            // Close all other info windows
            markersRef.current.forEach(m => {
              if (m.infoWindow) m.infoWindow.close();
            });
            
            infoWindow.open(map, marker);
            onMarkerClick(spot);
            
            // Animate marker
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => marker.setAnimation(null), 750);
            
            // Center map on marker with slight offset
            map.panTo(marker.getPosition());
            map.setZoom(14);
          });

          marker.infoWindow = infoWindow;
          markersRef.current.push(marker);
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Error initializing map: ' + error.message);
        setIsLoading(false);
      }
    };

    loadGoogleMaps();

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
    };
  }, [location, parkingSpots]);

  // Update markers when selection changes
  useEffect(() => {
    if (!googleMapRef.current || !selectedParking) return;

    const selectedMarker = markersRef.current.find((marker, index) => 
      parkingSpots[index]?.id === selectedParking.id
    );

    if (selectedMarker && selectedMarker.infoWindow) {
      // Close all info windows
      markersRef.current.forEach(m => {
        if (m.infoWindow) m.infoWindow.close();
      });
      
      // Open selected marker's info window
      selectedMarker.infoWindow.open(googleMapRef.current, selectedMarker);
      googleMapRef.current.panTo(selectedMarker.getPosition());
    }
  }, [selectedParking, parkingSpots]);

  if (mapError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>⚠️ Map Error</Text>
        <Text style={styles.errorText}>{mapError}</Text>
        <Text style={styles.errorHint}>
          Please enable "Maps JavaScript API" in Google Cloud Console
        </Text>
        <Text style={styles.errorLink}>
          Visit: console.cloud.google.com/apis/library/maps-backend.googleapis.com
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#991b1b',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorHint: {
    fontSize: 13,
    color: '#7f1d1d',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  errorLink: {
    fontSize: 11,
    color: '#3b82f6',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});

export default GoogleMap;
