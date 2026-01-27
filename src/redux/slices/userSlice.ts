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
      });
  },
});

export const {clearUserError} = userSlice.actions;
export default userSlice.reducer;
