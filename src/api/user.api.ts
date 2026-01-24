// ============================================
// USER API
// ============================================

import axiosInstance from './axios';
import {UserProfile} from '../types';

export const userApi = {
  async getProfile(): Promise<UserProfile> {
    const response = await axiosInstance.get('/candidate/profile');
    return response.data.data;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await axiosInstance.put('/candidate/profile', data);
    return response.data.data;
  },

  async uploadResume(formData: FormData): Promise<{url: string; name: string}> {
    const response = await axiosInstance.post('/candidate/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async deleteResume(resumeId: string): Promise<void> {
    await axiosInstance.delete(`/candidate/resume/${resumeId}`);
  },

  async uploadAvatar(formData: FormData): Promise<string> {
    const response = await axiosInstance.post('/candidate/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data, headers) => {
        // Let axios set the Content-Type with proper boundary
        delete headers['Content-Type'];
        return data;
      },
    });
    return response.data.data;
  },

  async getSavedJobs(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<any>> {
    const response = await axiosInstance.get('/candidate/saved-jobs', {
      params: {page, limit},
    });
    return response.data;
  },

  async saveJob(jobId: string): Promise<void> {
    await axiosInstance.post('/candidate/saved-jobs', {jobId});
  },

  async removeSavedJob(jobId: string): Promise<void> {
    await axiosInstance.delete(`/candidate/saved-jobs/${jobId}`);
  },

  async deleteAccount(): Promise<void> {
    await axiosInstance.delete('/user/account');
  },
};
