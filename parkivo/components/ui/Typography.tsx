import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { TYPOGRAPHY } from '../../constants/AppTheme';
import { useTheme } from '../../context/ThemeContext';

interface TypographyProps extends TextProps {
    variant?: keyof typeof TYPOGRAPHY;
    color?: string;
    center?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body',
    color,
    center,
    style,
    ...props
}) => {
    const { colors } = useTheme();

    return (
        <Text
            style={[
                TYPOGRAPHY[variant],
                { color: color || colors.text },
                center && { textAlign: 'center' },
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};
