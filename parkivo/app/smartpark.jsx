import { useState, useEffect } from 'react';
import {Text, View, ActivityIndicator, Pressable, ScrollView, Platform} from 'react-native';
import * as Location from 'expo-location';
import GoogleMap from '../components/GoogleMap';
import styles from '../styles/parkStyle';
import {useRouter} from 'expo-router';

const SmartPark = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const router = useRouter();
  const [parkingSpots] = useState([
    {
      id: 1,
      name: 'Victoria Island Parking Plaza',
      latitude: 6.4281,
      longitude: 3.4219,
      availableSpots: 25,
      totalSpots: 80,
      pricePerHour: 500,
      distance: '0.5 km',
      area: 'Victoria Island'
    },
    {
      id: 2,
      name: 'Lekki Phase 1 Mall Parking',
      latitude: 6.4474,
      longitude: 3.4700,
      availableSpots: 45,
      totalSpots: 150,
      pricePerHour: 400,
      distance: '1.2 km',
      area: 'Lekki'
    },
    {
      id: 3,
      name: 'Ikeja City Mall Garage',
      latitude: 6.6018,
      longitude: 3.3515,
      availableSpots: 12,
      totalSpots: 100,
      pricePerHour: 300,
      distance: '2.5 km',
      area: 'Ikeja'
    },
    {
      id: 4,
      name: 'Eko Hotel Parking',
      latitude: 6.4281,
      longitude: 3.4304,
      availableSpots: 8,
      totalSpots: 60,
      pricePerHour: 800,
      distance: '0.8 km',
      area: 'Victoria Island'
    },
    {
      id: 5,
      name: 'Palms Shopping Mall',
      latitude: 6.4474,
      longitude: 3.4647,
      availableSpots: 35,
      totalSpots: 200,
      pricePerHour: 350,
      distance: '1.5 km',
      area: 'Lekki'
    },
    {
      id: 6,
      name: 'Ikoyi Street Parking Zone',
      latitude: 6.4541,
      longitude: 3.4316,
      availableSpots: 5,
      totalSpots: 30,
      pricePerHour: 600,
      distance: '1.0 km',
      area: 'Ikoyi'
    },
    {
      id: 7,
      name: 'Surulere Stadium Parking',
      latitude: 6.4969,
      longitude: 3.3612,
      availableSpots: 50,
      totalSpots: 120,
      pricePerHour: 250,
      distance: '3.2 km',
      area: 'Surulere'
    },
    {
      id: 8,
      name: 'Yaba Tech Park',
      latitude: 6.5151,
      longitude: 3.3727,
      availableSpots: 18,
      totalSpots: 70,
      pricePerHour: 200,
      distance: '2.8 km',
      area: 'Yaba'
    }
  ]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleReserve = () => {
  if (selectedParking && selectedParking.availableSpots > 0) {
    router.push({
      pathname: '/reserve',
      
      params: { 
        name: selectedParking.name, 
        area: selectedParking.area, 
        pricePerHour: selectedParking.pricePerHour 
      }
    });
  }else {
      alert('No available spots!');
    }
};

  const getCurrentLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        // For web, use browser geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              setLoading(false);
            },
            (error) => {
              console.error('Geolocation error:', error);
              // Fallback to Lagos (Victoria Island) for demo
              setLocation({
                latitude: 6.4281,
                longitude: 3.4219,
              });
              setLoading(false);
            }
          );
        } else {
          // Fallback to Lagos location
          setLocation({
            latitude: 6.4281,
            longitude: 3.4219,
          });
          setLoading(false);
        }
      } else {
        // For native platforms
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Location error:', error);
      setErrorMsg('Error getting location');
      setLoading(false);
    }
  };

  const getMarkerColor = (availableSpots, totalSpots) => {
    const percentage = (availableSpots / totalSpots) * 100;
    if (percentage > 50) return '#10b981'; // Green
    if (percentage > 20) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getAvailabilityStatus = (availableSpots, totalSpots) => {
    const percentage = (availableSpots / totalSpots) * 100;
    if (percentage > 50) return 'Plenty Available';
    if (percentage > 20) return 'Limited Spots';
    return 'Almost Full';
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <Pressable style={styles.retryButton} onPress={getCurrentLocation}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Parking - Lagos</Text>
        <Text style={styles.headerSubtitle}>Find available parking spots across Lagos State</Text>
        {location && (
          <Text style={styles.locationText}>
            📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      {/* Interactive Google Map */}
      {Platform.OS === 'web' && location && (
        <GoogleMap 
          location={location}
          parkingSpots={parkingSpots}
          onMarkerClick={setSelectedParking}
          selectedParking={selectedParking}
        />
      )}

      <ScrollView style={styles.parkingList}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{parkingSpots.length}</Text>
            <Text style={styles.statLabel}>Nearby Spots</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {parkingSpots.reduce((sum, spot) => sum + spot.availableSpots, 0)}
            </Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              ₦{Math.min(...parkingSpots.map(s => s.pricePerHour))}
            </Text>
            <Text style={styles.statLabel}>From/hour</Text>
          </View>
        </View>

        <Text style={styles.listTitle}>Available Parking Spots</Text>
        
        {parkingSpots.map((spot) => (
          <Pressable
            key={spot.id}
            style={[
              styles.parkingCard,
              selectedParking?.id === spot.id && styles.selectedCard
            ]}
            onPress={() => setSelectedParking(spot)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.nameContainer}>
                <Text style={styles.parkingName}>{spot.name}</Text>
                <Text style={styles.areaText}>{spot.area}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: getMarkerColor(spot.availableSpots, spot.totalSpots) }]}>
                <Text style={styles.badgeText}>{spot.availableSpots} spots</Text>
              </View>
            </View>
            
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: getMarkerColor(spot.availableSpots, spot.totalSpots) }]} />
              <Text style={styles.statusText}>
                {getAvailabilityStatus(spot.availableSpots, spot.totalSpots)}
              </Text>
            </View>

            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📍</Text>
                <Text style={styles.detailText}>{spot.distance} away</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>💰</Text>
                <Text style={styles.detailText}>₦{spot.pricePerHour}/hour</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>🚗</Text>
                <Text style={styles.detailText}>{spot.availableSpots}/{spot.totalSpots} available</Text>
              </View>
            </View>

            {selectedParking?.id === spot.id && (
              <View style={styles.actionButtons}>
                <Pressable style={styles.reserveButton} onPress={handleReserve}>
                  <Text style={styles.reserveButtonText}>Reserve Spot</Text>
                </Pressable>
                <Pressable 
                  style={styles.directionsButton}
                  onPress={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;
                    if (typeof window !== 'undefined') {
                      window.open(url, '_blank');
                    }
                  }}
                >
                  <Text style={styles.directionsButtonText}>Get Directions</Text>
                </Pressable>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};
export default SmartPark;
