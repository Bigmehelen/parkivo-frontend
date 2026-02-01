import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { RADIUS, SPACING } from '../../constants/AppTheme';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends Omit<TextInputProps, 'style'> {
    icon?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
}

export const Input: React.FC<InputProps> = ({ icon, style, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const { colors } = useTheme();

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.glass,
                borderColor: colors.border,
            },
            isFocused && {
                borderColor: colors.primary,
                backgroundColor: colors.glassStrong,
            },
            style
        ]}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <TextInput
                placeholderTextColor={colors.textTertiary}
                style={[styles.input, { color: colors.text }]}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: RADIUS.m,
        borderWidth: 1,
        paddingHorizontal: SPACING.m,
        height: 56,
    },
    iconContainer: {
        marginRight: SPACING.s,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
});
