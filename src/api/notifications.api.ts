// ============================================
// NOTIFICATIONS API
// ============================================

import axiosInstance from './axios';
import {Notification, PaginatedResponse} from '../types';

export const notificationsApi = {
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
    await axiosInstance.put('/notifications/read-all');
  },

  async deleteNotification(id: string): Promise<void> {
    await axiosInstance.delete(`/notifications/${id}`);
  },

  async getUnreadCount(): Promise<{count: number}> {
    const response = await axiosInstance.get('/notifications/unread-count');
    return response.data;
  },
};
