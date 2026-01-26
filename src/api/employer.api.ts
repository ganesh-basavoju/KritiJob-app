
import axiosInstance from './axios';
import {Job, Application, PaginatedResponse, EmployerStats} from '../types';

export const employerApi = {
  async createJob(jobData: any): Promise<Job> {
    const response = await axiosInstance.post('/jobs', jobData);
    return response.data.data;
  },

  async getStats(): Promise<EmployerStats> {
    const response = await axiosInstance.get('/employer/stats'); // Assuming this endpoint exists or adjust to /reports/stats
    return response.data.data;
  },

  async getMyJobs(page: number): Promise<PaginatedResponse<Job>> {
    const response = await axiosInstance.get('/jobs/my-jobs', {
      params: {page},
    });
    return response.data;
  },

  async updateJob(id: string, jobData: any): Promise<Job> {
    const response = await axiosInstance.put(`/jobs/${id}`, jobData);
    return response.data.data;
  },

  async deleteJob(id: string): Promise<void> {
    await axiosInstance.delete(`/jobs/${id}`);
  },

  async closeJob(id: string): Promise<Job> {
    // Backend usually expects a status update or specific endpoint, assuming put for status 'Closed'
    const response = await axiosInstance.put(`/jobs/${id}`, {status: 'Closed'});
    return response.data.data;
  },

  async reopenJob(id: string): Promise<Job> {
    const response = await axiosInstance.put(`/jobs/${id}`, {status: 'Open'});
    return response.data.data;
  },

  async getApplicants(jobId: string, page: number): Promise<PaginatedResponse<Application>> {
    const response = await axiosInstance.get(`/applications/job/${jobId}`, {
      params: {page},
    });
    return response.data;
  },

  async getApplicantById(applicationId: string): Promise<Application> {
    const response = await axiosInstance.get(`/applications/${applicationId}`);
    return response.data.data;
  },

  async updateApplicationStatus(applicationId: string, status: string): Promise<Application> {
    const response = await axiosInstance.put(`/applications/${applicationId}/status`, {status});
    return response.data.data;
  },

  // Existing methods
  async searchCandidates(
    page: number = 1,
    limit: number = 20,
    filters?: {
      skills?: string;
      location?: string;
      keyword?: string;
    },
  ): Promise<PaginatedResponse<any>> {
    const response = await axiosInstance.get('/employer/candidates', {
      params: {page, limit, ...filters},
    });
    return response.data;
  },

  async getCandidateById(id: string): Promise<any> {
    const response = await axiosInstance.get(`/employer/candidates/${id}`);
    return response.data.data;
  },

  async getAllApplicants(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Application>> {
    const response = await axiosInstance.get('/applications/employer/all', {
      params: {page, limit},
    });
    return response.data;
  },
};