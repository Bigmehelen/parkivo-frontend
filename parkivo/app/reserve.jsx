import React, { useState, useMemo } from 'react';
import { View, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { SPACING, RADIUS, ELEVATION } from '../constants/AppTheme';
import { Typography } from '../components/ui/Typography';
import { GradientButton } from '../components/ui/GradientButton';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { useWindowDimensions } from 'react-native';

const ReserveSpot = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, theme } = useTheme();

  // Responsive breakpoints
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const isMobile = width < 768;

  const contentMaxWidth = 1200;
  const params = useLocalSearchParams();
  const user = useSelector((state) => state.auth.user);

  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000));
  const [plateNumber, setPlateNumber] = useState('');
  const [picker, setPicker] = useState({ show: false, mode: 'date', target: 'start' });

  const formatDate = (date) => (date && !isNaN(date.getTime())) ? date.toISOString().split('T')[0] : "";
  const formatTime = (date) => (date && !isNaN(date.getTime())) ? date.toTimeString().slice(0, 5) : "";

  const onPickerChange = (event, selectedDate) => {
    if (Platform.OS !== 'ios') setPicker(prev => ({ ...prev, show: false }));
    if (!selectedDate) return;

    if (picker.target === 'start') {
      setStartDateTime(selectedDate);
      if (selectedDate >= endDateTime) {
        const nextHour = new Date(selectedDate.getTime() + 60 * 60 * 1000);
        setEndDateTime(nextHour);
      }
    } else {
      setEndDateTime(selectedDate);
    }
  };

  const calculation = useMemo(() => {
    const diffInMs = endDateTime.getTime() - startDateTime.getTime();

    if (diffInMs <= 0) {
      return { totalHours: "0.0", days: 0, remainingHours: 0, subtotal: 0, totalAmount: 0, isValid: false };
    }

    const totalHoursRaw = diffInMs / (1000 * 60 * 60);
    const totalHoursToBill = Math.ceil(totalHoursRaw);

    const days = Math.floor(totalHoursRaw / 24);
    const remainingHours = Math.floor(totalHoursRaw % 24);

    const serviceCharge = 50;
    const pricePerHour = Number(params.pricePerHour) || 0;

    const subtotal = totalHoursToBill * pricePerHour;
    const totalAmount = subtotal + serviceCharge;

    return {
      totalHours: totalHoursRaw.toFixed(1),
      days,
      remainingHours,
      subtotal,
      totalAmount,
      isValid: startDateTime >= new Date(Date.now() - 300000) && endDateTime > startDateTime
    };
  }, [startDateTime, endDateTime, params.pricePerHour]);

  const handlePayment = () => {
    if (calculation.isValid) {
      router.push({
        pathname: '/confirmPayment',
        params: {
          ...params,
          startDate: formatDate(startDateTime),
          startTime: formatTime(startDateTime),
          endDate: formatDate(endDateTime),
          endTime: formatTime(endDateTime),
          plateNumber: plateNumber,
          totalAmount: calculation.totalAmount
        }
      });
    }
  };

  const WebDateTimeInput = ({ type, target }) => {
    const currentVal = target === 'start' ? startDateTime : endDateTime;
    const value = type === 'date' ? formatDate(currentVal) : formatTime(currentVal);

    let minVal = undefined;
    if (type === 'date') {
      minVal = target === 'start' ? formatDate(new Date()) : formatDate(startDateTime);
    } else if (type === 'time') {
      const todayStr = formatDate(new Date());
      const arrivalDateStr = formatDate(startDateTime);
      const selectedDateStr = formatDate(currentVal);

      if (target === 'start' && selectedDateStr === todayStr) {
        minVal = formatTime(new Date());
      } else if (target === 'end' && selectedDateStr === arrivalDateStr) {
        minVal = formatTime(startDateTime);
      }
    }

    if (Platform.OS === 'web') {
      return (
        <input
          type={type}
          value={value}
          min={minVal}
          onChange={(e) => {
            const val = e.target.value;
            if (!val) return;
            const newDate = new Date(currentVal);
            if (type === 'date') {
              const [y, m, d] = val.split('-');
              newDate.setFullYear(parseInt(y), parseInt(m) - 1, parseInt(d));
            } else {
              const [hh, mm] = val.split(':');
              newDate.setHours(parseInt(hh), parseInt(mm));
            }

            if (target === 'start') {
              setStartDateTime(newDate);
              if (newDate >= endDateTime) {
                setEndDateTime(new Date(newDate.getTime() + 60 * 60 * 1000));
              }
            } else {
              setEndDateTime(newDate);
            }
          }}
          style={webInputStyle}
        />
      );
    }

    return (
      <Pressable
        onPress={() => setPicker({ show: true, mode: type, target })}
        style={[styles.dateTimeButton, { backgroundColor: colors.glass, borderColor: colors.border }]}
      >
        <Typography variant="body" style={[styles.dateTimeText, { color: colors.text }]}>{value}</Typography>
      </Pressable>
    );
  };

  const webInputStyle = {
    padding: '14px',
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
    fontSize: '16px',
    backgroundColor: colors.glass,
    color: colors.text,
    width: '100%',
    height: '52px',
    outline: 'none',
    fontFamily: 'Rubik_400Regular',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={theme === 'dark' ? ['#000000', '#0A0A0A', '#1A1A1A'] : ['#FFFFFF', '#F9FAFB', '#F3F4F6']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerRow}>
                <Pressable onPress={() => router.push('/smartpark')} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color={colors.text} />
                  <Typography variant="body" style={[styles.backText, { color: colors.textSecondary }]}>Back</Typography>
                </Pressable>
                <ThemeToggle />
              </View>
              <Typography variant="h1" style={[styles.title, { color: colors.text }]}>Reserve Spot</Typography>
            </View>

            <View style={[styles.mainLayout, isDesktop && styles.desktopLayout]}>
              {/* Left Column: Spot Info (Desktop) */}
              <View style={[styles.leftColumn, isDesktop && styles.desktopLeftColumn]}>
                {/* Spot Summary Card */}
                <GlassCard style={styles.summaryCard}>
                  <View style={styles.spotHeader}>
                    <View style={[styles.spotIcon, { backgroundColor: colors.glass }]}>
                      <Ionicons name="location" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.spotInfo}>
                      <Typography variant="h3" style={[styles.spotName, { color: colors.text }]}>{params.name}</Typography>
                      <Typography variant="body" style={[styles.spotArea, { color: colors.textSecondary }]}>{params.area}</Typography>
                    </View>
                  </View>
                  <View style={[styles.priceRow, { borderTopColor: colors.border }]}>
                    <Typography variant="label" style={[styles.priceLabel, { color: colors.textTertiary }]}>RATE</Typography>
                    <Typography variant="h2" style={[styles.priceValue, { color: colors.primary }]}>
                      ₦{params.pricePerHour}/hr
                    </Typography>
                  </View>
                </GlassCard>

                {/* Price Breakdown */}
                <GlassCard style={styles.breakdownCard}>
                  <Typography variant="h3" style={[styles.sectionTitle, { color: colors.text }]}>Price Breakdown</Typography>

                  <View style={styles.breakdownRow}>
                    <Typography variant="body" style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Duration</Typography>
                    <Typography variant="body" style={[styles.breakdownValue, { color: colors.text }]}>
                      {calculation.days > 0 ? `${calculation.days}d ` : ''}
                      {calculation.remainingHours > 0 ? `${calculation.remainingHours}h` : ''}
                      {calculation.days === 0 && calculation.remainingHours === 0 ? '<1h' : ''}
                    </Typography>
                  </View>

                  <View style={styles.breakdownRow}>
                    <Typography variant="body" style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Subtotal</Typography>
                    <Typography variant="body" style={[styles.breakdownValue, { color: colors.text }]}>₦{calculation.subtotal}</Typography>
                  </View>

                  <View style={styles.breakdownRow}>
                    <Typography variant="body" style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Service Fee</Typography>
                    <Typography variant="body" style={[styles.breakdownValue, { color: colors.text }]}>₦50</Typography>
                  </View>

                  <View style={[styles.divider, { backgroundColor: colors.border }]} />

                  <View style={styles.totalRow}>
                    <Typography variant="h3" style={{ color: colors.text }}>Total</Typography>
                    <Typography variant="h2" style={[styles.totalAmount, { color: colors.primary }]}>₦{calculation.totalAmount}</Typography>
                  </View>
                </GlassCard>
              </View>

              {/* Right Column: Form (Desktop) */}
              <View style={[styles.rightColumn, isDesktop && styles.desktopRightColumn]}>
                {/* Date & Time Selection */}
                <GlassCard style={styles.dateTimeCard}>
                  <Typography variant="h3" style={[styles.sectionTitle, { color: colors.text }]}>Parking Duration</Typography>

                  {/* Timeline Visual */}
                  <View style={styles.timeline}>
                    <View style={styles.timelineItem}>
                      <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                      <Typography variant="label" style={[styles.timelineLabel, { color: colors.textTertiary }]}>ARRIVAL</Typography>
                    </View>
                    <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                    <View style={styles.timelineItem}>
                      <View style={[styles.timelineDot, styles.timelineDotEnd, { backgroundColor: colors.success }]} />
                      <Typography variant="label" style={[styles.timelineLabel, { color: colors.textTertiary }]}>DEPARTURE</Typography>
                    </View>
                  </View>

                  {/* Arrival DateTime */}
                  <View style={styles.dateTimeSection}>
                    <View style={styles.dateTimeRow}>
                      <View style={{ flex: 2 }}>
                        <Typography variant="caption" style={[styles.inputLabel, { color: colors.textTertiary }]}>Date</Typography>
                        <WebDateTimeInput type="date" target="start" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Typography variant="caption" style={[styles.inputLabel, { color: colors.textTertiary }]}>Time</Typography>
                        <WebDateTimeInput type="time" target="start" />
                      </View>
                    </View>
                  </View>

                  {/* Departure DateTime */}
                  <View style={styles.dateTimeSection}>
                    <View style={styles.dateTimeRow}>
                      <View style={{ flex: 2 }}>
                        <Typography variant="caption" style={[styles.inputLabel, { color: colors.textTertiary }]}>Date</Typography>
                        <WebDateTimeInput type="date" target="end" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Typography variant="caption" style={[styles.inputLabel, { color: colors.textTertiary }]}>Time</Typography>
                        <WebDateTimeInput type="time" target="end" />
                      </View>
                    </View>
                  </View>

                  {picker.show && (
                    <DateTimePicker
                      value={picker.target === 'start' ? startDateTime : endDateTime}
                      mode={picker.mode}
                      is24Hour={true}
                      minimumDate={picker.target === 'start' ? new Date() : startDateTime}
                      onChange={onPickerChange}
                    />
                  )}
                </GlassCard>

                {/* Plate Number */}
                <GlassCard style={styles.plateCard}>
                  <Typography variant="h3" style={[styles.sectionTitle, { color: colors.text }]}>Vehicle Information</Typography>
                  <Input
                    placeholder="Enter Plate Number (e.g. KJA-123AA)"
                    value={plateNumber}
                    onChangeText={setPlateNumber}
                    icon={<Ionicons name="car-outline" size={20} color={colors.textSecondary} />}
                    autoCapitalize="characters"
                  />
                </GlassCard>

                {/* Confirm Button */}
                <GradientButton
                  title="Confirm & Pay"
                  onPress={handlePayment}
                  disabled={!calculation.isValid || !plateNumber.trim()}
                  style={styles.confirmButton}
                  icon={<Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />}
                />
              </View>
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  backText: {
  },
  title: {
    marginBottom: SPACING.s,
  },
  summaryCard: {
    padding: SPACING.xl,
    marginBottom: SPACING.l,
  },
  spotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  spotIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  spotInfo: {
    flex: 1,
  },
  spotName: {
    marginBottom: SPACING.xs,
  },
  spotArea: {
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.m,
    borderTopWidth: 1,
  },
  priceLabel: {
  },
  priceValue: {
  },
  dateTimeCard: {
    padding: SPACING.xl,
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    marginBottom: SPACING.l,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  timelineItem: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: SPACING.s,
  },
  timelineDotEnd: {
  },
  timelineLabel: {
    fontSize: 10,
  },
  timelineLine: {
    flex: 1,
    height: 2,
    marginHorizontal: SPACING.s,
  },
  dateTimeSection: {
    marginBottom: SPACING.l,
  },
  inputLabel: {
    marginBottom: SPACING.s,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  dateTimeButton: {
    borderRadius: RADIUS.m,
    borderWidth: 1,
    padding: SPACING.m,
    height: 52,
    justifyContent: 'center',
  },
  dateTimeText: {
  },
  plateCard: {
    padding: SPACING.xl,
    marginBottom: SPACING.l,
  },
  breakdownCard: {
    padding: SPACING.xl,
    marginBottom: SPACING.l,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  breakdownLabel: {
  },
  breakdownValue: {
  },
  divider: {
    height: 1,
    marginVertical: SPACING.m,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
  },
  confirmButton: {
    marginBottom: SPACING.l,
    marginTop: SPACING.m,
  },
  mainLayout: {
    width: '100%',
  },
  desktopLayout: {
    flexDirection: 'row',
    gap: SPACING.xxl,
    alignItems: 'flex-start',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1.5,
  },
  desktopLeftColumn: {
    // sticky behavior could be added here if needed
  },
  desktopRightColumn: {
  },
  bottomSpacer: {
    height: SPACING.xxxl,
  },
});

export default ReserveSpot;