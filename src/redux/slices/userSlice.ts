// ============================================
// USER SLICE
// ============================================

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {userApi} from '../../api/user.api';
import {UserProfile} from '../../types';

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, {rejectWithValue}) => {
    try {
      const profile = await userApi.getProfile();
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: Partial<UserProfile>, {rejectWithValue}) => {
    try {
      const profile = await userApi.updateProfile(data);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  },
);

export const uploadResume = createAsyncThunk(
  'user/uploadResume',
  async (formData: FormData, {rejectWithValue}) => {
    try {
      const response = await userApi.uploadResume(formData);
      return response.resumeUrl;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload resume');
    }
  },
);

export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (formData: FormData, {rejectWithValue}) => {
    try {
      const avatarUrl = await userApi.uploadAvatar(formData);
      return avatarUrl;
    } catch (error: any) {
      console.error('Upload avatar error in thunk:', error);
      console.error('Error response:', error.response);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to upload avatar';
      return rejectWithValue(errorMsg);
    }
  },
);

export const deleteResume = createAsyncThunk(
  'user/deleteResume',
  async (resumeId: string, {rejectWithValue}) => {
    try {
      await userApi.deleteResume(resumeId);
      return resumeId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete resume');
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.resume = action.payload;
        }
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.avatar = action.payload;
        }
      });
  },
});

export const {clearUserError} = userSlice.actions;
export default userSlice.reducer;
