// ============================================
// EMPLOYER SLICE (Updated)
// ============================================

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {employerApi} from '../../api/employer.api';
import {Job, Application, EmployerStats} from '../../types';

interface EmployerState {
  stats: EmployerStats | null;
  jobs: Job[];
  applicants: Application[];
  currentJob: Job | null;
  currentApplicant: Application | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

const initialState: EmployerState = {
  stats: null,
  jobs: [],
  applicants: [],
  currentJob: null,
  currentApplicant: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
};

export const fetchEmployerStats = createAsyncThunk(
  'employer/fetchStats',
  async (_, {rejectWithValue}) => {
    try {
      const stats = await employerApi.getStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  },
);

export const createJob = createAsyncThunk(
  'employer/createJob',
  async (jobData: any, {rejectWithValue}) => {
    try {
      const job = await employerApi.createJob(jobData);
      return job;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  },
);

export const updateJob = createAsyncThunk(
  'employer/updateJob',
  async ({id, jobData}: {id: string; jobData: any}, {rejectWithValue}) => {
    try {
      const job = await employerApi.updateJob(id, jobData);
      return job;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update job');
    }
  },
);

export const deleteJob = createAsyncThunk(
  'employer/deleteJob',
  async (id: string, {rejectWithValue}) => {
    try {
      await employerApi.deleteJob(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
    }
  },
);

export const fetchMyJobs = createAsyncThunk(
  'employer/fetchMyJobs',
  async (page: number, {rejectWithValue}) => {
    try {
      const response = await employerApi.getMyJobs(page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  },
);

export const closeJob = createAsyncThunk(
  'employer/closeJob',
  async (id: string, {rejectWithValue}) => {
    try {
      const job = await employerApi.closeJob(id);
      return job;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to close job');
    }
  },
);

export const reopenJob = createAsyncThunk(
  'employer/reopenJob',
  async (id: string, {rejectWithValue}) => {
    try {
      const job = await employerApi.reopenJob(id);
      return job;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reopen job');
    }
  },
);

export const fetchApplicants = createAsyncThunk(
  'employer/fetchApplicants',
  async ({jobId, page}: {jobId: string; page: number}, {rejectWithValue}) => {
    try {
      const response = await employerApi.getApplicants(jobId, page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applicants');
    }
  },
);

export const fetchApplicantById = createAsyncThunk(
  'employer/fetchApplicantById',
  async (applicationId: string, {rejectWithValue}) => {
    try {
      const applicant = await employerApi.getApplicantById(applicationId);
      return applicant;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applicant');
    }
  },
);

export const updateApplicationStatus = createAsyncThunk(
  'employer/updateApplicationStatus',
  async ({applicationId, status}: {applicationId: string; status: string}, {rejectWithValue}) => {
    try {
      const application = await employerApi.updateApplicationStatus(applicationId, status);
      return application;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  },
);

const employerSlice = createSlice({
  name: 'employer',
  initialState,
  reducers: {
    clearEmployerError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEmployerStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      
      // Create Job Handlers
      .addCase(createJob.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Job Handlers (Added Pending to enable loading spinner)
      .addCase(updateJob.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        // FIX: Find by _id (MongoDB) instead of id
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteJob.fulfilled, (state, action) => {
        // FIX: Find by _id
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
      })
      
      .addCase(fetchMyJobs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.jobs = action.payload.data;
        } else {
          state.jobs = [...state.jobs, ...action.payload.data];
        }
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        };
      })
      .addCase(fetchMyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(closeJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(reopenJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      
      .addCase(fetchApplicants.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.applicants = action.payload.data;
        } else {
          state.applicants = [...state.applicants, ...action.payload.data];
        }
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchApplicantById.fulfilled, (state, action) => {
        state.currentApplicant = action.payload;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.applicants.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
          state.applicants[index] = action.payload;
        }
        if (state.currentApplicant?._id === action.payload._id) {
          state.currentApplicant = action.payload;
        }
      });
  },
});

export const {clearEmployerError} = employerSlice.actions;
export default employerSlice.reducer;