// redux/unitSlice.js
import { createSlice } from "@reduxjs/toolkit"

export const unitSlice = createSlice({
    name: "unit",
    initialState: {
        units: [],
        isFetching: false,
        error: false
    },
    reducers: {
        // Get all units
        getUnitsStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        getUnitsSuccess: (state, action) => {
            state.isFetching = false
            state.units = action.payload
        },
        getUnitsFailure: (state) => {
            state.isFetching = false
            state.error = true
        },

        // Create unit
        createUnitStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        createUnitSuccess: (state, action) => {
            state.isFetching = false
            state.units.push(action.payload)
        },
        createUnitFailure: (state) => {
            state.isFetching = false
            state.error = true
        },

        // Update unit
        updateUnitStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        updateUnitSuccess: (state, action) => {
            state.isFetching = false
            const index = state.units.findIndex((item) => item._id === action.payload._id)
            if (index !== -1) {
                state.units[index] = action.payload
            }
        },
        updateUnitFailure: (state) => {
            state.isFetching = false
            state.error = true
        },

        // Delete unit
        deleteUnitStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        deleteUnitSuccess: (state, action) => {
            state.isFetching = false
            state.units.splice(
                state.units.findIndex((item) => item._id === action.payload),
                1
            )
        },
        deleteUnitFailure: (state) => {
            state.isFetching = false
            state.error = true
        },

        // Update unit status
        updateUnitStatusStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        updateUnitStatusSuccess: (state, action) => {
            state.isFetching = false
            const index = state.units.findIndex((item) => item._id === action.payload._id)
            if (index !== -1) {
                state.units[index] = action.payload
            }
        },
        updateUnitStatusFailure: (state) => {
            state.isFetching = false
            state.error = true
        }
    }
})

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
    updateUnitStatusFailure
} = unitSlice.actions

export default unitSlice.reducer