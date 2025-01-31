import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
  const api = "https://fooddeliveryapp-406eb-default-rtdb.firebaseio.com"
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/categories.json`); // Replace with your API endpoint
      
      const data = response.data;
      const items = Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));
       
      return items;
    } catch (error) {
      // Return a rejected action with error details for handling in extraReducers
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      );
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default categoriesSlice.reducer;
