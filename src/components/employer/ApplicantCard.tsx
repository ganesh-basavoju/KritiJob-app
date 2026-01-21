// ============================================
// APPLICANT CARD COMPONENT
// ============================================

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Application} from '../../types';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {formatRelativeTime} from '../../utils/dateFormatter';
import {APPLICATION_STATUS} from '../../utils/constants';

interface ApplicantCardProps {
  application: Application;
  onPress: () => void;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({
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
          <Text style={styles.name}>{application.user.name}</Text>
          <Text style={styles.email}>{application.user.email}</Text>
          {application.user.location && (
            <Text style={styles.location}>📍 {application.user.location}</Text>
          )}
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

      {application.user.skills && application.user.skills.length > 0 && (
        <View style={styles.skills}>
          {application.user.skills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {application.user.skills.length > 3 && (
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>
                +{application.user.skills.length - 3}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.timeText}>
          Applied {formatRelativeTime(application.appliedAt)}
        </Text>
        <Text style={styles.experienceText}>
          {application.user.experience || 'N/A'}
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
  name: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  location: {
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
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  skillTag: {
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  skillText: {
    ...typography.caption,
    color: colors.textPrimary,
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
  experienceText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
