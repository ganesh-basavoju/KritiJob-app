// ============================================
// REDUX STORE
// ============================================

import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import candidateReducer from './slices/candidateSlice';
import jobsReducer from './slices/jobsSlice';
import applicationsReducer from './slices/applicationsSlice';
import employerReducer from './slices/employerSlice';
import companiesReducer from './slices/companiesSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    candidate: candidateReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
    employer: employerReducer,
    companies: companiesReducer,
    notifications: notificationsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
