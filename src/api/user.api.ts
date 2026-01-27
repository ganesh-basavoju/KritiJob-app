// ============================================
// USER API
// ============================================

import axiosInstance from './axios';
import {UserProfile} from '../types';

export const userApi = {
  async getProfile(): Promise<UserProfile> {
    const response = await axiosInstance.get('/users/me');
    return response.data.data;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await axiosInstance.put('/users/me', data);
    return response.data.data;
  },

  async deleteAccount(): Promise<void> {
    await axiosInstance.delete('/user/account');
  },
};
