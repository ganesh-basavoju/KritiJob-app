// ============================================
// JOBS API
// ============================================

import axiosInstance from './axios';
import {Job, JobFilters, PaginatedResponse, SavedJob} from '../types';

export const jobsApi = {
  async getJobs(
    page: number = 1,
    limit: number = 20,
    filters?: JobFilters,
  ): Promise<PaginatedResponse<Job>> {
    const response = await axiosInstance.get('/jobs', {
      params: {page, limit, ...filters},
    });
    return response.data;
  },

  async getJobById(id: string): Promise<Job> {
    const response = await axiosInstance.get(`/jobs/${id}`);
    return response.data.data;
  },

  async getMyJobs(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Job>> {
    const response = await axiosInstance.get('/jobs/my-jobs', {
      params: {page, limit},
    });
    return response.data;
  },

  async createJob(jobData: {
    companyId: string;
    title: string;
    description: string;
    location: string;
    type: string;
    experienceLevel: string;
    salaryRange?: string;
    skillsRequired: string[];
  }): Promise<Job> {
    const response = await axiosInstance.post('/jobs', jobData);
    return response.data.data;
  },

  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    const response = await axiosInstance.put(`/jobs/${id}`, jobData);
    return response.data.data;
  },

  async deleteJob(id: string): Promise<void> {
    await axiosInstance.delete(`/jobs/${id}`);
  },
};
