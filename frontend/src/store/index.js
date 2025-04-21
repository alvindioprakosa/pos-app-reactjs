import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../features/CategorySlice";
import productReducer from "../features/ProductSlice";
import cartReducer from "../features/CartSlice";

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
  },
});
