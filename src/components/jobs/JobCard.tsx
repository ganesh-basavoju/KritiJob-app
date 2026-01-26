// ============================================
// JOB CARD COMPONENT
// ============================================

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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
  const companyName = (job as any).companyId?.name || job.company?.name || 'Company';
  const applicantsCount = job.applicationsCount || 0;
  const skills = (job as any).skillsRequired || job.skills || [];
  
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}>
      {/* Company & Type Badge */}
      <View style={styles.topRow}>
        <Text style={styles.company}>{companyName}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{job.type}</Text>
        </View>
      </View>

      {/* Job Title */}
      <Text style={styles.title} numberOfLines={2}>{job.title}</Text>

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Icon name="location" size={14} color={colors.yellow} />
          <Text style={styles.detailText} numberOfLines={1}>{job.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="briefcase" size={14} color={colors.yellow} />
          <Text style={styles.detailText}>{(job as any).experienceLevel || job.experience}</Text>
        </View>
        {((job as any).salaryRange || job.salary) && (
          <View style={styles.detailItem}>
            <Icon name="cash" size={14} color={colors.yellow} />
            <Text style={styles.detailText} numberOfLines={1}>{(job as any).salaryRange || job.salary}</Text>
          </View>
        )}
      </View>

      {/* Skills */}
      {skills.length > 0 && (
        <View style={styles.skillsContainer}>
          <Text style={styles.skillsLabel}>Skills:</Text>
          <View style={styles.skillsList}>
            {skills.slice(0, 4).map((skill: string, index: number) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
            {skills.length > 4 && (
              <Text style={styles.moreSkills}>+{skills.length - 4} more</Text>
            )}
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Icon name="time-outline" size={14} color={colors.textTertiary} />
          <Text style={styles.footerText}>{formatRelativeTime(job.createdAt)}</Text>
        </View>
        <View style={styles.footerItem}>
          <Icon name="people-outline" size={14} color={colors.textTertiary} />
          <Text style={styles.footerText}>
            {applicantsCount} {applicantsCount === 1 ? 'applicant' : 'applicants'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.border + '30',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  company: {
    ...typography.body2,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  typeBadge: {
    backgroundColor: colors.yellow + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.yellow + '40',
  },
  typeText: {
    ...typography.caption,
    color: colors.yellow,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  title: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontWeight: '700',
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    minWidth: '30%',
    flex: 1,
  },
  detailText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  skillsContainer: {
    marginBottom: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border + '30',
  },
  skillsLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  skillTag: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border + '50',
  },
  skillText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '500',
  },
  moreSkills: {
    ...typography.caption,
    color: colors.textTertiary,
    fontSize: 11,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border + '30',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerText: {
    ...typography.caption,
    color: colors.textTertiary,
    fontSize: 11,
  },
});
