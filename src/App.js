import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import AuthForm from "./components/AuthForm";
import LogNavbar from './components/LogNavbar';
import Categories from './components/Categories';
import Recipes from './components/Recipes';
import RecipeDetails from './components/RecipeDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Orders from "./components/Orders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div><AuthForm /></div>, // Home page with the AuthForm
  },
  {
    path: "/categories",
    element: <div><Categories /></div>, // Page to display categories
  },
  {
    path: "/recipe",
    element: <div><RecipeDetails /></div>, // Page to display recipe details
  },
  {
    path: "/cart",
    element: <div><Cart /></div>, // Cart page
  },
  {
    path: "/checkout",
    element: <div><Checkout /></div>, // Checkout page
  },
  {
    path: "/orders",
    element: <div><Orders /></div>, // Checkout page
  },
]);

function App() {
  return (
    <Provider store={store}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ flex: 1 }}>
          <Header />
          <RouterProvider router={router} />
        </div>
        <Footer />
      </div>
    </Provider>
  );
}

export default App;
