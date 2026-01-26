// ============================================
// APPLICATION CARD COMPONENT
// ============================================

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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
  const job = (application as any).jobId || application.job;
  const company = (job as any)?.companyId || job?.company;
  
  if (!job) {
    console.warn('ApplicationCard: No job data found', application);
    return null;
  }

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
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{company?.name || 'Company'}</Text>
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
        <View style={styles.detailRow}>
          <Icon name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{job.location || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="briefcase-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{job.type || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.timeText}>
          Applied {formatRelativeTime((application as any).createdAt || application.appliedAt)}
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  detailText: {
    ...typography.body2,
    color: colors.textSecondary,
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
