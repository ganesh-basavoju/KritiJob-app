// ============================================
// ERROR TEXT COMPONENT
// ============================================

import React from 'react';
import {Text, StyleSheet, TextStyle} from 'react-native';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

interface ErrorTextProps {
  message: string;
  style?: TextStyle;
}

export const ErrorText: React.FC<ErrorTextProps> = ({message, style}) => {
  return <Text style={[styles.error, style]}>{message}</Text>;
};

const styles = StyleSheet.create({
  error: {
    ...typography.body2,
    color: colors.error,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
});
