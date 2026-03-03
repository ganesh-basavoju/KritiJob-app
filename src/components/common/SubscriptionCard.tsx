// ============================================
// SUBSCRIPTION CARD COMPONENT
// ============================================

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

interface SubscriptionCardProps {
  isPremium: boolean;
  expiresAt?: string | null;
  applicationCount: number;
  applicationLimit: number | 'unlimited';
  onUpgradePress: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  isPremium,
  expiresAt,
  applicationCount,
  applicationLimit,
  onUpgradePress,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRemainingApplications = () => {
    if (applicationLimit === 'unlimited') {
      return 'Unlimited';
    }
    const remaining = applicationLimit - applicationCount;
    return remaining;
  };

  if (isPremium) {
    return (
      <View style={[styles.container, styles.premiumContainer]}>
        <View style={styles.header}>
          <Icon name="star" size={28} color={colors.warning} />
          <Text style={styles.premiumTitle}>Premium Active</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Icon
              name="calendar-outline"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={styles.detailText}>
              Expires: {expiresAt ? formatDate(expiresAt) : 'N/A'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon
              name="briefcase-outline"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={styles.detailText}>
              Applications: Unlimited
            </Text>
          </View>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Premium Benefits:</Text>
          <View style={styles.benefitRow}>
            <Icon name="checkmark-circle" size={18} color={colors.success} />
            <Text style={styles.benefitText}>Unlimited job applications</Text>
          </View>
          <View style={styles.benefitRow}>
            <Icon name="checkmark-circle" size={18} color={colors.success} />
            <Text style={styles.benefitText}>Priority in application lists</Text>
          </View>
          <View style={styles.benefitRow}>
            <Icon name="checkmark-circle" size={18} color={colors.success} />
            <Text style={styles.benefitText}>Premium badge on profile</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Free Plan</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{applicationCount}</Text>
          <Text style={styles.statLabel}>Applications Used</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{getRemainingApplications()}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
      </View>

      {applicationCount >= (applicationLimit as number) && (
        <View style={styles.warningContainer}>
          <Icon name="alert-circle" size={20} color={colors.error} />
          <Text style={styles.warningText}>
            You've reached your monthly limit!
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.upgradeButton} onPress={onUpgradePress}>
        <Icon name="star" size={20} color={colors.white} />
        <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
      </TouchableOpacity>

      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>Upgrade to get:</Text>
        <View style={styles.benefitRow}>
          <Icon name="star-outline" size={18} color={colors.primary} />
          <Text style={styles.benefitText}>Unlimited job applications</Text>
        </View>
        <View style={styles.benefitRow}>
          <Icon name="star-outline" size={18} color={colors.primary} />
          <Text style={styles.benefitText}>Higher priority to employers</Text>
        </View>
        <View style={styles.benefitRow}>
          <Icon name="star-outline" size={18} color={colors.primary} />
          <Text style={styles.benefitText}>Stand out with premium badge</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  premiumContainer: {
    borderWidth: 2,
    borderColor: colors.warning,
    backgroundColor: 'rgba(255, 193, 7, 0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  premiumTitle: {
    ...typography.h4,
    color: colors.warning,
    marginLeft: spacing.sm,
  },
  detailsContainer: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailText: {
    ...typography.body1,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  statNumber: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  warningText: {
    ...typography.body1,
    color: colors.error,
    marginLeft: spacing.sm,
    flex: 1,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  upgradeButtonText: {
    ...typography.button,
    color: colors.white,
    marginLeft: spacing.sm,
  },
  benefitsContainer: {
    marginTop: spacing.sm,
  },
  benefitsTitle: {
    ...typography.body2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  benefitText: {
    ...typography.body1,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
});
