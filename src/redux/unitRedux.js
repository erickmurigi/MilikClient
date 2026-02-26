// redux/unitSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  units: [],
  isFetching: false,
  error: false,
};

export const unitSlice = createSlice({
  name: "unit",
  initialState,
  reducers: {
    // Get all units
    getUnitsStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getUnitsSuccess: (state, action) => {
      state.isFetching = false;
      state.units = Array.isArray(action.payload) ? action.payload : [];
    },
    getUnitsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // Create unit
    createUnitStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    createUnitSuccess: (state, action) => {
      state.isFetching = false;
      state.units.push(action.payload);
    },
    createUnitFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // Update unit
    updateUnitStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateUnitSuccess: (state, action) => {
      state.isFetching = false;
      const index = state.units.findIndex((item) => item._id === action.payload?._id);
      if (index !== -1) state.units[index] = action.payload;
    },
    updateUnitFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // Delete unit
    deleteUnitStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteUnitSuccess: (state, action) => {
      state.isFetching = false;
      const idx = state.units.findIndex((item) => item._id === action.payload);
      if (idx !== -1) state.units.splice(idx, 1);
    },
    deleteUnitFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // Update unit status (single)
    updateUnitStatusStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateUnitStatusSuccess: (state, action) => {
      state.isFetching = false;
      const index = state.units.findIndex((item) => item._id === action.payload?._id);
      if (index !== -1) state.units[index] = action.payload;
    },
    updateUnitStatusFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // ✅ Archive units (bulk)
    archiveUnitsStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    archiveUnitsSuccess: (state, action) => {
      state.isFetching = false;
      const ids = Array.isArray(action.payload) ? action.payload : [];
      state.units = state.units.map((u) =>
        ids.includes(u._id) ? { ...u, status: "Archived" } : u
      );
    },
    archiveUnitsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // ✅ Restore units (bulk)
    restoreUnitsStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    restoreUnitsSuccess: (state, action) => {
      state.isFetching = false;
      const ids = Array.isArray(action.payload) ? action.payload : [];
      state.units = state.units.map((u) =>
        ids.includes(u._id) ? { ...u, status: "Active" } : u
      );
    },
    restoreUnitsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getUnitsStart,
  getUnitsSuccess,
  getUnitsFailure,

  createUnitStart,
  createUnitSuccess,
  createUnitFailure,

  updateUnitStart,
  updateUnitSuccess,
  updateUnitFailure,

  deleteUnitStart,
  deleteUnitSuccess,
  deleteUnitFailure,

  updateUnitStatusStart,
  updateUnitStatusSuccess,
  updateUnitStatusFailure,

  archiveUnitsStart,
  archiveUnitsSuccess,
  archiveUnitsFailure,

  restoreUnitsStart,
  restoreUnitsSuccess,
  restoreUnitsFailure,
} = unitSlice.actions;

export default unitSlice.reducer;