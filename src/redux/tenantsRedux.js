// redux/tenantSlice.js
import { createSlice } from "@reduxjs/toolkit"

export const tenantSlice = createSlice({
    name: "tenant",
    initialState: {
        tenants: [],
        isFetching: false,
        error: false
    },
    reducers: {
        // Get all tenants
        getTenantsStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        getTenantsSuccess: (state, action) => {
            state.isFetching = false
            state.tenants = action.payload
        },
        getTenantsFailure: (state) => {
            state.isFetching = false
            state.error = true
        },

        // Create tenant
        createTenantStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        createTenantSuccess: (state, action) => {
            state.isFetching = false
            state.tenants.push(action.payload)
        },
        createTenantFailure: (state) => {
            state.isFetching = false
            state.error = true
        },

        // Update tenant
        updateTenantStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        updateTenantSuccess: (state, action) => {
            state.isFetching = false
            const index = state.tenants.findIndex((item) => item._id === action.payload._id)
            if (index !== -1) {
                state.tenants[index] = action.payload
            }
        },
        updateTenantFailure: (state) => {
            state.isFetching = false
            state.error = true
        },

        // Delete tenant
        deleteTenantStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        deleteTenantSuccess: (state, action) => {
            state.isFetching = false
            state.tenants.splice(
                state.tenants.findIndex((item) => item._id === action.payload),
                1
            )
        },
        deleteTenantFailure: (state) => {
            state.isFetching = false
            state.error = true
        },

        // Update tenant status
        updateTenantStatusStart: (state) => {
            state.isFetching = true
            state.error = false
        },
        updateTenantStatusSuccess: (state, action) => {
            state.isFetching = false
            const index = state.tenants.findIndex((item) => item._id === action.payload._id)
            if (index !== -1) {
                state.tenants[index] = action.payload
            }
        },
        updateTenantStatusFailure: (state) => {
            state.isFetching = false
            state.error = true
        }
    }
})

export const {
    getTenantsStart,
    getTenantsSuccess,
    getTenantsFailure,
    createTenantStart,
    createTenantSuccess,
    createTenantFailure,
    updateTenantStart,
    updateTenantSuccess,
    updateTenantFailure,
    deleteTenantStart,
    deleteTenantSuccess,
    deleteTenantFailure,
    updateTenantStatusStart,
    updateTenantStatusSuccess,
    updateTenantStatusFailure
} = tenantSlice.actions

export default tenantSlice.reducer