// ============================================
// NOTIFICATIONS API
// ============================================

import axiosInstance from './axios';
import {Notification, PaginatedResponse} from '../types';

export const notificationsApi = {
  async registerToken(
    fcmToken: string,
    platform: 'android' | 'ios',
    deviceId?: string,
  ): Promise<void> {
    await axiosInstance.post('/notifications/register-token', {
      fcmToken,
      platform,
      deviceId,
    });
  },

  async unregisterToken(fcmToken: string): Promise<void> {
    await axiosInstance.delete('/notifications/unregister-token', {
      data: {fcmToken},
    });
  },

  async getNotifications(
    page: number = 1,
    limit: number = 20,
    isRead?: boolean,
  ): Promise<PaginatedResponse<Notification>> {
    const response = await axiosInstance.get('/notifications', {
      params: {page, limit, isRead},
    });
    return response.data;
  },

  async markAsRead(id: string): Promise<void> {
    await axiosInstance.put(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await axiosInstance.put('/notifications/mark-all-read');
  },

  async markMultipleAsRead(notificationIds: string[]): Promise<void> {
    await axiosInstance.put('/notifications/mark-read', {notificationIds});
  },

  async deleteNotification(id: string): Promise<void> {
    await axiosInstance.delete(`/notifications/${id}`);
  },

  async clearAllNotifications(): Promise<void> {
    await axiosInstance.delete('/notifications/clear-all');
  },

  async getUnreadCount(): Promise<{unreadCount: number}> {
    const response = await axiosInstance.get('/notifications/unread-count');
    return response.data;
  },
};
