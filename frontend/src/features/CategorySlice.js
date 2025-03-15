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
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Entity adapter to manage normalized category data
const categoryEntity = createEntityAdapter({
  selectId: (category) => category.id,
});

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

// Selectors for accessing normalized category data
export const categorySelectors = categoryEntity.getSelectors(
  (state) => state.category
);

export default categorySlice.reducer;
