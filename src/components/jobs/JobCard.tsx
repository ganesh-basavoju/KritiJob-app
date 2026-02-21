import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Job } from '../../types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Avatar } from '../common/Avatar';

interface JobCardProps {
  job: Job;
  onPress: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);
  const companyName = (job as any).company?.name || job.company || 'Unknown Company';
  const salary = (job as any).salaryRange || job.salary;

  // Checking if job is recent (within 7 days)
  const isNew = new Date(job.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
      style={[
        styles.card,
        isHovered && styles.cardGlow
      ]}>
      <View style={styles.header}>
        <Avatar name={companyName} size={48} />
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
            {isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
          </View>
          <Text style={styles.company} numberOfLines={1}>{companyName}</Text>
        </View>
        <Icon name="bookmark-outline" size={22} color={colors.textSecondary} />
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Icon name="location-outline" size={16} color={colors.primary} />
          <Text style={styles.detailText}>{job.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="briefcase-outline" size={16} color={colors.primary} />
          <Text style={styles.detailText}>{job.type}</Text>
        </View>
        {salary && (
          <View style={styles.detailItem}>
            <Icon name="cash-outline" size={16} color={colors.primary} />
            <Text style={styles.detailText}>{salary}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 20,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  cardGlow: {
    borderColor: colors.glow,
    borderWidth: 1.5,
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: 16,
    flex: 1,
  },
  newBadge: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newBadgeText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  company: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: 2,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
});
