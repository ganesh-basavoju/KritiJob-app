// ============================================
// COMPANIES SLICE
// ============================================

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {companiesApi} from '../../api/companies.api';
import {Company} from '../../types';

interface CompaniesState {
  companies: Company[];
  myCompany: Company | null;
  currentCompany: Company | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

const initialState: CompaniesState = {
  companies: [],
  myCompany: null,
  currentCompany: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
};

export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (page: number, {rejectWithValue}) => {
    try {
      const response = await companiesApi.getCompanies(page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch companies');
    }
  },
);

export const fetchCompanyById = createAsyncThunk(
  'companies/fetchById',
  async (id: string, {rejectWithValue}) => {
    try {
      const company = await companiesApi.getCompanyById(id);
      return company;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch company');
    }
  },
);

export const searchCompanies = createAsyncThunk(
  'companies/search',
  async ({query, page}: {query: string; page: number}, {rejectWithValue}) => {
    try {
      const response = await companiesApi.searchCompanies(query, page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search companies');
    }
  },
);

export const createCompany = createAsyncThunk(
  'companies/create',
  async (companyData: any, {rejectWithValue}) => {
    try {
      const company = await companiesApi.createCompany(companyData);
      return company;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create company');
    }
  },
);

export const updateCompany = createAsyncThunk(
  'companies/update',
  async ({id, companyData}: {id: string; companyData: any}, {rejectWithValue}) => {
    try {
      const company = await companiesApi.updateCompany(id, companyData);
      return company;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update company');
    }
  },
);

export const fetchMyCompany = createAsyncThunk(
  'companies/fetchMyCompany',
  async (_, {rejectWithValue}) => {
    try {
      const company = await companiesApi.getMyCompany();
      return company;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch company');
    }
  },
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    clearCompaniesError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCompanies.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.companies = action.payload.data;
        } else {
          state.companies = [...state.companies, ...action.payload.data];
        }
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        };
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCompanyById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCompany = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchCompanies.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.companies = action.payload.data;
        } else {
          state.companies = [...state.companies, ...action.payload.data];
        }
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.myCompany = action.payload;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.myCompany = action.payload;
      })
      .addCase(fetchMyCompany.fulfilled, (state, action) => {
        state.myCompany = action.payload;
      });
  },
});

export const {clearCompaniesError} = companiesSlice.actions;
export default companiesSlice.reducer;
