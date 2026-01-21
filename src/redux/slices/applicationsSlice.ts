// ============================================
// APPLICATIONS SLICE
// ============================================

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {applicationsApi} from '../../api/applications.api';
import {Application} from '../../types';

interface ApplicationsState {
  applications: Application[];
  currentApplication: Application | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

const initialState: ApplicationsState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
};

export const applyForJob = createAsyncThunk(
  'applications/apply',
  async ({jobId, coverLetter}: {jobId: string; coverLetter?: string}, {rejectWithValue}) => {
    try {
      const application = await applicationsApi.applyForJob(jobId, coverLetter);
      return application;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply for job');
    }
  },
);

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMyApplications',
  async (page: number, {rejectWithValue}) => {
    try {
      const response = await applicationsApi.getMyApplications(page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  },
);

export const fetchApplicationById = createAsyncThunk(
  'applications/fetchById',
  async (id: string, {rejectWithValue}) => {
    try {
      const application = await applicationsApi.getApplicationById(id);
      return application;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch application');
    }
  },
);

export const withdrawApplication = createAsyncThunk(
  'applications/withdraw',
  async (id: string, {rejectWithValue}) => {
    try {
      await applicationsApi.withdrawApplication(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to withdraw application');
    }
  },
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearApplicationsError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(applyForJob.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload);
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyApplications.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.applications = action.payload.data;
        } else {
          state.applications = [...state.applications, ...action.payload.data];
        }
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        };
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchApplicationById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          app => app.id !== action.payload,
        );
      });
  },
});

export const {clearApplicationsError} = applicationsSlice.actions;
export default applicationsSlice.reducer;
