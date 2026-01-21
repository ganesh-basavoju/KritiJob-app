// ============================================
// APPLICATION CARD COMPONENT
// ============================================

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Application} from '../../types';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {formatRelativeTime} from '../../utils/dateFormatter';
import {APPLICATION_STATUS} from '../../utils/constants';

interface ApplicationCardProps {
  application: Application;
  onPress: () => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onPress,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return colors.success;
      case 'rejected':
        return colors.error;
      case 'shortlisted':
        return colors.info;
      case 'reviewed':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{application.job.title}</Text>
          <Text style={styles.company}>{application.job.company.name}</Text>
        </View>
        <View
          style={[
            styles.statusContainer,
            {backgroundColor: getStatusColor(application.status) + '20'},
          ]}>
          <Text
            style={[
              styles.statusText,
              {color: getStatusColor(application.status)},
            ]}>
            {APPLICATION_STATUS[application.status as keyof typeof APPLICATION_STATUS]}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>📍 {application.job.location}</Text>
        <Text style={styles.detailText}>💼 {application.job.type}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.timeText}>
          Applied {formatRelativeTime(application.appliedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  company: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  statusContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  details: {
    marginBottom: spacing.sm,
  },
  detailText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
