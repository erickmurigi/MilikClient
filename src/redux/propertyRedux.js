// redux/propertySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8800/api";

// Async thunks using createAsyncThunk
export const getProperties = createAsyncThunk(
  'property/getProperties',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('milik_token') || localStorage.getItem('token');
      const state = getState();

      // Resolve business from params or current company slice
      const resolvedBusinessId = params.business || state.company?.currentCompany?._id;

      // Build query params safely (never send "undefined")
      const queryParams = new URLSearchParams();
      Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      if (resolvedBusinessId) {
        queryParams.set('business', resolvedBusinessId);
      }

      const response = await axios.get(
        `${API_URL}/properties${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch properties');
    }
  }
);

export const createProperty = createAsyncThunk(
  'property/createProperty',
  async (propertyData, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('milik_token') || localStorage.getItem('token');
      const state = getState();

      const resolvedBusinessId = propertyData.business || state.company?.currentCompany?._id;
      if (!resolvedBusinessId) {
        return rejectWithValue('Please select a company before creating a property.');
      }

      // Add business and user info to property data
      const dataWithContext = {
        ...propertyData,
        business: resolvedBusinessId,
        createdBy: state.auth?.user?._id,
        updatedBy: state.auth?.user?._id
      };
      
      console.log('Creating property with data:', dataWithContext);
      
      const response = await axios.post(
        `${API_URL}/properties`,
        dataWithContext,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Property creation error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to create property');
    }
  }
);

export const updateProperty = createAsyncThunk(
  'property/updateProperty',
  async ({ id, propertyData }, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const state = getState();
      
      // Add updatedBy info
      const dataWithContext = {
        ...propertyData,
        updatedBy: state.auth?.user?._id
      };
      
      const response = await axios.put(
        `${API_URL}/properties/${id}`,
        dataWithContext,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update property');
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'property/deleteProperty',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_URL}/properties/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete property');
    }
  }
);

export const getPropertyById = createAsyncThunk(
  'property/getPropertyById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/properties/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch property');
    }
  }
);

const propertySlice = createSlice({
  name: "property",
  initialState: {
    properties: [],
    currentProperty: null,
    pagination: {
      total: 0,
      page: 1,
      pages: 1,
      limit: 10
    },
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.success = false;
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    },
    resetPropertyState: (state) => {
      state.properties = [];
      state.currentProperty = null;
      state.pagination = { total: 0, page: 1, pages: 1, limit: 10 };
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Properties
      .addCase(getProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.data || action.payload;
        state.pagination = action.payload.pagination || {
          total: action.payload.length || 0,
          page: 1,
          pages: 1,
          limit: 50
        };
      })
      .addCase(getProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Property
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.properties.unshift(action.payload.data);
        state.pagination.total += 1;
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Property by ID
      .addCase(getPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProperty = action.payload.data;
      })
      .addCase(getPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Property
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.properties.findIndex(
          property => property._id === action.payload.data._id
        );
        if (index !== -1) {
          state.properties[index] = action.payload.data;
        }
        if (state.currentProperty && 
            state.currentProperty._id === action.payload.data._id) {
          state.currentProperty = action.payload.data;
        }
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Property
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.properties = state.properties.filter(
          property => property._id !== action.payload.id
        );
        state.pagination.total -= 1;
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrentProperty, resetPropertyState } = propertySlice.actions;
export default propertySlice.reducer;