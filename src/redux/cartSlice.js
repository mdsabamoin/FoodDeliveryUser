import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Firebase API endpoint (Replace with your actual Firebase URL)
const FIREBASE_URL = "https://fooddeliveryapp-406eb-default-rtdb.firebaseio.com/cartItems";

//  1. Fetch Cart Items from Firebase
export const fetchCartItemsAsync = createAsyncThunk(
  'cart/fetchCartItemsAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${FIREBASE_URL}.json`);
      if (!response.data) return [];

      // Convert Firebase object to array
      const cartItems = Object.keys(response.data).map((firebaseId) => ({
        firebaseId,
        ...response.data[firebaseId],
      }));

      return cartItems;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//  2. Add an Item to the Cart (POST to Firebase)
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({recipe}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${FIREBASE_URL}.json`, recipe);
      return { firebaseId: response.data.name, ...recipe };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateCartAsync = createAsyncThunk(
    'cart/updateCartAsync',
    async ({ recipe }, { rejectWithValue }) => {
      try { console.log("firebaseId",recipe.firebaseId);
        console.log("recipe",recipe)
        await axios.put(`${FIREBASE_URL}/${recipe.firebaseId}.json`, recipe);  // No need to destructure response
        return recipe; // Just return the updated recipe
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// 3. Remove an Item from the Cart (DELETE from Firebase)
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async ({item}, { rejectWithValue }) => {
    try {
        console.log("itemwhendeleting",item)
      await axios.delete(`${FIREBASE_URL}/${item.firebaseId}.json`);
      return item.firebaseId; // Return ID to remove from state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//  4. Clear Cart (DELETE all items from Firebase)
export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${FIREBASE_URL}.json`);
      return []; // Return empty array to reset state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart Items
      .addCase(fetchCartItemsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartItemsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCartItemsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(updateCartAsync.pending, (state) => {
        state.status = 'loading'; // Indicate that the update is in progress
      })

      .addCase(updateCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Indicate success
        const index = state.items.findIndex((item) => item.firebaseId === action.payload.firebaseId);
        if (index !== -1) {
          state.items[index] = action.payload; // Update the item in the state
        }
      })


      .addCase(updateCartAsync.rejected, (state, action) => {
        state.status = 'failed'; // Indicate failure
        state.error = action.payload; // Store the error message
      })

      //  Add to Cart

      .addCase(addToCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];  // Simply update the state
        localStorage.setItem("cartitems",state.items.length)
      })

      .addCase(addToCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
       
      //  Remove from Cart
      .addCase(removeFromCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.firebaseId !== action.payload);
      })

      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      //  Clear Cart
      .addCase(clearCartAsync.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(clearCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })

      .addCase(clearCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  }
});

export default cartSlice.reducer;
