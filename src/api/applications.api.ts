// ============================================
// APPLICATIONS API
// ============================================

import axiosInstance from './axios';
import {Application, PaginatedResponse} from '../types';

export const applicationsApi = {
  async applyForJob(
    jobId: string,
    resumeUrl: string,
  ): Promise<Application> {
    const response = await axiosInstance.post('/applications', {
      jobId,
      resumeUrl,
    });
    return response.data.data;
  },

  async getMyApplications(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Application>> {
    const response = await axiosInstance.get('/applications/my-applications', {
      params: {page, limit},
    });
    return response.data;
  },

  async getApplicationById(id: string): Promise<Application> {
    const response = await axiosInstance.get(`/applications/${id}`);
    return response.data.data;
  },

  async getJobApplications(
    jobId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Application>> {
    const response = await axiosInstance.get(`/applications/job/${jobId}`, {
      params: {page, limit},
    });
    return response.data;
  },

  async getEmployerApplications(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Application>> {
    const response = await axiosInstance.get('/applications/employer/all', {
      params: {page, limit},
    });
    return response.data;
  },

  async updateApplicationStatus(
    id: string,
    status: string,
  ): Promise<Application> {
    const response = await axiosInstance.put(`/applications/${id}/status`, {status});
    return response.data.data;
  },

  async withdrawApplication(id: string): Promise<void> {
    await axiosInstance.delete(`/applications/${id}`);
  },
};
