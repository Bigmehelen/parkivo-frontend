import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { TYPOGRAPHY, SPACING, RADIUS, ELEVATION, ANIMATION } from '../../constants/AppTheme';
import { Typography } from './Typography';
import { GradientButton } from './GradientButton';
import { useTheme } from '../../context/ThemeContext';

interface ParkingSpotCardProps {
    name: string;
    area: string;
    availableSpots: number;
    totalSpots: number;
    pricePerHour: number;
    distance?: string;
    isSelected?: boolean;
    onPress: () => void;
    onReserve?: () => void;
    onNavigate?: () => void;
}

export const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({
    name,
    area,
    availableSpots,
    totalSpots,
    pricePerHour,
    distance,
    isSelected = false,
    onPress,
    onReserve,
    onNavigate,
}) => {
    const { colors } = useTheme();
    const availabilityPercent = (availableSpots / totalSpots) * 100;

    // Determine status and colors
    const getStatusConfig = () => {
        if (availabilityPercent > 50) {
            return {
                status: 'Available',
                icon: 'checkmark-circle' as const,
                color: colors.success,
                gradient: colors.gradientSuccess || ['#10B981', '#059669'],
                bgGradient: ['rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.05)'] as const,
            };
        } else if (availabilityPercent > 20) {
            return {
                status: 'Limited',
                icon: 'warning' as const,
                color: colors.warning,
                gradient: colors.gradientWarning || ['#F59E0B', '#D97706'],
                bgGradient: ['rgba(245, 158, 11, 0.1)', 'rgba(217, 119, 6, 0.05)'] as const,
            };
        } else {
            return {
                status: 'Almost Full',
                icon: 'alert-circle' as const,
                color: colors.error,
                gradient: [colors.error, colors.errorDark] as const,
                bgGradient: ['rgba(239, 68, 68, 0.1)', 'rgba(248, 113, 113, 0.05)'] as const,
            };
        }
    };

    const statusConfig = getStatusConfig();

    const handlePress = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
    };

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.container,
                isSelected && styles.selected,
                pressed && styles.pressed,
            ]}
        >
            <LinearGradient
                colors={statusConfig.bgGradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Typography variant="h3" style={styles.name}>{name}</Typography>
                            <View style={styles.locationRow}>
                                <Ionicons name="location" size={14} color={colors.textSecondary} />
                                <Typography variant="caption" style={styles.area}>{area}</Typography>
                                {distance && (
                                    <>
                                        <Typography variant="caption" style={styles.distanceDot}>•</Typography>
                                        <Ionicons name="navigate" size={12} color={colors.textTertiary} />
                                        <Typography variant="caption" style={styles.distance}>{distance}</Typography>
                                    </>
                                )}
                            </View>
                        </View>

                        {/* Status Badge */}
                        <View style={[styles.badge, { backgroundColor: statusConfig.color }]}>
                            <View style={[styles.pulse, { backgroundColor: statusConfig.color }]} />
                            <Ionicons name={statusConfig.icon} size={18} color="#FFFFFF" style={styles.badgeIcon} />
                            <Typography variant="caption" style={styles.badgeText}>
                                {availableSpots}
                            </Typography>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Typography variant="caption" style={styles.statLabel}>Status</Typography>
                            <Typography variant="bodySmall" style={{ color: statusConfig.color }}>
                                {statusConfig.status}
                            </Typography>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.stat}>
                            <Typography variant="caption" style={styles.statLabel}>Price</Typography>
                            <Typography variant="bodySmall" style={styles.price}>
                                ₦{pricePerHour}/hr
                            </Typography>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.stat}>
                            <Typography variant="caption" style={[styles.statLabel, { color: colors.textTertiary }]}>Total</Typography>
                            <Typography variant="bodySmall" style={{ color: colors.text }}>{totalSpots} spots</Typography>
                        </View>
                    </View>

                    {/* Actions (only when selected) */}
                    {isSelected && (
                        <View style={styles.actions}>
                            <GradientButton
                                title="Reserve"
                                onPress={() => onReserve?.()}
                                style={styles.actionButton}
                            />
                            <GradientButton
                                title="Navigate"
                                variant="secondary"
                                onPress={() => onNavigate?.()}
                                style={styles.actionButton}
                            />
                        </View>
                    )}
                </View>
            </LinearGradient>

            {/* Selection Indicator */}
            {isSelected && <View style={styles.selectionIndicator} />}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.xl,
        marginBottom: SPACING.m,
        borderWidth: 1,
        overflow: 'hidden',
        ...ELEVATION.card,
    },
    selected: {
        ...ELEVATION.floating,
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    gradient: {
        flex: 1,
    },
    content: {
        padding: SPACING.l,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.m,
    },
    headerLeft: {
        flex: 1,
    },
    name: {
        marginBottom: SPACING.xs / 2,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    area: {
        marginLeft: SPACING.xs / 2,
    },
    distanceDot: {
        marginHorizontal: SPACING.xs / 2,
    },
    distance: {
        marginLeft: SPACING.xs / 2,
    },
    badge: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        borderRadius: RADIUS.full,
        minWidth: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs / 2,
        position: 'relative',
    },
    badgeIcon: {
        position: 'relative',
        zIndex: 1,
    },
    pulse: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: RADIUS.full,
        opacity: 0.3,
    },
    badgeText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
        position: 'relative',
        zIndex: 1,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.m,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        marginBottom: SPACING.xs / 2,
    },
    price: {
        fontWeight: '600',
    },
    divider: {
        width: 1,
        height: 24,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.m,
        marginTop: SPACING.l,
    },
    actionButton: {
        flex: 1,
    },
    selectionIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },
});
