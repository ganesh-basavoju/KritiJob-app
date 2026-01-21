// ============================================
// AUTH API
// ============================================

import axiosInstance from './axios';
import {AuthResponse, User, UserRole} from '../types';

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/login', {email, password});
    return response.data;
  },

  async register(
    email: string,
    password: string,
    name: string,
    role: UserRole,
    phone?: string,
  ): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/signup', {
      email,
      password,
      name,
      role,
      phone,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.get('/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/refresh-token', {refreshToken});
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get('/auth/me');
    return response.data.user;
  },

  async updateFCMToken(fcmToken: string): Promise<void> {
    await axiosInstance.post('/auth/fcm-token', {fcmToken});
  },

  async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    await axiosInstance.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  },

  async forgotPassword(email: string): Promise<void> {
    await axiosInstance.post('/auth/forgot-password', {email});
  },

  async resetPassword(resetToken: string, password: string): Promise<void> {
    await axiosInstance.put(`/auth/reset-password/${resetToken}`, {password});
  },
};
