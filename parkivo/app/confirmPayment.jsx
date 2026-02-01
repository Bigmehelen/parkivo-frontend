import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { SPACING, RADIUS, ELEVATION } from '../constants/AppTheme';
import { Typography } from '../components/ui/Typography';
import { GradientButton } from '../components/ui/GradientButton';
import { GlassCard } from '../components/ui/GlassCard';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useWindowDimensions } from 'react-native';

const ConfirmPayment = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, theme } = useTheme();

  // Responsive breakpoints
  const isDesktop = width >= 1024;
  const contentMaxWidth = 800;
  const params = useLocalSearchParams();
  const user = useSelector((state) => state.auth.user);

  const plateNumber = params.plateNumber || "";
  const startDate = params.startDate || "";
  const startTime = params.startTime || "";
  const endDate = params.endDate || "";
  const endTime = params.endTime || "";
  const isPaid = true;
  const totalAmount = params.totalAmount || 0;

  const qrData = useMemo(() => {
    const data = {
      user: user?.username,
      spot: params.name,
      plate: plateNumber,
      arrival: `${startDate} ${startTime}`,
      departure: `${endDate} ${endTime}`,
      paid: true,
      amount: totalAmount
    };
    return encodeURIComponent(JSON.stringify(data));
  }, [user, params, plateNumber, startDate, startTime, endDate, endTime, totalAmount]);

  if (isPaid) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={theme === 'dark' ? ['#000000', '#0A0A0A', '#1A1A1A'] : ['#FFFFFF', '#F9FAFB', '#F3F4F6']}
          style={styles.gradient}
        >
          <ScrollView
            contentContainerStyle={[styles.scrollContent, isDesktop && { paddingVertical: SPACING.huge }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.centerWrapper, { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}>
              {/* Header with ThemeToggle */}
              <View style={styles.header}>
                <ThemeToggle />
              </View>

              {/* Success Icon */}
              <View style={styles.successContainer}>
                <View style={styles.successBadge}>
                  <Ionicons name="checkmark-circle" size={80} color={colors.success} />
                </View>
                <Typography variant="h1" style={[styles.successTitle, { color: colors.success }]}>Reservation Confirmed!</Typography>
                <Typography variant="body" style={[styles.successSubtitle, { color: colors.textSecondary }]}>
                  Show this QR code to the parking attendant
                </Typography>
              </View>

              {/* QR Code Card */}
              <GlassCard style={styles.qrCard}>
                <View style={[styles.qrContainer, { backgroundColor: '#FFFFFF' }]}>
                  <Image
                    source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrData}` }}
                    style={styles.qrImage}
                  />
                </View>
                <Typography variant="caption" style={[styles.qrLabel, { color: colors.textTertiary }]}>
                  Scan at entry gate
                </Typography>
              </GlassCard>

              {/* Details Card */}
              <GlassCard style={styles.detailsCard}>
                <Typography variant="h3" style={[styles.detailsTitle, { color: colors.text }]}>Reservation Details</Typography>

                <View style={styles.detailRow}>
                  <View style={[styles.detailIcon, { backgroundColor: colors.glass }]}>
                    <Ionicons name="person" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Typography variant="caption" style={[styles.detailLabel, { color: colors.textTertiary }]}>Guest Name</Typography>
                    <Typography variant="body" style={[styles.detailValue, { color: colors.text }]}>
                      {user?.username || 'Guest'}
                    </Typography>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={[styles.detailIcon, { backgroundColor: colors.glass }]}>
                    <Ionicons name="location" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Typography variant="caption" style={[styles.detailLabel, { color: colors.textTertiary }]}>Parking Location</Typography>
                    <Typography variant="body" style={[styles.detailValue, { color: colors.text }]}>{params.name}</Typography>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={[styles.detailIcon, { backgroundColor: colors.glass }]}>
                    <Ionicons name="car" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Typography variant="caption" style={[styles.detailLabel, { color: colors.textTertiary }]}>Plate Number</Typography>
                    <Typography variant="body" style={[styles.detailValue, { color: colors.text }]}>{plateNumber}</Typography>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={[styles.detailIcon, { backgroundColor: colors.glass }]}>
                    <Ionicons name="time" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Typography variant="caption" style={[styles.detailLabel, { color: colors.textTertiary }]}>Valid Until</Typography>
                    <Typography variant="body" style={[styles.detailValue, { color: colors.text }]}>
                      {endDate} at {endTime}
                    </Typography>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.amountRow}>
                  <Typography variant="h3" style={{ color: colors.text }}>Total Paid</Typography>
                  <Typography variant="h2" style={[styles.amountValue, { color: colors.success }]}>₦{totalAmount}</Typography>
                </View>
              </GlassCard>

              {/* Action Buttons */}
              <GradientButton
                title="Back to Dashboard"
                onPress={() => router.push('/smartpark')}
                style={styles.button}
                icon={<Ionicons name="home" size={20} color="#FFFFFF" />}
              />

              <View style={styles.bottomSpacer} />
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.l,
    paddingBottom: SPACING.xxxl,
  },
  centerWrapper: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: SPACING.l,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  successBadge: {
    marginBottom: SPACING.l,
    ...ELEVATION.glowSuccess,
  },
  successTitle: {
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  successSubtitle: {
    textAlign: 'center',
  },
  qrCard: {
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: SPACING.l,
    borderRadius: RADIUS.l,
    marginBottom: SPACING.m,
    ...ELEVATION.prominent,
  },
  qrImage: {
    width: 250,
    height: 250,
  },
  qrLabel: {
    textAlign: 'center',
  },
  detailsCard: {
    padding: SPACING.xl,
    marginBottom: SPACING.l,
  },
  detailsTitle: {
    marginBottom: SPACING.l,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.l,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    marginBottom: SPACING.xs,
  },
  detailValue: {
  },
  divider: {
    height: 1,
    marginVertical: SPACING.l,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountValue: {
  },
  button: {
    marginBottom: SPACING.m,
  },
  bottomSpacer: {
    height: SPACING.xxl,
  },
});

export default ConfirmPayment;