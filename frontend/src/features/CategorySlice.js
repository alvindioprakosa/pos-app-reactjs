import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all categories
export const getAllCategory = createAsyncThunk(
  "category/getAllCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/categories");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const categoryEntity = createEntityAdapter({
  selectId: (category) => category.id,
});

// Slice
const categorySlice = createSlice({
  name: "category",
  initialState: categoryEntity.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        categoryEntity.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const categorySelectors = categoryEntity.getSelectors(
  (state) => state.category
);

export default categorySlice.reducer;
