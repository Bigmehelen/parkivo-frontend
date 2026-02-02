import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, ActivityIndicator, ScrollView, Platform, StyleSheet, useWindowDimensions, StatusBar, RefreshControl, Dimensions, Pressable } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../api/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import GoogleMap from '../components/GoogleMap';
import { useGetParkingSpotsQuery } from '../api/parkingApi';
import { useLazySearchParkingSpotsQuery } from '../api/viewApi';

import { SPACING, ELEVATION, RADIUS } from '../constants/AppTheme';
import { Typography } from '../components/ui/Typography';
import { ParkingSpotCard } from '../components/ui/ParkingSpotCard';
import { Input } from '../components/ui/Input';
import { GlassCard } from '../components/ui/GlassCard';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import Skeleton from '../components/ui/Skeleton';


const CountUp = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let totalMiliseconds = duration;
    let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;

    let timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{displayValue}</>;
};

const { height, width: screenWidth } = Dimensions.get('window');

const SmartPark = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const { colors, theme } = useTheme();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const padding = isMobile ? SPACING.l : isTablet ? SPACING.xl : SPACING.xxl;
  const statsInRow = isMobile ? 3 : isTablet ? 3 : 4;
  const mapHeight = isDesktop ? '100%' : isMobile ? 250 : 350;
  const contentMaxWidth = 1400;

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [location, setLocation] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [mapExpanded, setMapExpanded] = useState(false);
  const isSearching = searchQuery.trim().length > 0;

  const {
    data: apiParkingSpots = [],
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: parkingError,
    refetch: refetchAll,
  } = useGetParkingSpotsQuery(undefined, {
    skip: !isAuthenticated
  });

  const [
    triggerSearch,
    {
      data: searchedParkingSpots = [],
      isLoading: isLoadingSearch,
      isError: isErrorSearch,
      error: searchError,
    },
  ] = useLazySearchParkingSpotsQuery();

  const parkingSpots = isSearching ? searchedParkingSpots : (apiParkingSpots?.data || apiParkingSpots || []);
  const isLoading = (isLoadingAll || isLoadingSearch) && isAuthenticated;
  const isError = (isErrorAll || isErrorSearch) && isAuthenticated;

  useEffect(() => {
    if (parkingError) console.error("Parking API Error Details:", parkingError);
    if (searchError) console.error("Search API Error Details:", searchError);
  }, [parkingError, searchError]);

  const filteredParkingSpots = useMemo(() => {
    let spots = [...parkingSpots];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      spots = spots.filter(
        (spot) =>
          spot.name?.toLowerCase().includes(q) ||
          spot.area?.toLowerCase().includes(q)
      );
    }

    if (filterStatus === 'available') {
      spots = spots.filter(spot => spot.availableSpots > spot.totalSpots * 0.5);
    } else if (filterStatus === 'limited') {
      spots = spots.filter(spot => spot.availableSpots > 0 && spot.availableSpots <= spot.totalSpots * 0.5);
    }

    spots.sort((a, b) => {
      if (sortBy === 'distance') return (a.distance || 999) - (b.distance || 999);
      if (sortBy === 'price') return (a.pricePerHour || 999) - (b.pricePerHour || 999);
      if (sortBy === 'availability') return (b.availableSpots || 0) - (a.availableSpots || 0);
      return 0;
    });

    return spots;
  }, [searchQuery, parkingSpots, filterStatus, sortBy]);

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
          () => setLocation({ latitude: 6.4281, longitude: 3.4219 })
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
      console.error('Location error:', error);
      setLocation({ latitude: 6.4281, longitude: 3.4219 });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchAll();
    await getCurrentLocation();
    setRefreshing(false);
  }, [refetchAll]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  const handleParkingSelect = useCallback((spot) => {
    setSelectedParking(spot);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleLogout = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      dispatch(logout());
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(logout());
      router.replace('/');
    }
  };

  const handleReserve = (spot) => {
    if (!isAuthenticated) {
      alert("Please login to reserve a spot");
      router.push('/login');
      return;
    }
    router.push({
      pathname: '/reserve',
      params: {
        parkingId: spot._id,
        name: spot.name,
        area: spot.area,
        pricePerHour: spot.pricePerHour,
      },
    });
  };

  const handleNavigate = (spot) => {
    if (spot.latitude && spot.longitude) {
      const url = Platform.select({
        ios: `maps:0,0?q=${spot.latitude},${spot.longitude}`,
        android: `geo:0,0?q=${spot.latitude},${spot.longitude}`,
        web: `https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`,
      });
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      }
    }
  };

  const stats = useMemo(() => {
    const total = parkingSpots.length;
    const totalAvailable = parkingSpots.reduce((sum, spot) => sum + (spot.availableSpots || 0), 0);
    const totalCapacity = parkingSpots.reduce((sum, spot) => sum + (spot.totalSpots || 0), 0);
    const occupancyRate = totalCapacity > 0 ? Math.round(((totalCapacity - totalAvailable) / totalCapacity) * 100) : 0;
    const nearbyCount = parkingSpots.filter(spot => (spot.distance || 999) < 2).length;

    return { total, totalAvailable, occupancyRate, nearbyCount };
  }, [parkingSpots]);

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <LinearGradient colors={theme === 'dark' ? ['#000000', '#0A0A0A', '#1A1A1A'] : ['#FFFFFF', '#F9FAFB', '#F3F4F6']} style={styles.gradient}>
          <View style={styles.loadingContent}>
            <View style={[styles.loadingRing, { backgroundColor: colors.glass }]}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
            <Typography variant="h2" style={[styles.loadingText, { color: colors.text }]}>Locating Spots</Typography>
            <Typography variant="body" style={[styles.loadingSubtext, { color: colors.textSecondary }]}>
              Searching nearby parking locations...
            </Typography>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (isError) {
    const status = parkingError?.status || searchError?.status;
    const errorMsg = parkingError?.data?.message || searchError?.data?.message || "Unable to fetch parking data.";

    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <LinearGradient colors={theme === 'dark' ? ['#000000', '#0A0A0A', '#1A1A1A'] : ['#FFFFFF', '#F9FAFB', '#F3F4F6']} style={styles.gradient}>
          <View style={styles.loadingContent}>
            <View style={styles.errorIcon}>
              <Ionicons name="alert-circle-outline" size={72} color={colors.error} />
            </View>
            <Typography variant="h2" style={[styles.errorText, { color: colors.error }]}>
              {status === 'FETCH_ERROR' ? "Connection Lost" : `Error ${status || ''}`}
            </Typography>
            <Typography variant="body" style={[styles.errorSubtext, { color: colors.textSecondary }]}>
              {status === 'FETCH_ERROR'
                ? "Unable to reach the server. Check your internet connection or the server status."
                : errorMsg}
            </Typography>
            {status === 403 && (
              <Typography variant="caption" style={{ color: colors.error, marginBottom: SPACING.l, textAlign: 'center' }}>
                Tip: You might not have permission to access these parking spots.
              </Typography>
            )}
            <Pressable onPress={onRefresh} style={styles.retryButton}>
              <LinearGradient colors={colors.gradientPrimary} style={styles.retryGradient}>
                <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
                <Typography variant="button" style={styles.retryText}>Retry Connection</Typography>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={handleLogout} style={[styles.retryButton, { marginTop: SPACING.m, backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border }]}>
              <View style={styles.retryGradient}>
                <Ionicons name="log-out-outline" size={20} color={colors.text} />
                <Typography variant="button" style={{ color: colors.text }}>Log Out</Typography>
              </View>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      <LinearGradient colors={theme === 'dark' ? ['#000000', '#0A0A0A', '#1A1A1A'] : ['#F9FAFB', '#F3F4F6', '#E5E7EB']} style={styles.heroHeader}>
        <View style={styles.headerTop}>
          <View>
            <Typography variant="h1" style={[styles.heroTitle, { color: colors.text }]}>SmartPark</Typography>
            <Typography variant="body" style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
              Find & reserve parking instantly
            </Typography>
          </View>
          <View style={styles.headerActions}>
            <ThemeToggle />
            <Pressable onPress={onRefresh} style={[styles.headerButton, { backgroundColor: colors.glass, borderColor: colors.border }]}>
              <Ionicons name="refresh-outline" size={22} color={colors.text} />
            </Pressable>
            <Pressable
              onPress={handleLogout}
              style={[styles.headerButton, { backgroundColor: colors.glass, borderColor: colors.border }]}
            >
              <Ionicons name="exit-outline" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <LinearGradient colors={[colors.primary, colors.primaryDark || colors.primary]} style={styles.statGradient}>
              <Ionicons name="location" size={24} color="#FFFFFF" />
              <Typography variant="h3" style={styles.statNumber}>
                <CountUp value={stats.nearbyCount} />
              </Typography>
              <Typography variant="caption" style={styles.statLabel}>Nearby</Typography>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient colors={[colors.success, '#059669']} style={styles.statGradient}>
              <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              <Typography variant="h3" style={styles.statNumber}>
                <CountUp value={stats.totalAvailable} />
              </Typography>
              <Typography variant="caption" style={styles.statLabel}>Available</Typography>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient colors={[colors.accent || '#8B5CF6', '#7C3AED']} style={styles.statGradient}>
              <Ionicons name="speedometer" size={24} color="#FFFFFF" />
              <Typography variant="h3" style={styles.statNumber}>
                <CountUp value={stats.occupancyRate} />%
              </Typography>
              <Typography variant="caption" style={styles.statLabel}>Occupied</Typography>
            </LinearGradient>
          </View>
        </View>

        <GlassCard style={[styles.searchContainer, { borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={22} color={colors.textSecondary} />
          <Input
            placeholder="Search by location or area..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor={colors.textTertiary}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={22} color={colors.textSecondary} />
            </Pressable>
          )}
        </GlassCard>
      </LinearGradient>

      <View style={[styles.mainLayout, isDesktop && styles.desktopLayout]}>
        <View style={[
          styles.mapContainer,
          isDesktop ? styles.desktopMap : { height: mapHeight },
          mapExpanded && styles.mapExpanded
        ]}>
          {location ? (
            <GoogleMap
              parkingSpots={filteredParkingSpots}
              selectedParking={selectedParking}
              onMarkerClick={handleParkingSelect}
              location={location}
              theme={theme}
            />
          ) : (
            <View style={[styles.mapPlaceholder, { backgroundColor: colors.surface }]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Typography variant="caption" style={{ color: colors.textSecondary, marginTop: SPACING.s }}>
                Initializing map...
              </Typography>
            </View>
          )}

          <Pressable
            onPress={() => setMapExpanded(!mapExpanded)}
            style={styles.mapToggle}
          >
            <GlassCard style={[styles.mapToggleCard, { borderColor: colors.border }]}>
              <Ionicons
                name={mapExpanded ? "contract-outline" : "expand-outline"}
                size={18}
                color={colors.primary}
              />
              <Typography variant="caption" style={[styles.mapToggleText, { color: colors.primary }]}>
                {mapExpanded ? 'Collapse' : 'Expand'}
              </Typography>
            </GlassCard>
          </Pressable>

          <Pressable onPress={getCurrentLocation} style={styles.mapFAB}>
            <LinearGradient colors={colors.gradientPrimary} style={styles.fabGradient}>
              <Ionicons name="navigate" size={24} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>
        </View>

        <View style={[
          styles.contentContainer,
          isDesktop && styles.desktopContent,
          { backgroundColor: colors.background, shadowColor: '#000' }
        ]}>

          <View style={[styles.tabContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Pressable
              onPress={() => setFilterStatus('all')}
              style={[styles.tab, filterStatus === 'all' && styles.tabActive]}
            >
              {filterStatus === 'all' && (
                <LinearGradient
                  colors={colors.gradientPrimary}
                  style={styles.tabActiveGradient}
                />
              )}
              <Typography
                variant="label"
                style={[styles.tabText, filterStatus === 'all' ? styles.tabTextActive : { color: colors.textSecondary }]}
              >
                All ({filteredParkingSpots.length})
              </Typography>
            </Pressable>

            <Pressable
              onPress={() => setFilterStatus('available')}
              style={[styles.tab, filterStatus === 'available' && styles.tabActive]}
            >
              {filterStatus === 'available' && (
                <LinearGradient
                  colors={colors.gradientSuccess || ['#10B981', '#059669']}
                  style={styles.tabActiveGradient}
                />
              )}
              <Typography
                variant="label"
                style={[styles.tabText, filterStatus === 'available' ? styles.tabTextActive : { color: colors.textSecondary }]}
              >
                Available
              </Typography>
            </Pressable>

            <Pressable
              onPress={() => setFilterStatus('limited')}
              style={[styles.tab, filterStatus === 'limited' && styles.tabActive]}
            >
              {filterStatus === 'limited' && (
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.tabActiveGradient}
                />
              )}
              <Typography
                variant="label"
                style={[styles.tabText, filterStatus === 'limited' ? styles.tabTextActive : { color: colors.textSecondary }]}
              >
                Limited
              </Typography>
            </Pressable>
          </View>

          <View style={styles.sortRow}>
            <Typography variant="caption" style={[styles.sortLabel, { color: colors.textTertiary }]}>Sort by:</Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortOptions}>
              {[
                { key: 'distance', icon: 'navigate-outline', label: 'Distance' },
                { key: 'price', icon: 'cash-outline', label: 'Price' },
                { key: 'availability', icon: 'car-outline', label: 'Spots' },
              ].map((option) => (
                <Pressable
                  key={option.key}
                  onPress={() => setSortBy(option.key)}
                  style={[styles.sortChip, { backgroundColor: colors.glass, borderColor: sortBy === option.key ? colors.primary : colors.border }]}
                >
                  <Ionicons
                    name={option.icon}
                    size={14}
                    color={sortBy === option.key ? colors.primary : colors.textSecondary}
                  />
                  <Typography
                    variant="caption"
                    style={[styles.sortChipText, { color: sortBy === option.key ? colors.primary : colors.textSecondary }]}
                  >
                    {option.label}
                  </Typography>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <ScrollView
            style={styles.listScroll}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          >
            {filteredParkingSpots.length > 0 ? (
              filteredParkingSpots.map((spot) => (
                <ParkingSpotCard
                  key={spot._id}
                  name={spot.name}
                  area={spot.area}
                  availableSpots={spot.availableSpots}
                  totalSpots={spot.totalSpots}
                  pricePerHour={spot.pricePerHour}
                  distance={spot.distance}
                  isSelected={selectedParking?._id === spot._id}
                  onPress={() => handleParkingSelect(spot)}
                  onReserve={() => handleReserve(spot)}
                  onNavigate={() => handleNavigate(spot)}
                />
              ))
            ) : isLoading ? (

              <View style={{ gap: SPACING.m }}>
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} width="100%" height={120} borderRadius={RADIUS.l} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <LinearGradient colors={theme === 'dark' ? ['#1A1A1A', '#0A0A0A'] : ['#F3F4F6', '#E5E7EB']} style={styles.emptyGradient}>
                  <Ionicons name="search-outline" size={64} color={colors.textTertiary} />
                  <Typography variant="h3" style={[styles.emptyTitle, { color: colors.text }]}>No Results Found</Typography>
                  <Typography variant="body" style={[styles.emptyText, { color: colors.textSecondary }]}>
                    Try adjusting your search or filters
                  </Typography>
                  {isSearching && (
                    <Pressable onPress={() => setSearchQuery('')} style={[styles.clearButton, { backgroundColor: colors.primary }]}>
                      <Typography variant="button" style={styles.clearButtonText}>Clear Search</Typography>
                    </Pressable>
                  )}
                </LinearGradient>
              </View>
            )}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    ...ELEVATION.prominent,
  },
  loadingText: {
    marginBottom: SPACING.s,
  },
  loadingSubtext: {
    textAlign: 'center',
  },
  errorIcon: {
    marginBottom: SPACING.xl,
  },
  errorText: {
    marginBottom: SPACING.s,
  },
  errorSubtext: {
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  retryButton: {
    borderRadius: RADIUS.l,
    overflow: 'hidden',
    ...ELEVATION.floating,
  },
  retryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
  },
  retryText: {
    color: '#FFFFFF',
  },
  heroHeader: {
    paddingHorizontal: SPACING.l,
    paddingTop: Platform.select({ web: SPACING.xl, default: SPACING.xxl }),
    paddingBottom: SPACING.l,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  heroTitle: {
    marginBottom: SPACING.xs,
    fontSize: Platform.select({ web: 36, default: 32 }),
  },
  heroSubtitle: {
    fontSize: Platform.select({ web: 16, default: 14 }),
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.s,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  quickStats: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginBottom: SPACING.l,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    borderRadius: RADIUS.l,
    overflow: 'hidden',
    ...ELEVATION.card,
  },
  statGradient: {
    padding: SPACING.m,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statNumber: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    gap: SPACING.m,
    marginBottom: SPACING.l,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    fontSize: Platform.select({ web: 16, default: 14 }),
  },
  mapContainer: {
    minHeight: 200,
    maxHeight: 400,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapExpanded: {
    height: height * 0.5,
  },
  mapToggle: {
    position: 'absolute',
    top: SPACING.m,
    left: SPACING.m,
    zIndex: 10,
  },
  mapToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  mapToggleText: {
    fontSize: 11,
  },
  mapFAB: {
    position: 'absolute',
    bottom: SPACING.m,
    right: SPACING.m,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    ...ELEVATION.floating,
  },
  fabGradient: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    marginTop: -SPACING.l,
    paddingTop: SPACING.l,
    ...ELEVATION.modal,
    width: '100%',
    alignSelf: 'center',
    zIndex: 5,
  },
  mainLayout: {
    flex: 1,
  },
  desktopLayout: {
    flexDirection: 'row',
  },
  desktopMap: {
    flex: 0.6,
    height: '100%',
  },
  desktopContent: {
    flex: 0.4,
    marginTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.05)',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 'auto',
    marginBottom: SPACING.l,
    borderRadius: RADIUS.l,
    padding: 4,
    gap: 4,
    maxWidth: 1200,
    width: Platform.select({ web: '95%', default: screenWidth - (SPACING.l * 2) }),
    alignSelf: 'center',
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    minWidth: 80,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  tabActive: {
    // Active state handled by gradient overlay
  },
  tabActiveGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  tabText: {
    fontSize: 12,
    position: 'relative',
    zIndex: 1,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.l,
    marginBottom: SPACING.m,
  },
  sortLabel: {
    marginRight: SPACING.s,
  },
  sortOptions: {
    gap: SPACING.s,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: RADIUS.m,
    borderWidth: 1,
  },
  sortChipText: {
    fontSize: 11,
  },
  listScroll: {
    flex: 1,
    paddingHorizontal: SPACING.l,
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyGradient: {
    width: '100%',
    padding: SPACING.xxl,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    gap: SPACING.m,
  },
  emptyTitle: {
    marginTop: SPACING.m,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  clearButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.l,
  },
  clearButtonText: {
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 100,
  },
});

export default SmartPark;
