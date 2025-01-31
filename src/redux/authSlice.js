import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Firebase API URL
const API_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAApBXcwjy3ZbTUQ90vmW5AtbZFlIpxNMY";

// Async Thunks for Authentication
export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password}, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, {
        email,
        password,
        returnSecureToken: true,
      });
    alert(`Account created with email ${email}`)
      return  response.data;
    } catch (error) {
      
      return rejectWithValue(error?.response?.data?.error?.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAApBXcwjy3ZbTUQ90vmW5AtbZFlIpxNMY", {
        email,
        password,
        returnSecureToken: true,
      });
      localStorage.setItem("email",email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error?.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email, { rejectWithValue }) => {
    try {
     const response =  await axios.post("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAApBXcwjy3ZbTUQ90vmW5AtbZFlIpxNMY", {
        requestType: "PASSWORD_RESET",
        email,
      });
      alert(`Reset password link sent to your ${email}`);
      return email;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error?.message);
    }
  }
);

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
  enter:false
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.enter = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.email;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.email;
        state.enter = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        
        state.user = action.payload;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
