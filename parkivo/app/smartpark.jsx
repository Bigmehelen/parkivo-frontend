import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Text, View, ActivityIndicator, Pressable, ScrollView, Platform, TextInput, Linking, FlatList} from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import GoogleMap from '../components/GoogleMap';
import { createStyle } from '../styles/parkStyle';
import { useGetParkingSpotsQuery } from '../api/parkingApi';
import { useLazySearchParkingSpotsQuery } from '../api/viewApi';

const SmartPark = () => {
  const router = useRouter();
  const {width} = useWindowDimensions();
  const isTablet = width >= 768;
  const styles = createStyle(isTablet);
  const user = useSelector((state) => state.auth.user);

  const [location, setLocation] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isSearching = searchQuery.trim().length > 0;

  const {
    data: allParkingSpots = [],
    isLoading: isLoadingAll,
    isError: isErrorAll,
    refetch: refetchAll,
  } = useGetParkingSpotsQuery();

  const [
    triggerSearch,
    {
      data: searchedParkingSpots = [],
      isLoading: isLoadingSearch,
      isError: isErrorSearch,
    },
  ] = useLazySearchParkingSpotsQuery();

  const parkingSpots = isSearching ? searchedParkingSpots : allParkingSpots;
  const isLoading = isLoadingAll || isLoadingSearch;
  const isError = isErrorAll || isErrorSearch;

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    try {
      await triggerSearch(searchQuery).unwrap();
    } catch (err) {
      console.error('Search failed:', err);
    }
  }, [searchQuery, triggerSearch]);

  const filteredParkingSpots = useMemo(() => {
    if (!searchQuery.trim()) return parkingSpots;

    const q = searchQuery.toLowerCase();
    return (parkingSpots).filter(
      (spot) =>
        spot.name?.toLowerCase().includes(q) ||
        spot.area?.toLowerCase().includes(q)
    );
  }, [searchQuery, parkingSpots]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        navigator.geolocation.getCurrentPosition(
          (position) =>
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          () =>
            setLocation({ latitude: 6.4281, longitude: 3.4219 })
        );
      } else {
        const { status } =
          await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permission denied');
          return;
        }

     const currentLocation =
          await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      }
    } catch {
      setLocationError('Failed to get location');
    }
  };

  const getMarkerColor = (available = 0, total = 0) => {
    if (!total) return '#6b7280';
    const percent = (available / total) * 100;
    if (percent > 50) return '#10b981';
    if (percent > 20) return '#f59e0b';
    return '#ef4444';
  };

  const getAvailabilityStatus = (available = 0, total = 0) => {
    if (!total) return 'Unavailable';
    const percent = (available / total) * 100;
    if (percent > 50) return 'Plenty Available';
    if (percent > 20) return 'Limited Spots';
    return 'Almost Full';
  };

  const handleReserve = () => {
    if (!selectedParking) return;

    if (Number(selectedParking.availableSpots) <= 0) {
      alert('No available spots!');
      return;
    }

    router.replace({
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

  const handleDirections = (spot) => {
    if (!spot?.latitude || !spot?.longitude) {
      alert('Location not available for this parking spot');
      return;
    }

    const destination = `${spot.latitude},${spot.longitude}`;
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${destination}`
        : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    Linking.openURL(url).catch(() =>
      alert('Unable to open maps')
    );
  };

  const safePrices = parkingSpots
    .map((s) => Number(s.pricePerHour))
    .filter((n) => !Number.isNaN(n));

  const minPrice = safePrices.length
    ? Math.min(...safePrices)
    : 0;

  const totalAvailable = parkingSpots.reduce(
    (sum, s) => sum + (Number(s.availableSpots) || 0),
    0
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}> Loading parking spots... </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>  Failed to load parking spots </Text>
        <Pressable
          style={styles.retryButton}
          onPress={refetchAll}
        >
        <Text style={styles.retryButtonText}> Retry </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/')} style={styles.backButton}>
          <Text style={styles.backText}> ← Back to Home </Text>
        </Pressable>
        <Text style={styles.headerTitle}> Smart Parking Lot - Lagos </Text>
        <Text style={styles.headerSubtitle}>
          Welcome {user?.name} — Find parking near you
        </Text>

        {location && (
          <Text style={styles.locationText}>
            📍 {location.latitude.toFixed(4)},{' '}
            {location.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      {Platform.OS === 'web' && location && (
        <GoogleMap location={location} parkingSpots={parkingSpots} selectedParking={selectedParking}
          onMarkerClick={setSelectedParking}
        />
      )}

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search by parking name or area"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        <Pressable
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.parkingList}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {parkingSpots.length}
            </Text>
            <Text style={styles.statLabel}>Nearby Spots</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {totalAvailable}
            </Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₦{minPrice}</Text>
            <Text style={styles.statLabel}>From / hour</Text>
          </View>
        </View>

        <Text style={styles.listTitle}>
          Available Parking Spots
        </Text>

        {filteredParkingSpots.map((spot) => (
          <Pressable
            key={spot.id}
            style={[
              styles.parkingCard,
              selectedParking?.id === spot.id &&
                styles.selectedCard,
            ]}
            onPress={() => setSelectedParking(spot)}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.parkingName}>
                  {spot.name}
                </Text>
                <Text style={styles.areaText}>
                  {spot.area}
                </Text>
              </View>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: getMarkerColor(
                      Number(spot.availableSpots),
                      Number(spot.totalSpots)
                    ),
                  },
                ]}
              >
                <Text style={styles.badgeText}>
                  {Number(spot.availableSpots) || 0} spots
                </Text>
              </View>
            </View>

            <Text style={styles.statusText}>
              {getAvailabilityStatus(
                Number(spot.availableSpots),
                Number(spot.totalSpots)
              )}
            </Text>

            {selectedParking?.id === spot.id && (
              <View style={styles.actionButtons}>
                <Pressable style={styles.reserveButton} onPress={handleReserve} >
                  <Text style={styles.reserveButtonText}> Reserve Spot </Text>
                </Pressable>

                <Pressable style={styles.directionsButton} onPress={() =>
                    handleDirections(spot)
                  }
                >
                  <Text style={styles.directionsButtonText}> Directions </Text>
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
