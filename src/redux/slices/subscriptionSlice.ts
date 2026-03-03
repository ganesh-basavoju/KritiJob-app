// ============================================
// SUBSCRIPTION SLICE
// ============================================

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {subscriptionApi} from '../../api/subscription.api';
import {
  SubscriptionStatus,
  Subscription,
  CreateOrderResponse,
  VerifyPaymentRequest,
} from '../../types';

interface SubscriptionState {
  status: SubscriptionStatus | null;
  history: Subscription[];
  currentOrder: CreateOrderResponse | null;
  loading: boolean;
  error: string | null;
  verifying: boolean;
}

const initialState: SubscriptionState = {
  status: null,
  history: [],
  currentOrder: null,
  loading: false,
  error: null,
  verifying: false,
};

// Async thunks
export const fetchSubscriptionStatus = createAsyncThunk(
  'subscription/fetchStatus',
  async (_, {rejectWithValue}) => {
    try {
      const status = await subscriptionApi.getStatus();
      return status;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch subscription status',
      );
    }
  },
);

export const fetchSubscriptionHistory = createAsyncThunk(
  'subscription/fetchHistory',
  async (_, {rejectWithValue}) => {
    try {
      const history = await subscriptionApi.getHistory();
      return history;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch subscription history',
      );
    }
  },
);

export const createSubscriptionOrder = createAsyncThunk(
  'subscription/createOrder',
  async (_, {rejectWithValue}) => {
    try {
      const order = await subscriptionApi.createOrder();
      return order;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create subscription order',
      );
    }
  },
);

export const verifySubscriptionPayment = createAsyncThunk(
  'subscription/verifyPayment',
  async (paymentData: VerifyPaymentRequest, {rejectWithValue}) => {
    try {
      const result = await subscriptionApi.verifyPayment(paymentData);
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Payment verification failed',
      );
    }
  },
);

export const cancelSubscriptionAutoRenewal = createAsyncThunk(
  'subscription/cancelAutoRenewal',
  async (_, {rejectWithValue}) => {
    try {
      const result = await subscriptionApi.cancelAutoRenewal();
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel auto-renewal',
      );
    }
  },
);

// Slice
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionError: state => {
      state.error = null;
    },
    clearCurrentOrder: state => {
      state.currentOrder = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch status
      .addCase(fetchSubscriptionStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
      })
      .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch history
      .addCase(fetchSubscriptionHistory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchSubscriptionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create order
      .addCase(createSubscriptionOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscriptionOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createSubscriptionOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify payment
      .addCase(verifySubscriptionPayment.pending, state => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifySubscriptionPayment.fulfilled, (state, action) => {
        state.verifying = false;
        state.currentOrder = null;
        // Update status to premium immediately
        if (state.status) {
          state.status.isPremium = true;
          state.status.subscriptionExpiresAt = action.payload.expiresAt;
          state.status.applicationLimit = 'unlimited';
        }
      })
      .addCase(verifySubscriptionPayment.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload as string;
      })
      // Cancel auto-renewal
      .addCase(cancelSubscriptionAutoRenewal.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscriptionAutoRenewal.fulfilled, (state, action) => {
        state.loading = false;
        // Update the active subscription in history if present
        if (state.status?.activeSubscription) {
          const subscription = state.history.find(
            s => s._id === action.payload.subscriptionId,
          );
          if (subscription) {
            subscription.autoRenew = false;
          }
        }
      })
      .addCase(cancelSubscriptionAutoRenewal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearSubscriptionError, clearCurrentOrder} =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;
