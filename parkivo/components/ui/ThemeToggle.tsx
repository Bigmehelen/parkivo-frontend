import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { RADIUS, SPACING, ELEVATION } from '../../constants/AppTheme';

export const ThemeToggle: React.FC<{ style?: any }> = ({ style }) => {
    const { theme, toggleTheme, colors } = useTheme();

    const handlePress = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        toggleTheme();
    };

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.container,
                {
                    backgroundColor: colors.glass,
                    borderColor: colors.border,
                },
                pressed && styles.pressed,
                style,
            ]}
        >
            <Ionicons
                name={theme === 'dark' ? 'sunny' : 'moon'}
                size={22}
                color={colors.text}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.m,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        ...ELEVATION.card,
    },
    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }],
    },
});
