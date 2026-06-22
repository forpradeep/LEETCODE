import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient'

export const registerUser = createAsyncThunk(
  'auth/register', // prefix for action type , had pending, fulfilled and rejected cases
  async (userData, { rejectWithValue }) => { // user data has data from form and rejectWithValue is used to handle errors
    try {
    const response =  await axiosClient.post('/user/register', userData); // send post request to backend with user data
    return response.data.user; // return user data from backend
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const loginUser = createAsyncThunk(
  'auth/login', // prefix for action type , had pending, fulfilled and rejected cases
  async (credentials, { rejectWithValue }) => { // credentials has data from form and rejectWithValue is used to handle errors
    try {
      const response = await axiosClient.post('/user/login', credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check', // prefix for action type , had pending, fulfilled and rejected cases
  async (_, { rejectWithValue }) => { // no data is needed for this request, so we use _ to ignore the first argument
    try {
      const { data } = await axiosClient.get('/user/check');// send get request to backend to check if user is authenticated
      return data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue(null); // Special case for no session
      }
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout', // prefix for action type , had pending, fulfilled and rejected cases
  async (_, { rejectWithValue }) => { // no data is needed for this request, so we use _ to ignore the first argument
    try {
      await axiosClient.post('/user/logout'); // send post request to backend to logout user
      return null;  // return null to clear user data in state
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth', // name of the slice
  initialState: {
    user: null, // user data will be stored here after login or registration
    isAuthenticated: false, // will be true if user is logged in
    loading: false, // will be true when an async action is in progress
    error: null // will store error messages from async actions
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Register User Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Login User Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Check Auth Cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Logout User Cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      });
  }
});

export default authSlice.reducer;