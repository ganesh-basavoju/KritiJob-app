import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface AvatarProps {
    name: string;
    size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 40 }) => {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const avatarColors = ['#0A66C2', '#004182', '#378fe9', '#1E40AF', '#111827'];
    const colorIndex = name ? name.charCodeAt(0) % avatarColors.length : 0;

    return (
        <View
            style={[
                styles.avatar,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: avatarColors[colorIndex],
                },
            ]}>
            <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>
                {getInitials(name || '?')}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: colors.white,
        fontWeight: '700',
    },
});
