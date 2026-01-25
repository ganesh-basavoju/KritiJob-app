// ============================================
// TYPE DEFINITIONS
// ============================================

export type UserRole = 'user' | 'employer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  fcmToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  resume?: string;
  resumes?: Array<{
    _id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }>;
  defaultResumeUrl?: string;
  skills: string[];
  experience: string;
  location: string;
  bio?: string;
  title?: string;
  about?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  employeesCount: string;
  website?: string;
  location: string;
  ownerId: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: Company;
  companyId: string;
  employerId: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: string;
  salary?: string;
  skills: string[];
  status: 'active' | 'closed';
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  userId: string;
  user: UserProfile;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  coverLetter?: string;
  resume: string;
  appliedAt: string;
  updatedAt: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  savedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'job_alert' | 'application_status' | 'new_applicant' | 'general';
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface JobFilters {
  type?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface EmployerStats {
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  jobsExpiringSoon: number;
}
