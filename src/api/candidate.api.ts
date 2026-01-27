// ============================================
// CANDIDATE API
// ============================================

import axiosInstance from './axios';

export interface CandidateProfile {
  _id: string;
  userId: string;
  title?: string;
  location?: string;
  about?: string;
  skills?: string[];
  phone?: string;
  avatarUrl?: string;
  resumes?: Array<{
    _id?: string;
    name: string;
    url: string;
    uploadedAt: Date;
  }>;
  defaultResumeUrl?: string;
  savedJobs?: string[];
}

export const candidateApi = {
  async getProfile(): Promise<CandidateProfile> {
    const response = await axiosInstance.get('/candidate/profile');
    return response.data.data;
  },

  async updateProfile(data: Partial<CandidateProfile>): Promise<CandidateProfile> {
    const response = await axiosInstance.put('/candidate/profile', data);
    return response.data.data;
  },

  async uploadResume(formData: FormData): Promise<{resumes: any[]; defaultResumeUrl: string}> {
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
    });
    return response.data.data.avatarUrl;
  },

  async setDefaultResume(resumeUrl: string): Promise<{defaultResumeUrl: string}> {
    const response = await axiosInstance.put('/candidate/default-resume', {resumeUrl});
    return response.data.data;
  },

  async getSavedJobs(page: number = 1, limit: number = 20): Promise<any> {
    const response = await axiosInstance.get('/candidate/saved-jobs', {
      params: {page, limit},
    });
    return response.data;
  },

  async toggleSaveJob(jobId: string): Promise<{savedJobs: string[]}> {
    const response = await axiosInstance.post(`/candidate/saved-jobs/${jobId}`);
    return response.data.data;
  },
};
