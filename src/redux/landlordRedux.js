// redux/landlordSlice.js
import { createSlice } from "@reduxjs/toolkit"

export const landlordSlice = createSlice({
    name: "landlord",
    initialState: {
        landlords: [],
        isFetching: false,
        error: false
    },
    reducers: {
        // Get all landlords
        getLandlordsStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        getLandlordsSuccess: (state, action) => {
            state.isFetching = false
            state.landlords = action.payload
        },
        getLandlordsFailure: (state) => {
            state.isFetching = false
            state.error = true
        },

        // Create landlord
        createLandlordStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        createLandlordSuccess: (state, action) => {
            state.isFetching = false
            state.landlords.push(action.payload)
        },
        createLandlordFailure: (state) => {
            state.isFetching = false
            state.error = true
        },

        // Update landlord
        updateLandlordStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        updateLandlordSuccess: (state, action) => {
            state.isFetching = false
            const index = state.landlords.findIndex((item) => item._id === action.payload._id)
            if (index !== -1) {
                state.landlords[index] = action.payload
            }
        },
        updateLandlordFailure: (state) => {
            state.isFetching = false
            state.error = true
        },

        // Delete landlord
        deleteLandlordStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        deleteLandlordSuccess: (state, action) => {
            state.isFetching = false
            state.landlords.splice(
                state.landlords.findIndex((item) => item._id === action.payload),
                1
            )
        },
        deleteLandlordFailure: (state) => {
            state.isFetching = false
            state.error = true
        }
    }
})

export const {
    getLandlordsStart,
    getLandlordsSuccess,
    getLandlordsFailure,
    createLandlordStart,
    createLandlordSuccess,
    createLandlordFailure,
    updateLandlordStart,
    updateLandlordSuccess,
    updateLandlordFailure,
    deleteLandlordStart,
    deleteLandlordSuccess,
    deleteLandlordFailure
} = landlordSlice.actions

export default landlordSlice.reducer