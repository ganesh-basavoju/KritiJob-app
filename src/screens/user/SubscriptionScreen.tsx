// ============================================
// SUBSCRIPTION SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppDispatch, RootState} from '../../redux/store';
import {
  fetchSubscriptionStatus,
  createSubscriptionOrder,
  verifySubscriptionPayment,
  clearSubscriptionError,
} from '../../redux/slices/subscriptionSlice';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {SubscriptionCard} from '../../components/common/SubscriptionCard';
import {Loader} from '../../components/common/Loader';

export const SubscriptionScreen = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {status, loading, verifying, error} = useSelector(
    (state: RootState) => state.subscription,
  );
  const {profile} = useSelector((state: RootState) => state.user);

  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    dispatch(fetchSubscriptionStatus());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearSubscriptionError());
    }
  }, [error, dispatch]);

  const handleUpgradePress = async () => {
    try {
      setProcessingPayment(true);
      const orderResult = await dispatch(createSubscriptionOrder()).unwrap();

      // Open Razorpay checkout
      const options = {
        description: 'Premium Subscription - 1 Month',
        image: 'https://your-logo-url.com/logo.png',
        currency: orderResult.currency,
        key: orderResult.razorpayKeyId,
        amount: orderResult.amount,
        name: 'Job Portal Premium',
        order_id: orderResult.orderId,
        prefill: {
          email: profile?.email || '',
          contact: profile?.phone || '',
          name: profile?.name || '',
        },
        theme: {color: colors.primary},
      };

      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          // Payment successful
          try {
            await dispatch(
              verifySubscriptionPayment({
                razorpay_order_id: data.razorpay_order_id,
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_signature: data.razorpay_signature,
              }),
            ).unwrap();

            Alert.alert(
              'Success!',
              'Your premium subscription has been activated successfully!',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    dispatch(fetchSubscriptionStatus());
                  },
                },
              ],
            );
          } catch {
            Alert.alert('Error', 'Payment verification failed. Please contact support.');
          }
        })
        .catch((razorpayError: any) => {
          // Payment failed or cancelled
          console.log('Razorpay Error:', razorpayError);
          if (razorpayError.code !== 2) {
            // Code 2 means user cancelled
            Alert.alert('Payment Failed', 'Your payment could not be processed.');
          }
        })
        .finally(() => {
          setProcessingPayment(false);
        });
    } catch {
      setProcessingPayment(false);
      Alert.alert('Error', 'Failed to create order. Please try again.');
    }
  };

  const handleViewHistory = () => {
    navigation.navigate('SubscriptionHistory');
  };

  if (loading && !status) {
    return <Loader />;
  }

  const isPremium = status?.isPremium || false;
  const expiresAt = status?.subscriptionExpiresAt || null;
  const applicationCount = status?.currentMonthApplications || 0;
  const applicationLimit = status?.applicationLimit || 10;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <SubscriptionCard
          isPremium={isPremium}
          expiresAt={expiresAt}
          applicationCount={applicationCount}
          applicationLimit={applicationLimit}
          onUpgradePress={handleUpgradePress}
        />

        {!isPremium && (
          <View style={styles.pricingCard}>
            <View style={styles.pricingHeader}>
              <Icon name="star" size={32} color={colors.warning} />
              <Text style={styles.pricingTitle}>Premium Plan</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.currency}>₹</Text>
              <Text style={styles.price}>499</Text>
              <Text style={styles.period}>/month</Text>
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Icon
                  name="checkmark-circle"
                  size={24}
                  color={colors.success}
                />
                <Text style={styles.featureText}>
                  Unlimited job applications per month
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Icon
                  name="checkmark-circle"
                  size={24}
                  color={colors.success}
                />
                <Text style={styles.featureText}>
                  Your applications appear first to employers
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Icon
                  name="checkmark-circle"
                  size={24}
                  color={colors.success}
                />
                <Text style={styles.featureText}>
                  Premium badge on your profile
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Icon
                  name="checkmark-circle"
                  size={24}
                  color={colors.success}
                />
                <Text style={styles.featureText}>
                  Stand out from other candidates
                </Text>
              </View>
            </View>
          </View>
        )}

        {status?.activeSubscription && (
          <TouchableOpacity
            style={styles.historyButton}
            onPress={handleViewHistory}>
            <Icon name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.historyButtonText}>View Subscription History</Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoCard}>
          <Icon name="information-circle-outline" size={24} color={colors.info} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              • Subscribe to premium for unlimited applications{'\n'}
              • Your subscription is valid for 30 days{'\n'}
              • Get priority ranking in employer views{'\n'}
              • Cancel anytime from subscription history
            </Text>
          </View>
        </View>
      </View>

      {(processingPayment || verifying) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            {processingPayment ? 'Processing...' : 'Verifying payment...'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  pricingCard: {
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
  pricingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pricingTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  currency: {
    ...typography.h4,
    color: colors.primary,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  period: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  featuresContainer: {
    marginTop: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  featureText: {
    ...typography.body1,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  historyButtonText: {
    ...typography.button,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.info,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  infoTitle: {
    ...typography.body2,
    color: colors.info,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body1,
    color: colors.white,
    marginTop: spacing.md,
  },
});
