// ============================================
// COMPANIES API
// ============================================

import axiosInstance from './axios';
import {Company, PaginatedResponse} from '../types';

export const companiesApi = {
  async getCompanies(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Company>> {
    const response = await axiosInstance.get('/company', {
      params: {page, limit},
    });
    return response.data;
  },

  async getCompanyById(id: string): Promise<Company> {
    const response = await axiosInstance.get(`/company/${id}`);
    return response.data.data;
  },

  async createCompany(formData: FormData): Promise<Company> {
    const response = await axiosInstance.post('/company', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async updateCompany(id: string, formData: FormData): Promise<Company> {
    const response = await axiosInstance.put(`/company/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async getMyCompany(): Promise<Company> {
    const response = await axiosInstance.get('/company/me');
    return response.data.data;
  },
};
