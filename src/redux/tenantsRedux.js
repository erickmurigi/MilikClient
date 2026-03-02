// redux/tenantSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { adminRequests } from "../utils/requestMethods";

// Async thunks for API calls
export const createTenant = createAsyncThunk(
  'tenant/create',
  async (tenantData, { rejectWithValue }) => {
    try {
      const response = await adminRequests.post("/tenants", tenantData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getTenants = createAsyncThunk(
  'tenant/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await adminRequests.get(`/tenants?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateTenant = createAsyncThunk(
  'tenant/update',
  async ({ id, tenantData }, { rejectWithValue }) => {
    try {
      const response = await adminRequests.put(`/tenants/${id}`, tenantData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteTenant = createAsyncThunk(
  'tenant/delete',
  async (id, { rejectWithValue }) => {
    try {
      await adminRequests.delete(`/tenants/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

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
    },
    extraReducers: (builder) => {
        // Get tenants
        builder
            .addCase(getTenants.pending, (state) => {
                state.isFetching = true;
                state.error = false;
            })
            .addCase(getTenants.fulfilled, (state, action) => {
                state.isFetching = false;
                state.tenants = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
            })
            .addCase(getTenants.rejected, (state) => {
                state.isFetching = false;
                state.error = true;
            });

        // Create tenant
        builder
            .addCase(createTenant.pending, (state) => {
                state.isFetching = true;
                state.error = false;
            })
            .addCase(createTenant.fulfilled, (state, action) => {
                state.isFetching = false;
                state.tenants.push(action.payload);
            })
            .addCase(createTenant.rejected, (state) => {
                state.isFetching = false;
                state.error = true;
            });

        // Update tenant
        builder
            .addCase(updateTenant.pending, (state) => {
                state.isFetching = true;
                state.error = false;
            })
            .addCase(updateTenant.fulfilled, (state, action) => {
                state.isFetching = false;
                const index = state.tenants.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.tenants[index] = action.payload;
                }
            })
            .addCase(updateTenant.rejected, (state) => {
                state.isFetching = false;
                state.error = true;
            });

        // Delete tenant
        builder
            .addCase(deleteTenant.pending, (state) => {
                state.isFetching = true;
                state.error = false;
            })
            .addCase(deleteTenant.fulfilled, (state, action) => {
                state.isFetching = false;
                state.tenants = state.tenants.filter((item) => item._id !== action.payload);
            })
            .addCase(deleteTenant.rejected, (state) => {
                state.isFetching = false;
                state.error = true;
            });
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