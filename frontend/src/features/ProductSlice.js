import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all products
export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/products");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Fetch products by category
export const getProductByCategory = createAsyncThunk(
  "product/getProductByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/products?category_id=${category}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all products
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
        state.data = null;
      })

      // Get products by category
      .addCase(getProductByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductByCategory.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getProductByCategory.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
        state.data = null;
      });
  },
});

export default productSlice.reducer;
