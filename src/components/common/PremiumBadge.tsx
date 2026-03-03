// ============================================
// PREMIUM BADGE COMPONENT
// ============================================

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';

interface PremiumBadgeProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  size = 'medium',
  style,
}) => {
  const badgeSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const fontSize = size === 'small' ? 10 : size === 'large' ? 14 : 12;

  return (
    <View style={[styles.container, style]}>
      <Icon name="star" size={badgeSize} color={colors.warning} />
      <Text style={[styles.text, {fontSize}]}>Premium</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  text: {
    marginLeft: 4,
    color: colors.warning,
    fontWeight: '600',
  },
});
