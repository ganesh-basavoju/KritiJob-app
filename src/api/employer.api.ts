// ============================================
// EMPLOYER API
// ============================================

import axiosInstance from './axios';
import {Job, Application, PaginatedResponse, EmployerStats} from '../types';

export const employerApi = {
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
};
