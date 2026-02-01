import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { SPACING, RADIUS, ELEVATION } from '../../constants/AppTheme';
import { useTheme } from '../../context/ThemeContext';

interface FloatingActionButtonProps {
    icon: React.ReactNode;
    onPress: () => void;
    position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
    variant?: 'primary' | 'secondary';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    icon,
    onPress,
    position = 'bottom-right',
    variant = 'primary',
}) => {
    const { colors } = useTheme();
    const handlePress = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onPress();
    };

    const gradientColors = variant === 'primary'
        ? colors.gradientPrimary
        : [colors.surface, colors.surfaceElevated || colors.surface];

    const positionStyle = {
        'bottom-right': styles.positionBottomRight,
        'bottom-left': styles.positionBottomLeft,
        'bottom-center': styles.positionBottomCenter,
    }[position];

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.container,
                positionStyle,
                pressed && styles.pressed,
            ]}
        >
            <LinearGradient
                colors={gradientColors as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {icon}
            </LinearGradient>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 56,
        height: 56,
        borderRadius: RADIUS.full,
        ...ELEVATION.floating,
    },
    positionBottomRight: {
        bottom: SPACING.xxl,
        right: SPACING.l,
    },
    positionBottomLeft: {
        bottom: SPACING.xxl,
        left: SPACING.l,
    },
    positionBottomCenter: {
        bottom: SPACING.xxl,
        left: '50%',
        marginLeft: -28,
    },
    gradient: {
        width: '100%',
        height: '100%',
        borderRadius: RADIUS.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressed: {
        transform: [{ scale: 0.9 }],
        ...ELEVATION.prominent,
    },
});
