// ============================================
// LOADER COMPONENT
// ============================================

import React from 'react';
import {View, ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '../../theme/colors';

interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'large',
  color = colors.yellow,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
