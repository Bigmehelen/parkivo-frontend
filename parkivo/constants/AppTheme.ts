import { TextStyle, ViewStyle } from 'react-native';

// ========================================
// PREMIUM COLOR SYSTEM
// ========================================
const PALETTE = {
  // Brand Colors - Refined Premium Palette
  primary: '#4F46E5', // Indigo 600 - Primary actions
  primaryLight: '#6366F1', // Indigo 500
  primaryDark: '#4338CA', // Indigo 700

  secondary: '#10B981', // Emerald 500
  accent: '#8B5CF6', // Violet 500

  // Backgrounds - Layered Depth System
  background: '#000000', // Pure black for OLED
  backgroundElevated: '#0A0A0A', // Slightly elevated
  surface: '#1A1A1A', // Cards, panels
  surfaceElevated: '#242424', // Elevated cards
  surfaceHighest: '#2E2E2E', // Modals, sheets

  // Glass Effects
  glass: 'rgba(255, 255, 255, 0.05)',
  glassStrong: 'rgba(255, 255, 255, 0.1)',

  // Text Hierarchy
  text: '#FFFFFF', // Primary text
  textSecondary: '#A0A0A0', // Secondary text
  textTertiary: '#6B6B6B', // Tertiary/disabled
  textMuted: '#4A4A4A', // Captions

  // Status Colors - Vibrant but tasteful
  success: '#10B981', // Emerald
  successLight: '#34D399',
  error: '#EF4444', // Red
  errorLight: '#F87171',
  errorDark: '#991B1B', // Dark Red
  warning: '#F59E0B', // Amber
  warningLight: '#FBBF24',
  info: '#3B82F6', // Blue
  infoLight: '#60A5FA',

  // Borders & Dividers
  border: 'rgba(255, 255, 255, 0.08)',
  borderFocus: 'rgba(79, 70, 229, 0.5)',
  divider: 'rgba(255, 255, 255, 0.06)',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayStrong: 'rgba(0, 0, 0, 0.85)',

  // Gradients - Sophisticated blends
  gradientPrimary: ['#4F46E5', '#7C3AED'] as const,
  gradientSuccess: ['#10B981', '#059669'] as const,
  gradientWarning: ['#F59E0B', '#D97706'] as const,
  gradientSurface: ['rgba(26, 26, 26, 0.95)', 'rgba(10, 10, 10, 0.98)'] as const,
  gradientHero: ['#000000', '#0F0F0F', '#1A1A1A'] as const,
};

export const COLORS = PALETTE;

// ========================================
// RUBIK FONT FAMILY
// ========================================
export const FONT_FAMILY = {
  light: 'Rubik_300Light',
  regular: 'Rubik_400Regular',
  medium: 'Rubik_500Medium',
  semiBold: 'Rubik_600SemiBold',
  bold: 'Rubik_700Bold',
  extraBold: 'Rubik_800ExtraBold',
  black: 'Rubik_900Black',
};

// ========================================
// PREMIUM TYPOGRAPHY SYSTEM (Rubik Font)
// ========================================
export const TYPOGRAPHY = {
  // Display (Hero sections)
  display: {
    fontFamily: FONT_FAMILY.black,
    fontSize: 48,
    fontWeight: '900' as TextStyle['fontWeight'],
    letterSpacing: -1.5,
    lineHeight: 56,
    color: PALETTE.text,
  },

  // Headings
  h1: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 32,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.8,
    lineHeight: 40,
    color: PALETTE.text,
  },
  h2: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
    lineHeight: 32,
    color: PALETTE.text,
  },
  h3: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.3,
    lineHeight: 28,
    color: PALETTE.text,
  },
  h4: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 18,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: -0.2,
    lineHeight: 24,
    color: PALETTE.text,
  },

  // Body Text
  body: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
    lineHeight: 24,
    color: PALETTE.textSecondary,
  },
  bodySmall: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
    lineHeight: 20,
    color: PALETTE.textSecondary,
  },

  // Captions & Labels
  caption: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0.2,
    lineHeight: 16,
    color: PALETTE.textMuted,
  },
  label: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 14,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.5,
    lineHeight: 20,
    color: PALETTE.textSecondary,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },

  // Button Text
  button: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.3,
    lineHeight: 24,
  },
};

// Backward compatibility
export const FONTS = TYPOGRAPHY;

// ========================================
// SPACING SYSTEM (4px grid)
// ========================================
export const SPACING = {
  xs: 4,
  s: 8,
  m: 10,
  l: 12,
  xl: 16,
  xxl: 24,
  xxxl: 32,
  huge: 64,
};

// ========================================
// BORDER RADIUS SYSTEM
// ========================================
export const RADIUS = {
  xs: 4,
  s: 8,
  m: 10,
  l: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

// ========================================
// ELEVATION SYSTEM (Sophisticated shadows)
// ========================================
export const ELEVATION: Record<string, ViewStyle> = {
  // Level 1: Subtle cards
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },

  // Level 2: Floating elements
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },

  // Level 3: Prominent cards
  prominent: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },

  // Level 4: Modals & sheets
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },

  // Glow effects
  glow: {
    shadowColor: PALETTE.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },

  glowSuccess: {
    shadowColor: PALETTE.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Backward compatibility
export const SHADOWS = ELEVATION;

// ========================================
// ANIMATION TOKENS
// ========================================
export const ANIMATION = {
  // Durations (ms)
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
  },

  // Easing curves
  easing: {
    default: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  },

  // Spring configurations (for react-native-reanimated)
  spring: {
    gentle: {
      damping: 15,
      stiffness: 150,
    },
    bouncy: {
      damping: 10,
      stiffness: 200,
    },
    snappy: {
      damping: 20,
      stiffness: 300,
    },
  },
};

// ========================================
// BACKWARD COMPATIBILITY
// ========================================
export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: PALETTE.primary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: PALETTE.primary,
  },
  dark: {
    text: PALETTE.text,
    background: PALETTE.background,
    tint: PALETTE.primary,
    icon: PALETTE.textSecondary,
    tabIconDefault: PALETTE.textTertiary,
    tabIconSelected: PALETTE.primary,
  },
};
