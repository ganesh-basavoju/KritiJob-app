// ============================================
// CANDIDATE SLICE
// ============================================

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {candidateApi, CandidateProfile} from '../../api/candidate.api';

interface CandidateState {
  profile: CandidateProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: CandidateState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchCandidateProfile = createAsyncThunk(
  'candidate/fetchProfile',
  async (_, {rejectWithValue}) => {
    try {
      const response = await candidateApi.getProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidate profile');
    }
  },
);

export const updateCandidateProfile = createAsyncThunk(
  'candidate/updateProfile',
  async (data: Partial<CandidateProfile>, {rejectWithValue}) => {
    try {
      const response = await candidateApi.updateProfile(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update candidate profile');
    }
  },
);

export const uploadResume = createAsyncThunk(
  'candidate/uploadResume',
  async (formData: FormData, {rejectWithValue}) => {
    try {
      const response = await candidateApi.uploadResume(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload resume');
    }
  },
);

export const uploadAvatar = createAsyncThunk(
  'candidate/uploadAvatar',
  async (formData: FormData, {rejectWithValue}) => {
    try {
      const avatarUrl = await candidateApi.uploadAvatar(formData);
      return avatarUrl;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload avatar');
    }
  },
);

export const deleteResume = createAsyncThunk(
  'candidate/deleteResume',
  async (resumeId: string, {rejectWithValue}) => {
    try {
      await candidateApi.deleteResume(resumeId);
      return resumeId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete resume');
    }
  },
);

export const setDefaultResume = createAsyncThunk(
  'candidate/setDefaultResume',
  async (resumeUrl: string, {rejectWithValue}) => {
    try {
      const response = await candidateApi.setDefaultResume(resumeUrl);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set default resume');
    }
  },
);

export const toggleSaveJob = createAsyncThunk(
  'candidate/toggleSaveJob',
  async (jobId: string, {rejectWithValue}) => {
    try {
      const response = await candidateApi.toggleSaveJob(jobId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save job');
    }
  },
);

export const getSavedJobs = createAsyncThunk(
  'candidate/getSavedJobs',
  async (_, {rejectWithValue}) => {
    try {
      const response = await candidateApi.getSavedJobs();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch saved jobs');
    }
  },
);

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    clearCandidateError: state => {
      state.error = null;
    },
    clearCandidateProfile: state => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Candidate Profile
      .addCase(fetchCandidateProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Candidate Profile
      .addCase(updateCandidateProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Upload Resume
      .addCase(uploadResume.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.resumes = action.payload.resumes;
          state.profile.defaultResumeUrl = action.payload.defaultResumeUrl;
        }
      })
      
      // Upload Avatar
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.avatarUrl = action.payload;
        }
      })
      
      // Delete Resume
      .addCase(deleteResume.fulfilled, (state, action) => {
        if (state.profile && state.profile.resumes) {
          state.profile.resumes = state.profile.resumes.filter(
            resume => resume.url !== action.payload
          );
        }
      })
      
      // Set Default Resume
      .addCase(setDefaultResume.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.defaultResumeUrl = action.payload.defaultResumeUrl;
        }
      })
      
      // Toggle Save Job
      .addCase(toggleSaveJob.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.savedJobs = action.payload.savedJobs;
        }
      })
      
      // Get Saved Jobs
      .addCase(getSavedJobs.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.savedJobs = action.payload;
        }
      });
  },
});

export const {clearCandidateError, clearCandidateProfile} = candidateSlice.actions;
export default candidateSlice.reducer;
