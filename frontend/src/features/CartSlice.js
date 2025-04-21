import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Helper functions
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
  state.error = action.payload || action.error.message;
  state.loading = false;
  state.data = null;
};

// Get all cart items
export const getCart = createAsyncThunk("cart/getCart", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/carts");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Add item to cart
export const inputCart = createAsyncThunk("cart/inputCart", async (data, { rejectWithValue }) => {
  try {
    await axios.post("/carts", data);
    const response = await axios.get("/carts");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Update cart item
export const updateCart = createAsyncThunk("cart/updateCart", async (data, { rejectWithValue }) => {
  try {
    await axios.put(`/carts/${data.id}`, data);
    const response = await axios.get("/carts");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Delete cart item
export const delCart = createAsyncThunk("cart/delCart", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/carts/${id}`);
    const response = await axios.get("/carts");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Update quantity and total price
export const updCart = createAsyncThunk("cart/updCart", async (data, { rejectWithValue }) => {
  try {
    const updatedData = { ...data, totalPrice: data.qty * data.price };
    await axios.put(`/carts/${data.id}`, updatedData);
    const response = await axios.get("/carts");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Save order and clear cart
export const saveOrder = createAsyncThunk("cart/saveOrder", async (orderData, { rejectWithValue }) => {
  try {
    await axios.post("/orders", orderData);
    const cartItems = (await axios.get("/carts")).data;

    for (const item of cartItems) {
      try {
        await axios.delete(`/carts/${item.id}`);
      } catch (err) {
        console.error("Error deleting cart item:", err);
      }
    }

    return [];
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Set detail (for editing or detail view)
export const setDetail = createAsyncThunk("cart/setDetail", async (data) => data);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    data: [],
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
        state.data = [];
      })
      .addCase(saveOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(saveOrder.rejected, handleAsyncRejected)

      .addCase(setDetail.fulfilled, (state, action) => {
        state.dataEdit = action.payload;
      });
  },
});

export default cartSlice.reducer;
