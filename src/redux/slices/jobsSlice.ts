// ============================================
// JOBS SLICE
// ============================================

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {jobsApi} from '../../api/jobs.api';
import {Job, JobFilters, SavedJob} from '../../types';

interface JobsState {
  jobs: Job[];
  savedJobs: SavedJob[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  filters: JobFilters;
}

const initialState: JobsState = {
  jobs: [],
  savedJobs: [],
  currentJob: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
  filters: {},
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({page, filters}: {page: number; filters?: JobFilters}, {rejectWithValue}) => {
    try {
      const response = await jobsApi.getJobs(page, 20, filters);
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

export const searchJobs = createAsyncThunk(
  'jobs/searchJobs',
  async ({query, page}: {query: string; page: number}, {rejectWithValue}) => {
    try {
      const response = await jobsApi.searchJobs(query, page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search jobs');
    }
  },
);

export const fetchSavedJobs = createAsyncThunk(
  'jobs/fetchSavedJobs',
  async (page: number, {rejectWithValue}) => {
    try {
      const response = await jobsApi.getSavedJobs(page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch saved jobs');
    }
  },
);

export const saveJob = createAsyncThunk(
  'jobs/saveJob',
  async (jobId: string, {rejectWithValue}) => {
    try {
      const savedJob = await jobsApi.saveJob(jobId);
      return savedJob;
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
  },
  extraReducers: builder => {
    builder
      .addCase(fetchJobs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
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
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchJobById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchJobs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
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
      .addCase(searchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.savedJobs = action.payload.data;
        } else {
          state.savedJobs = [...state.savedJobs, ...action.payload.data];
        }
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        state.savedJobs.push(action.payload);
      })
      .addCase(unsaveJob.fulfilled, (state, action) => {
        state.savedJobs = state.savedJobs.filter(
          saved => saved.jobId !== action.payload,
        );
      });
  },
});

export const {clearJobsError, setFilters, clearFilters} = jobsSlice.actions;
export default jobsSlice.reducer;
