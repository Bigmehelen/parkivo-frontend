import { StyleSheet, Platform } from 'react-native';
import { SPACING, RADIUS, ELEVATION } from '../constants/AppTheme';

const styles = (isTablet: boolean) =>
  StyleSheet.create({
  hero: {
    flex: 1,
    width: '100%',
    resizeMode:"cover",
    flexDirection: isTablet ? 'row' : 'column',
    
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  navbar: {
    width: '100%',
    padding: 20,
    flexDirection: isTablet ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    boxShadow: '0px 5px 10px rgba(92, 88, 88, 0.9)',
    elevation: 5,
  },

  navLinks: {
    margin: 20,
    flexDirection: 'row',
    gap: 24, 
  },

  navText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },

  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    boxShadow: '0px 5px 10px rgba(92, 88, 88, 0.9)',
    elevation: 5,
    textAlign: 'center',
    maxWidth: 800,
  },

  subtitle: {
    fontSize: 18,
    color: '#ddd',
    marginTop: 30,
    marginBottom: 32,
    textAlign: 'center',
    maxWidth: 600,
    fontWeight: 'bold',
  },

  ctaRow: {
    flexDirection: 'row',
    gap: 16,
  },

  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },

  primary: {
    backgroundColor: '#041579ff',
  },

  secondary: {
    backgroundColor: '#860666ff',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Index/Landing page styles
const indexStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: SPACING.huge,
  },
  centerWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoBadge: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginBottom: SPACING.xxl,
  },
  logoText: {
    letterSpacing: 4,
    fontWeight: '700',
    fontSize: 12,
  },
  headlineContainer: {
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  headline: {
    textAlign: 'center',
    lineHeight: 64,
  },
  gradientText: {
  },
  subheadline: {
    textAlign: 'center',
    maxWidth: 400,
    marginBottom: SPACING.xxl,
    opacity: 0.8,
  },
  statsCard: {
    width: '100%',
    marginBottom: SPACING.xxl,
    padding: SPACING.l,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    marginBottom: SPACING.xs,
    fontWeight: '700',
  },
  statLabel: {
    textAlign: 'center',
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
    height: 40,
    opacity: 0.3,
  },
  ctaContainer: {
    width: '100%',
    gap: SPACING.m,
  },
  primaryCTA: {
    width: '100%',
  },
  secondaryCTA: {
    width: '100%',
  },
  featuresSection: {
    marginTop: SPACING.xxxl,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.m,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    padding: SPACING.xl,
    alignItems: 'center',
    ...ELEVATION.card,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.l,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.l,
  },
  featureTitle: {
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  featureDescription: {
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 100,
  },
  themeToggle: {
    position: 'absolute',
    top: Platform.OS === 'web' ? SPACING.l : 50,
    right: SPACING.l,
    zIndex: 100,
  },
});

export { indexStyles };
export default styles;