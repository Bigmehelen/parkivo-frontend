import React, {useState, useEffect, useMemo} from 'react';
import {Text, View, ActivityIndicator, Pressable, ScrollView, Platform, TextInput } from 'react-native';
import * as Location from 'expo-location';
import {useRouter} from 'expo-router';
import GoogleMap from '../components/GoogleMap';
import styles from '../styles/parkStyle';
import {useGetParkingSpotsQuery} from '../api/viewApi';
import { Ionicons } from '@expo/vector-icons';
import {useSelector} from 'react-redux';

const SmartPark = () => {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useSelector((state) => state.auth.user);

  const {
  data: parkingSpots = [],
  isLoading,
  isError,
  refetch,
    } = useGetParkingSpotsQuery(searchQuery, {
      skip: !searchQuery.trim(),
  });

  const filteredParkingSpots = useMemo(() => {
    if (!searchQuery.trim()) return parkingSpots;
    return parkingSpots.filter((spot) =>
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.area.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, parkingSpots]);

  const handleReserve = () => {
    if (!selectedParking) return;

    if (selectedParking.availableSpots <= 0) {
      alert('No available spots!');
      return;
    }

    router.push({
      pathname: '/reserve',
      params: {
        parkingId: selectedParking.id, 
        userId: user?.id,
        name: selectedParking.name,
        area: selectedParking.area,
        pricePerHour: selectedParking.pricePerHour,
      },
    });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => {
            setLocation({ latitude: 6.4281, longitude: 3.4219 });
          }
        );
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permission denied');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      }
    } catch (error) {
      setLocationError('Failed to get location');
    }
  };

  const getMarkerColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return '#10b981';
    if (percentage > 20) return '#f59e0b';
    return '#ef4444';
  };

  const getAvailabilityStatus = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'Plenty Available';
    if (percentage > 20) return 'Limited Spots';
    return 'Almost Full';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading parking spots...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load parking spots</Text>
        <Pressable style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Parking Lot - Lagos</Text>
        <Text style={styles.headerSubtitle}>
          Welcome{user?.name ? `, ${user?.name}` : ''} 👋 Find available parking spots across Lagos State
        </Text>
        {location && (
          <Text style={styles.locationText}>
            📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      {Platform.OS === 'web' && location && (
        <GoogleMap
          location={location}
          parkingSpots={parkingSpots}
          selectedParking={selectedParking}
          onMarkerClick={setSelectedParking}
        />
      )}
      
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
      <TextInput 
        placeholder="Search by parking name or area" 
        placeholderTextColor="#999"
        value={searchQuery} 
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />
    </View>


      <ScrollView style={styles.parkingList}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{parkingSpots.length}</Text>
            <Text style={styles.statLabel}>Nearby Spots</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {parkingSpots.reduce((sum, s) => sum + s.availableSpots, 0)}
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

        {filteredParkingSpots.map((spot) => (
          <Pressable
            key={spot.id}
            style={[
              styles.parkingCard,
              selectedParking?.id === spot.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedParking(spot)}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.parkingName}>{spot.name}</Text>
                <Text style={styles.areaText}>{spot.area}</Text>
              </View>

              <View
                style={[
                  styles.badge,
                  { backgroundColor: getMarkerColor(spot.availableSpots, spot.totalSpots) },
                ]}
              >
                <Text style={styles.badgeText}>{spot.availableSpots} spots</Text>
              </View>
            </View>

            <Text style={styles.statusText}>
              {getAvailabilityStatus(spot.availableSpots, spot.totalSpots)}
            </Text>

            {selectedParking?.id === spot.id && (
              <View style={styles.actionButtons}>
                <Pressable style={styles.reserveButton} onPress={handleReserve}>
                  <Text style={styles.reserveButtonText}>Reserve Spot</Text>
                </Pressable>
              </View>
            )}
          </Pressable>
        ))}

        {filteredParkingSpots.length === 0 && (
          <Text style={styles.emptyText}>
            No parking spaces found
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default SmartPark;
