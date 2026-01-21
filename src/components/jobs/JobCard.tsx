// ============================================
// JOB CARD COMPONENT
// ============================================

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Job} from '../../types';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {formatRelativeTime} from '../../utils/dateFormatter';

interface JobCardProps {
  job: Job;
  onPress: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({job, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{job.company.name}</Text>
        </View>
        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>{job.type}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>📍 {job.location}</Text>
        <Text style={styles.detailText}>💼 {job.experience}</Text>
        {job.salary && <Text style={styles.detailText}>💰 {job.salary}</Text>}
      </View>

      <View style={styles.skills}>
        {job.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {job.skills.length > 3 && (
          <View style={styles.skillTag}>
            <Text style={styles.skillText}>+{job.skills.length - 3}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.timeText}>{formatRelativeTime(job.createdAt)}</Text>
        <Text style={styles.applicantsText}>
          {job.applicationsCount} applicants
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
  typeContainer: {
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    ...typography.caption,
    color: colors.yellow,
    textTransform: 'capitalize',
  },
  details: {
    marginBottom: spacing.sm,
  },
  detailText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
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
  applicantsText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
