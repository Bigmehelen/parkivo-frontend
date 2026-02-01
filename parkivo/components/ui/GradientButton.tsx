import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ELEVATION, RADIUS, SPACING } from '../../constants/AppTheme';
import { Typography } from './Typography';
import { useTheme } from '../../context/ThemeContext';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    variant?: 'primary' | 'secondary';
    icon?: React.ReactNode;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    style,
    variant = 'primary',
    icon,
}) => {
    const { colors } = useTheme();

    const gradientColors = variant === 'primary'
        ? colors.gradientPrimary
        : [colors.surfaceElevated, colors.surface];

    const handlePress = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
    };

    return (
        <Pressable
            onPress={handlePress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.container,
                style,
                pressed && styles.pressed,
            ]}
        >
            <LinearGradient
                colors={gradientColors as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradient, disabled && styles.disabled]}
            >
                {loading ? (
                    <ActivityIndicator color={colors.text} />
                ) : (
                    <>
                        {icon && <>{icon}</>}
                        <Typography variant="h3" style={[styles.text, { color: variant === 'primary' ? '#FFFFFF' : colors.text }]}>
                            {title}
                        </Typography>
                    </>
                )}
            </LinearGradient>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.l,
        overflow: 'hidden',
        ...ELEVATION.glow,
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    gradient: {
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.s,
    },
    text: {
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.6,
    },
});
