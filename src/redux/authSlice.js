import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  isFetching: false,
  error: false,
  token: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login
    loginStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.error = false;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
      state.isLoggedIn = false;
    },

    // Logout
    logoutStart: (state) => {
      state.isFetching = true;
    },
    logoutSuccess: (state) => {
      state.isFetching = false;
      state.currentUser = null;
      state.token = null;
      state.isLoggedIn = false;
      state.error = false;
    },
    logoutFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // Get current user
    getCurrentUserStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getCurrentUserSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.error = false;
    },
    getCurrentUserFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // Set token (from localStorage)
    setToken: (state, action) => {
      state.token = action.payload;
    },

    // Initialize auth from localStorage
    initializeAuth: (state, action) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = !!action.payload.token;
    },

    // Clear auth on error
    clearAuth: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isLoggedIn = false;
      state.error = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  getCurrentUserStart,
  getCurrentUserSuccess,
  getCurrentUserFailure,
  setToken,
  initializeAuth,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
