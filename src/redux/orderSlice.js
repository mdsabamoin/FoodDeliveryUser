import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const FIREBASE_URL = "https://fooddeliveryapp-406eb-default-rtdb.firebaseio.com/orders";

// Add Order to Firebase
export const addToOrdersAsync = createAsyncThunk(
  'orders/addToOrdersAsync',
  async (orderData, { rejectWithValue }) => {
    try {
      const { customerName, items, status, address, paymentMethod } = orderData;
      const response = await axios.post(`${FIREBASE_URL}.json`, { customerName, items, status, address, paymentMethod });
      return { firebaseId: response.data.name, customerName, items, status, address, paymentMethod };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Orders from Firebase
export const fetchOrdersAsync = createAsyncThunk(
  'orders/fetchOrdersAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${FIREBASE_URL}.json`);
      console.log("response.dat in orderslice",response.data);
      if (!response.data) return [];

      // Convert Firebase object to array
      const ordersList = Object.keys(response.data).map((id) => ({
        id,
        ...response.data[id],
      }));

      return ordersList;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],  // Renamed from "items" to "orders"
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add Order
      .addCase(addToOrdersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToOrdersAsync.fulfilled, (state, action) => {
        state.orders.push(action.payload);  // Push new order instead of spreading array
        state.status = "succeeded";  // Keep consistent with fetchOrdersAsync
      })
      .addCase(addToOrdersAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default orderSlice.reducer;
