import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import recipesReducer from './recipesSlice';
import categoriesReducer from './categoriesSlice';
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    recipes: recipesReducer,
    cart:cartReducer,
    orders:orderReducer
  },
});

export default store;