// ============================================
// COMPANIES API
// ============================================

import axiosInstance from './axios';
import {Company, PaginatedResponse} from '../types';

// Helper to transform MongoDB _id to id
const transformCompany = (data: any): Company => ({
  ...data,
  id: data._id || data.id,
});

export const companiesApi = {
  async getCompanies(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<Company>> {
    const response = await axiosInstance.get('/company', {
      params: {page, limit},
    });
    return {
      ...response.data,
      data: response.data.data?.map(transformCompany) || [],
    };
  },

  async getCompanyById(id: string): Promise<Company> {
    const response = await axiosInstance.get(`/company/${id}`);
    return transformCompany(response.data.data);
  },

  async createCompany(formData: FormData): Promise<Company> {
    const response = await axiosInstance.post('/company', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return transformCompany(response.data.data);
  },

  async updateCompany(id: string, formData: FormData): Promise<Company> {
    const response = await axiosInstance.put(`/company/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return transformCompany(response.data.data);
  },

  async getMyCompany(): Promise<Company> {
    const response = await axiosInstance.get('/company/me');
    return transformCompany(response.data.data);
  },
};
