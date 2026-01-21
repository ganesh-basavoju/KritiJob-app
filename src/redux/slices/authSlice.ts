// ============================================
// AUTH SLICE
// ============================================

import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {authApi} from '../../api/auth.api';
import {storageService} from '../../services/storage.service';
import {User, UserRole} from '../../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({email, password}: {email: string; password: string}, {rejectWithValue}) => {
    try {
      const response = await authApi.login(email, password);
      await storageService.saveTokens(response.token, response.token);
      await storageService.saveUser(response.user);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Login failed');
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    {
      email,
      password,
      name,
      role,
      phone,
    }: {
      email: string;
      password: string;
      name: string;
      role: UserRole;
      phone?: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const response = await authApi.register(email, password, name, role, phone);
      await storageService.saveTokens(response.token, response.token);
      await storageService.saveUser(response.user);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Registration failed');
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_, {rejectWithValue}) => {
  try {
    await authApi.logout();
    await storageService.removeTokens();
    await storageService.removeUser();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, {rejectWithValue}) => {
  try {
    const user = await storageService.getUser();
    if (!user) {
      throw new Error('No user found');
    }
    return user;
  } catch (error: any) {
    return rejectWithValue('Failed to load user');
  }
});

export const updateFCMToken = createAsyncThunk(
  'auth/updateFCMToken',
  async (fcmToken: string, {rejectWithValue}) => {
    try {
      await authApi.updateFCMToken(fcmToken);
      return fcmToken;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update FCM token');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, state => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateFCMToken.fulfilled, (state, action) => {
        if (state.user) {
          state.user.fcmToken = action.payload;
        }
      });
  },
});

export const {clearError, setUser} = authSlice.actions;
export default authSlice.reducer;
