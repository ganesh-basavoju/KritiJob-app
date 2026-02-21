// ============================================
// SUBSCRIPTION API
// ============================================

import axiosInstance from './axios';
import {
  CreateOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  SubscriptionStatus,
  Subscription,
} from '../types';

export const subscriptionApi = {
  /**
   * Create a new subscription order
   */
  createOrder: async (): Promise<CreateOrderResponse> => {
    const response = await axiosInstance.post('/subscriptions/create-order');
    return response.data.data;
  },

  /**
   * Verify payment and activate subscription
   */
  verifyPayment: async (
    paymentData: VerifyPaymentRequest,
  ): Promise<VerifyPaymentResponse> => {
    const response = await axiosInstance.post(
      '/subscriptions/verify-payment',
      paymentData,
    );
    return response.data.data;
  },

  /**
   * Get current subscription status
   */
  getStatus: async (): Promise<SubscriptionStatus> => {
    const response = await axiosInstance.get('/subscriptions/status');
    return response.data.data;
  },

  /**
   * Get subscription history
   */
  getHistory: async (): Promise<Subscription[]> => {
    const response = await axiosInstance.get('/subscriptions/history');
    return response.data.data;
  },

  /**
   * Cancel auto-renewal
   */
  cancelAutoRenewal: async (): Promise<{
    subscriptionId: string;
    expiresAt: string;
    autoRenew: boolean;
  }> => {
    const response = await axiosInstance.post('/subscriptions/cancel');
    return response.data.data;
  },
};
