import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to handle pending, fulfilled, and rejected states
const handleAsyncState = (state) => {
  state.loading = true;
  state.error = null;
};

const handleAsyncFulfilled = (state, action) => {
  state.data = action.payload;
  state.loading = false;
  state.error = null;
};

const handleAsyncRejected = (state, action) => {
  state.error = action.error.message;
  state.loading = false;
  state.data = null;
};

// Fetch cart
export const getCart = createAsyncThunk("cart/getCart", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/carts");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Add cart item
export const inputCart = createAsyncThunk("cart/inputCart", async (data, { rejectWithValue }) => {
  try {
    await axios.post("/carts", data);
    const response = await axios.get("/carts");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Update cart item
export const updateCart = createAsyncThunk("cart/updateCart", async (data, { rejectWithValue }) => {
  try {
    await axios.put(`/carts/${data.id}`, data);
    const response = await axios.get("/carts");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Delete cart item
export const delCart = createAsyncThunk("cart/delCart", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/carts/${id}`);
    const response = await axios.get("/carts");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Update cart total price
export const updCart = createAsyncThunk("cart/updCart", async (data, { rejectWithValue }) => {
  try {
    data.totalPrice = data.qty * data.price;
    await axios.put(`/carts/${data.id}`, data);
    const response = await axios.get("/carts");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Save order and clear cart
export const saveOrder = createAsyncThunk("cart/saveOrder", async (data, { rejectWithValue }) => {
  try {
    await axios.post("/orders", data);
    const cartResponse = await axios.get("/carts");
    const cartData = cartResponse.data;
    for (const item of cartData) {
      try {
        await axios.delete(`/carts/${item.id}`);
      } catch (error) {
        // If error deleting a specific cart item, skip and continue with the next
        console.error("Error deleting cart item:", error);
      }
    }
    return cartResponse.data; // Return updated cart
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Set cart detail
export const setDetail = createAsyncThunk("cart/setDetail", async (data) => {
  return data;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    data: null,
    loading: false,
    error: null,
    dataEdit: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, handleAsyncState)
      .addCase(getCart.fulfilled, handleAsyncFulfilled)
      .addCase(getCart.rejected, handleAsyncRejected)
      
      .addCase(inputCart.pending, handleAsyncState)
      .addCase(inputCart.fulfilled, handleAsyncFulfilled)
      .addCase(inputCart.rejected, handleAsyncRejected)
      
      .addCase(updateCart.pending, handleAsyncState)
      .addCase(updateCart.fulfilled, handleAsyncFulfilled)
      .addCase(updateCart.rejected, handleAsyncRejected)
      
      .addCase(delCart.pending, handleAsyncState)
      .addCase(delCart.fulfilled, handleAsyncFulfilled)
      .addCase(delCart.rejected, handleAsyncRejected)
      
      .addCase(updCart.pending, handleAsyncState)
      .addCase(updCart.fulfilled, handleAsyncFulfilled)
      .addCase(updCart.rejected, handleAsyncRejected)
      
      .addCase(saveOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(saveOrder.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saveOrder.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
        state.data = null;
      })
      
      .addCase(setDetail.fulfilled, (state, action) => {
        state.dataEdit = action.payload;
      });
  },
});

export default cartSlice.reducer;
