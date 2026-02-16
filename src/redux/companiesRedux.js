// companiesRedux.js
import { createSlice } from '@reduxjs/toolkit';

export const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: [],
    isFetching: false,
    error: false,
    currentCompany: null,
  },
  reducers: {
    // GET all
    getCompaniesStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getCompaniesSuccess: (state, action) => {
      state.isFetching = false;
      state.companies = action.payload;
    },
    getCompaniesFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    // GET single
    getCompanyStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getCompanySuccess: (state, action) => {
      state.isFetching = false;
      state.currentCompany = action.payload;
    },
    getCompanyFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    // CREATE
    createCompanyStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
  createCompanySuccess: (state, action) => {
  state.isFetching = false;
  if (!Array.isArray(state.companies)) {
    state.companies = [];
  }
  state.companies.push(action.payload);
},
    createCompanyFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    // UPDATE
    updateCompanyStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateCompanySuccess: (state, action) => {
      state.isFetching = false;
      const { id, company } = action.payload;
      const index = state.companies.findIndex((item) => item._id === id);
      if (index !== -1) {
        state.companies[index] = { ...state.companies[index], ...company };
      }
    },
    updateCompanyFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    // DELETE
    deleteCompanyStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteCompanySuccess: (state, action) => {
      state.isFetching = false;
      state.companies = state.companies.filter((item) => item._id !== action.payload);
    },
    deleteCompanyFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getCompaniesStart,
  getCompaniesSuccess,
  getCompaniesFailure,
  getCompanyStart,
  getCompanySuccess,
  getCompanyFailure,
  createCompanyStart,
  createCompanySuccess,
  createCompanyFailure,
  updateCompanyStart,
  updateCompanySuccess,
  updateCompanyFailure,
  deleteCompanyStart,
  deleteCompanySuccess,
  deleteCompanyFailure,
} = companySlice.actions;

export default companySlice.reducer;