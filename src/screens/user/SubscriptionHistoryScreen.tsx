// ============================================
// SUBSCRIPTION HISTORY SCREEN
// ============================================

import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppDispatch, RootState} from '../../redux/store';
import {fetchSubscriptionHistory} from '../../redux/slices/subscriptionSlice';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {Loader} from '../../components/common/Loader';
import {EmptyState} from '../../components/common/EmptyState';
import {Subscription} from '../../types';

export const SubscriptionHistoryScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {history, loading} = useSelector(
    (state: RootState) => state.subscription,
  );

  useEffect(() => {
    dispatch(fetchSubscriptionHistory());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    const displayAmount = amount / 100; // Convert from paise to rupees
    return `${currency === 'INR' ? '₹' : '$'}${displayAmount}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'expired':
        return colors.textSecondary;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'failed':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const renderSubscriptionItem = ({item}: {item: Subscription}) => (
    <View style={styles.subscriptionCard}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Icon name="star" size={24} color={colors.warning} />
          <Text style={styles.planName}>{item.plan.toUpperCase()}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: `${getStatusColor(item.status)}20`},
          ]}>
          <Text style={[styles.statusText, {color: getStatusColor(item.status)}]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="calendar-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.infoLabel}>Start Date:</Text>
          <Text style={styles.infoValue}>{formatDate(item.startDate)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="calendar-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.infoLabel}>End Date:</Text>
          <Text style={styles.infoValue}>{formatDate(item.endDate)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="cash-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.infoLabel}>Amount:</Text>
          <Text style={styles.infoValue}>
            {formatAmount(item.amount, item.currency)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Icon
            name="checkmark-circle-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={styles.infoLabel}>Payment:</Text>
          <View
            style={[
              styles.paymentStatusBadge,
              {backgroundColor: `${getPaymentStatusColor(item.paymentStatus)}20`},
            ]}>
            <Text
              style={[
                styles.paymentStatusText,
                {color: getPaymentStatusColor(item.paymentStatus)},
              ]}>
              {item.paymentStatus}
            </Text>
          </View>
        </View>

        {item.razorpayPaymentId && (
          <View style={styles.infoRow}>
            <Icon name="card-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>Payment ID:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {item.razorpayPaymentId}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>
          Purchased on {formatDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return <Loader />;
  }

  if (history.length === 0) {
    return (
      <EmptyState
        title="No subscription history"
        message="Your subscription purchase history will appear here"
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderSubscriptionItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
  },
  subscriptionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planName: {
    ...typography.body2,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardBody: {
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    ...typography.body1,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    width: 100,
  },
  infoValue: {
    ...typography.body1,
    color: colors.textPrimary,
    flex: 1,
  },
  paymentStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  paymentStatusText: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardFooter: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
