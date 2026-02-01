import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: 'light' | 'dark';
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
    colors: typeof lightColors | typeof darkColors;
}

// Light Mode Colors
export const lightColors = {
    // Brand Colors
    primary: '#4F46E5',
    primaryLight: '#6366F1',
    primaryDark: '#4338CA',

    secondary: '#10B981',
    accent: '#8B5CF6',

    // Backgrounds
    background: '#FFFFFF',
    backgroundElevated: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceElevated: '#F3F4F6',
    surfaceHighest: '#E5E7EB',

    // Glass Effects
    glass: 'rgba(0, 0, 0, 0.05)',
    glassStrong: 'rgba(0, 0, 0, 0.1)',

    // Text
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textMuted: '#D1D5DB',

    // Status Colors
    success: '#10B981',
    successLight: '#34D399',
    error: '#EF4444',
    errorLight: '#F87171',
    errorDark: '#991B1B',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    info: '#3B82F6',
    infoLight: '#60A5FA',

    // Borders
    border: 'rgba(0, 0, 0, 0.1)',
    borderFocus: 'rgba(79, 70, 229, 0.5)',
    divider: 'rgba(0, 0, 0, 0.08)',

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.4)',
    overlayStrong: 'rgba(0, 0, 0, 0.7)',

    // Gradients
    gradientPrimary: ['#4F46E5', '#7C3AED'] as const,
    gradientSuccess: ['#10B981', '#059669'] as const,
    gradientWarning: ['#F59E0B', '#D97706'] as const,
    gradientSurface: ['rgba(249, 250, 251, 0.95)', 'rgba(255, 255, 255, 0.98)'] as const,
    gradientHero: ['#FFFFFF', '#F9FAFB', '#F3F4F6'] as const,
};

// Dark Mode Colors
export const darkColors = {
    // Brand Colors
    primary: '#4F46E5',
    primaryLight: '#6366F1',
    primaryDark: '#4338CA',

    secondary: '#10B981',
    accent: '#8B5CF6',

    // Backgrounds
    background: '#000000',
    backgroundElevated: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceElevated: '#242424',
    surfaceHighest: '#2E2E2E',

    // Glass Effects
    glass: 'rgba(255, 255, 255, 0.05)',
    glassStrong: 'rgba(255, 255, 255, 0.1)',

    // Text
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    textTertiary: '#6B6B6B',
    textMuted: '#4A4A4A',

    // Status Colors
    success: '#10B981',
    successLight: '#34D399',
    error: '#EF4444',
    errorLight: '#F87171',
    errorDark: '#991B1B',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    info: '#3B82F6',
    infoLight: '#60A5FA',

    // Borders
    border: 'rgba(255, 255, 255, 0.08)',
    borderFocus: 'rgba(79, 70, 229, 0.5)',
    divider: 'rgba(255, 255, 255, 0.06)',

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.6)',
    overlayStrong: 'rgba(0, 0, 0, 0.85)',

    // Gradients
    gradientPrimary: ['#4F46E5', '#7C3AED'] as const,
    gradientSuccess: ['#10B981', '#059669'] as const,
    gradientWarning: ['#F59E0B', '#D97706'] as const,
    gradientSurface: ['rgba(26, 26, 26, 0.95)', 'rgba(10, 10, 10, 0.98)'] as const,
    gradientHero: ['#000000', '#0F0F0F', '#1A1A1A'] as const,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@parkivo_theme_mode';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('dark'); // Default to dark
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    // Load saved theme preference
    useEffect(() => {
        loadThemePreference();
    }, []);

    // Update theme when mode or system preference changes
    useEffect(() => {
        const effectiveTheme = themeMode === 'system'
            ? (systemColorScheme || 'dark')
            : themeMode;
        setTheme(effectiveTheme);
    }, [themeMode, systemColorScheme]);

    const loadThemePreference = async () => {
        try {
            const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system')) {
                setThemeModeState(savedMode as ThemeMode);
            }
        } catch (error) {
            console.error('Failed to load theme preference:', error);
        }
    };

    const setThemeMode = async (mode: ThemeMode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
            setThemeModeState(mode);
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    const toggleTheme = () => {
        // Simple toggle between light and dark
        const newMode = theme === 'dark' ? 'light' : 'dark';
        setThemeMode(newMode);
    };

    const colors = theme === 'dark' ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
