import { createSlice } from "@reduxjs/toolkit";

export const businessSlice = createSlice({
    name: "business",
    initialState: {
        businesses: [],
        isFetching: false,
        error: false
    },
    reducers: {
        // Get all businesses
        getBusinessesStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getBusinessesSuccess: (state, action) => {
            state.isFetching = false;
            state.businesses = action.payload;
        },
        getBusinessesFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },

        // Create a business
        createBusinessStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        createBusinessSuccess: (state, action) => {
            state.isFetching = false;
            state.businesses.push(action.payload);
        },
        createBusinessFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },

        // Update a business
        updateBusinessStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateBusinessSuccess: (state, action) => {
            state.isFetching = false;
            const { id, business } = action.payload;
            const index = state.businesses.findIndex((item) => item._id === id);
            if (index !== -1) {
                const updatedBusiness = { ...state.businesses[index], ...business };
                state.businesses[index] = updatedBusiness;
            }
        },
        updateBusinessFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },

        // Delete a business
        deleteBusinessStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteBusinessSuccess: (state, action) => {
            state.isFetching = false;
            state.businesses.splice(
                state.businesses.findIndex((item) => item._id === action.payload),
                1
            );
        },
        deleteBusinessFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        }
    }
});

export const {
    createBusinessStart,
    createBusinessSuccess,
    createBusinessFailure,
    getBusinessesStart,
    getBusinessesSuccess,
    getBusinessesFailure,
    updateBusinessStart,
    updateBusinessSuccess,
    updateBusinessFailure,
    deleteBusinessStart,
    deleteBusinessSuccess,
    deleteBusinessFailure
} = businessSlice.actions;

export default businessSlice.reducer;
