import React, { useMemo, useEffect } from 'react';
import { View, StatusBar, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { SPACING, RADIUS, ELEVATION } from '../constants/AppTheme';
import { Typography } from '../components/ui/Typography';
import { GradientButton } from '../components/ui/GradientButton';
import { GlassCard } from '../components/ui/GlassCard';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { MeshBackground } from '../components/ui/MeshBackground';
import { indexStyles as styles } from '../styles/global';

function Landing() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, theme } = useTheme();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const isMobile = width < 768;

  const contentMaxWidth = 1200;
  const horizontalPadding = isDesktop ? SPACING.xxl : isTablet ? SPACING.xl : SPACING.l;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/smartpark');
    }
  }, [isAuthenticated]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      <ThemeToggle style={styles.themeToggle} />

      <MeshBackground />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={[styles.centerWrapper, { maxWidth: contentMaxWidth }]}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            style={styles.heroContent}
          >
         
            <View style={[styles.logoBadge, { backgroundColor: colors.glass, borderColor: colors.border }]}>
              <Typography variant="label" style={[styles.logoText, { color: colors.primary }]}>PARKIVO</Typography>
            </View>

            <View style={styles.headlineContainer}>
              <Typography variant="display" style={[styles.headline, isDesktop && { fontSize: 54, lineHeight: 90 }]}>
                Premium
              </Typography>
              <Typography variant="display" style={[styles.headline, styles.gradientText, isDesktop && { fontSize: 42, lineHeight: 90 }, { color: colors.primary }]}>
                Parking
              </Typography>
              <Typography variant="display" style={[styles.headline, isDesktop && { fontSize: 36, lineHeight: 90 }]}>
                Experience
              </Typography>
            </View>

            <Typography variant="h3" style={[styles.subheadline, isDesktop && { maxWidth: 650, fontSize: 24, textAlign: 'center' }, { color: colors.textSecondary }]}>
              Find, reserve, and navigate to parking spots in real-time.
              Smart parking made effortless.
            </Typography>

            <GlassCard style={[styles.statsCard, isDesktop && { padding: SPACING.xxl }]}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Typography variant="h2" style={[styles.statNumber, isDesktop && { fontSize: 36 }]}>1,200+</Typography>
                  <Typography variant="caption" style={styles.statLabel}>Parking Spots</Typography>
                </View>

                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

                <View style={styles.statItem}>
                  <Typography variant="h2" style={[styles.statNumber, isDesktop && { fontSize: 36 }]}>850+</Typography>
                  <Typography variant="caption" style={styles.statLabel}>Available Now</Typography>
                </View>

                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

                <View style={styles.statItem}>
                  <Typography variant="h2" style={[styles.statNumber, isDesktop && { fontSize: 36 }]}>24/7</Typography>
                  <Typography variant="caption" style={styles.statLabel}>Support</Typography>
                </View>
              </View>
            </GlassCard>

            <View style={[styles.ctaContainer, isDesktop && { flexDirection: 'row', justifyContent: 'center', gap: SPACING.xl }]}>
              <GradientButton
                title="Get Started"
                onPress={() => router.push('/login')}
                style={[styles.primaryCTA, isDesktop && { width: 280 }]}
                icon={<Ionicons name="car" size={24} color="#FFFFFF" />}
              />

              <GradientButton
                title="Create Account"
                variant="secondary"
                onPress={() => router.push('/register')}
                style={[styles.secondaryCTA, isDesktop && { width: 280 }]}
              />
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(300).duration(1000).springify()}
            style={styles.featuresSection}
          >
            <Typography variant="h2" style={[styles.sectionTitle, { color: colors.text }]}>
              Why Choose Parkivo?
            </Typography>

            <View style={styles.featuresGrid}>
              <FeatureCard
                icon="flash"
                title="Real-Time"
                description="Live availability updates for all city spots."
                colors={colors}
                isDesktop={isDesktop}
              />
              <FeatureCard
                icon="navigate"
                title="Navigation"
                description="Turn-by-turn directions to your spot."
                colors={colors}
                isDesktop={isDesktop}
              />
              <FeatureCard
                icon="card"
                title="Cashless"
                description="Secure digital payments and invoices."
                colors={colors}
                isDesktop={isDesktop}
              />
              <FeatureCard
                icon="notifications"
                title="Alerts"
                description="Instant booking and expiry reminders."
                colors={colors}
                isDesktop={isDesktop}
              />
            </View>
          </Animated.View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const FeatureCard = ({ icon, title, description, colors, isDesktop }) => (
  <GlassCard style={[styles.featureCard, isDesktop && { width: '23.5%' }]}>
    <View style={[styles.featureIconContainer, { backgroundColor: colors.glass }]}>
      <Ionicons name={icon} size={32} color={colors.primary} />
    </View>
    <Typography variant="h3" style={[styles.featureTitle, { color: colors.text }]}>{title}</Typography>
    <Typography variant="bodySmall" style={[styles.featureDescription, { color: colors.textTertiary }]}>
      {description}
    </Typography>
  </GlassCard>
);

export default Landing;
