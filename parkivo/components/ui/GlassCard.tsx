import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { RADIUS, SPACING, SHADOWS } from '../../constants/AppTheme';
import { useTheme } from '../../context/ThemeContext';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    style,
    intensity = 20
}) => {
    const { colors, theme } = useTheme();

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.surface,
                borderColor: colors.border,
            },
            style
        ]}>
            <BlurView
                intensity={intensity}
                tint={theme === 'dark' ? 'dark' : 'light'}
                style={styles.blur}
            >
                <View style={styles.content}>
                    {children}
                </View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.l,
        overflow: 'hidden',
        borderWidth: 1,
        ...SHADOWS.soft,
    },
    blur: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: SPACING.m,
    },
});
