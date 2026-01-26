// ============================================
// JOBS SLICE (RESTRUCTURED)
// ============================================

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {jobsApi} from '../../api/jobs.api';
import {Job, JobFilters} from '../../types';

interface JobsState {
  // Job Feed (filtered by backend)
  feedJobs: Job[];
  feedPagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  feedLoading: boolean;
  
  // Saved Jobs (filtered by backend)
  savedJobs: Job[];
  savedJobsLoading: boolean;
  
  // Current Job (for details screen)
  currentJob: Job | null;
  currentJobLoading: boolean;
  
  // Applied Job IDs (for quick lookups)
  appliedJobIds: string[];
  
  // General
  error: string | null;
  filters: JobFilters;
}

const initialState: JobsState = {
  feedJobs: [],
  feedPagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
  feedLoading: false,
  savedJobs: [],
  savedJobsLoading: false,
  currentJob: null,
  currentJobLoading: false,
  appliedJobIds: [],
  error: null,
  filters: {},
};

export const fetchJobFeed = createAsyncThunk(
  'jobs/fetchJobFeed',
  async ({page, filters}: {page: number; filters?: JobFilters}, {rejectWithValue}) => {
    try {
      const response = await jobsApi.getJobFeed(page, 20, filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job feed');
    }
  },
);

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({page, filters}: {page: number; filters?: JobFilters}, {rejectWithValue}) => {
    try {
      const response = await jobsApi.getJobFeed(page, 20, filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  },
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (id: string, {rejectWithValue}) => {
    try {
      const job = await jobsApi.getJobById(id);
      return job;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job');
    }
  },
);

export const fetchSavedJobs = createAsyncThunk(
  'jobs/fetchSavedJobs',
  async (_, {rejectWithValue}) => {
    try {
      const response = await jobsApi.getSavedJobs(1, 100);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch saved jobs');
    }
  },
);

export const saveJob = createAsyncThunk(
  'jobs/saveJob',
  async (jobId: string, {rejectWithValue}) => {
    try {
      await jobsApi.saveJob(jobId);
      return jobId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save job');
    }
  },
);

export const unsaveJob = createAsyncThunk(
  'jobs/unsaveJob',
  async (jobId: string, {rejectWithValue}) => {
    try {
      await jobsApi.unsaveJob(jobId);
      return jobId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unsave job');
    }
  },
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobsError: state => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: state => {
      state.filters = {};
    },
    setAppliedJobIds: (state, action) => {
      state.appliedJobIds = action.payload;
    },
    addAppliedJobId: (state, action) => {
      if (!state.appliedJobIds.includes(action.payload)) {
        state.appliedJobIds.push(action.payload);
      }
      // Remove from feed
      state.feedJobs = state.feedJobs.filter(job => (job as any)._id !== action.payload && job.id !== action.payload);
      // Remove from saved
      state.savedJobs = state.savedJobs.filter(job => (job as any)._id !== action.payload && job.id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder
      // Feed Jobs
      .addCase(fetchJobFeed.pending, state => {
        state.feedLoading = true;
        state.error = null;
      })
      .addCase(fetchJobFeed.fulfilled, (state, action) => {
        state.feedLoading = false;
        if (action.payload.page === 1) {
          state.feedJobs = action.payload.data;
        } else {
          state.feedJobs = [...state.feedJobs, ...action.payload.data];
        }
        state.feedPagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        };
      })
      .addCase(fetchJobFeed.rejected, (state, action) => {
        state.feedLoading = false;
        state.error = action.payload as string;
      })
      // Legacy fetchJobs (same as fetchJobFeed)
      .addCase(fetchJobs.pending, state => {
        state.feedLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.feedLoading = false;
        if (action.payload.page === 1) {
          state.feedJobs = action.payload.data;
        } else {
          state.feedJobs = [...state.feedJobs, ...action.payload.data];
        }
        state.feedPagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        };
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.feedLoading = false;
        state.error = action.payload as string;
      })
      // Current Job
      .addCase(fetchJobById.pending, state => {
        state.currentJobLoading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.currentJobLoading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.currentJobLoading = false;
        state.error = action.payload as string;
      })
      // Saved Jobs
      .addCase(fetchSavedJobs.pending, state => {
        state.savedJobsLoading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.savedJobsLoading = false;
        state.savedJobs = action.payload;
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.savedJobsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        // Job will be added on next fetch
      })
      .addCase(unsaveJob.fulfilled, (state, action) => {
        state.savedJobs = state.savedJobs.filter(
          job => (job as any)._id !== action.payload && job.id !== action.payload,
        );
      });
  },
});

export const {clearJobsError, setFilters, clearFilters, setAppliedJobIds, addAppliedJobId} = jobsSlice.actions;
export default jobsSlice.reducer;
