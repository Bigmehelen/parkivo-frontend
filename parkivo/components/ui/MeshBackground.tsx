import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing
} from 'react-native-reanimated';

const MeshCircle = ({ color, size, duration, initialX = 0, initialY = 0 }: {
    color: string;
    size: number;
    duration: number;
    delay?: number;
    initialX: number;
    initialY: number;
}) => {
    const transX = useSharedValue(initialX);
    const transY = useSharedValue(initialY);
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        transX.value = withRepeat(
            withSequence(
                withTiming(initialX + 50, { duration, easing: Easing.inOut(Easing.sin) }),
                withTiming(initialX - 50, { duration, easing: Easing.inOut(Easing.sin) }),
                withTiming(initialX, { duration, easing: Easing.inOut(Easing.sin) })
            ),
            -1,
            true
        );

        transY.value = withRepeat(
            withSequence(
                withTiming(initialY - 30, { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) }),
                withTiming(initialY + 30, { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) }),
                withTiming(initialY, { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) })
            ),
            -1,
            true
        );

        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: duration * 1.5 }),
                withTiming(0.3, { duration: duration * 1.5 })
            ),
            -1,
            true
        );
    }, [duration, initialX, initialY]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: transX.value },
            { translateY: transY.value },
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.circle,
                { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
                animatedStyle
            ]}
        />
    );
};

export const MeshBackground = () => {
    const { width, height } = useWindowDimensions();

    return (
        <View style={[StyleSheet.absoluteFill, styles.container]}>
            <MeshCircle
                color="#3B82F6"
                size={width * 0.8}
                duration={6000}
                initialX={-width * 0.2}
                initialY={-height * 0.1}
            />
            <MeshCircle
                color="#8B5CF6"
                size={width * 0.7}
                duration={8000}
                initialX={width * 0.4}
                initialY={height * 0.2}
            />
            <MeshCircle
                color="#10B981"
                size={width * 0.6}
                duration={7000}
                initialX={-width * 0.1}
                initialY={height * 0.5}
            />
            <MeshCircle
                color="#F43F5E"
                size={width * 0.9}
                duration={9000}
                initialX={width * 0.3}
                initialY={height * 0.7}
            />

            {/* Overlay to blur and blend */}
            <View style={[StyleSheet.absoluteFill, styles.overlay]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: '#000000',
    },
    circle: {
        position: 'absolute',
        opacity: 0.5,
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
    }
});
