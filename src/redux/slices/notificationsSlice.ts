// ============================================
// NOTIFICATIONS SLICE
// ============================================

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {notificationsApi} from '../../api/notifications.api';
import {Notification} from '../../types';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  settings: {
    jobAlerts: boolean;
    applicationUpdates: boolean;
    newApplicants: boolean;
  };
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
  settings: {
    jobAlerts: true,
    applicationUpdates: true,
    newApplicants: true,
  },
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (page: number, {rejectWithValue}) => {
    try {
      const response = await notificationsApi.getNotifications(page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string, {rejectWithValue}) => {
    try {
      await notificationsApi.markAsRead(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  },
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, {rejectWithValue}) => {
    try {
      await notificationsApi.markAllAsRead();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  },
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id: string, {rejectWithValue}) => {
    try {
      await notificationsApi.deleteNotification(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  },
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, {rejectWithValue}) => {
    try {
      const response = await notificationsApi.getUnreadCount();
      return response.count;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  },
);

export const updateNotificationSettings = createAsyncThunk(
  'notifications/updateSettings',
  async (settings: any, {rejectWithValue}) => {
    try {
      await notificationsApi.updateNotificationSettings(settings);
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  },
);

export const fetchNotificationSettings = createAsyncThunk(
  'notifications/fetchSettings',
  async (_, {rejectWithValue}) => {
    try {
      const settings = await notificationsApi.getNotificationSettings();
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
  },
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotificationsError: state => {
      state.error = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.notifications = action.payload.data;
        } else {
          state.notifications = [...state.notifications, ...action.payload.data];
        }
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        };
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, state => {
        state.notifications.forEach(n => (n.read = true));
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      });
  },
});

export const {clearNotificationsError, addNotification} = notificationsSlice.actions;
export default notificationsSlice.reducer;
