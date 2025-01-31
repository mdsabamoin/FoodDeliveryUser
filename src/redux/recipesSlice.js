import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = "https://fooddeliveryapp-406eb-default-rtdb.firebaseio.com"

export const fetchRecipesByCategory = createAsyncThunk(
  'recipes/fetchRecipesByCategory',
  async ({categoryName}, { rejectWithValue }) => {
    try { 
      const response = await axios.get(`${api}/recipes.json`);

      const data = response.data;
      const items = Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));
     
      const filteredReceipe = items.filter((food)=>food.selectedCategory === categoryName);
      return filteredReceipe;
      
    } catch (error) {
      // Return a rejected action with error details for handling in extraReducers
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recipes for the category'
      );
    }
  }
);

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    receipeName:"",
  },
  reducers: {
    setReceipeName:(state,action)=>{
      state.receipeName = action.payload.categoryName;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipesByCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecipesByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRecipesByCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
 export const {setReceipeName} = recipesSlice.actions;
export default recipesSlice.reducer;
