import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addDiscussionAPI,
  updateDiscussionAPI,
  deleteDiscussionAPI,
  getCategoriesAPI,
  getDiscussionAPI
} from "../../api/discuss/manageAPI";

const initialState = {
  isLoading: false,
  error: null,
  discussion: {
    title: "",
    description: "",
    categories: [],
    endAt: null,
    image: "",
  },
  categories: [],
};

export const addDiscussion = createAsyncThunk(
  "/manage-discussion/add",
  async (request, { rejectWithValue }) => {
    try {
      const response = await addDiscussionAPI(request);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Add discussion failed");
    }
  }
);

export const updateDiscussion = createAsyncThunk(
  "/manage-discussion/update",
  async ({ id, discussion }, { rejectWithValue }) => {
    try {
      const response = await updateDiscussionAPI(id, discussion);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Update discussion failed");
    }
  }
);

export const deleteDiscussion = createAsyncThunk(
  "/manage-discussion/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteDiscussionAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Delete discussion failed");
    }
  }
);

export const getCategories = createAsyncThunk(
  "/search-discussion/get-all-categories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategoriesAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Get all categories failed"
      );
    }
  }
);

export const getDiscussion = createAsyncThunk(
  "/search-discussion/get-discussion-by-id",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getDiscussionAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Get discussion by id failed"
      );
    }
  }
);

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleFulfilled = (state, action) => {
  state.isLoading = false;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload.message || "An error occurred";
};

const solveProblemSlice = createSlice({
  name: "manage-discussion",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload.error;
    },
    setDiscussion: (state, action) => {
      state.discussion = action.payload.discussion;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDiscussion.pending, handlePending)
      .addCase(addDiscussion.fulfilled, handleFulfilled)
      .addCase(addDiscussion.rejected, handleRejected)
      .addCase(updateDiscussion.pending, handlePending)
      .addCase(updateDiscussion.fulfilled, handleFulfilled)
      .addCase(updateDiscussion.rejected, handleRejected)
      .addCase(deleteDiscussion.pending, handlePending)
      .addCase(deleteDiscussion.fulfilled, handleFulfilled)
      .addCase(deleteDiscussion.rejected, handleRejected)
      .addCase(getCategories.pending, handlePending)
      .addCase(getCategories.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, handleRejected)
      .addCase(getDiscussion.pending, handlePending)
      .addCase(getDiscussion.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.discussion = action.payload;
      })
      .addCase(getDiscussion.rejected, handleRejected);
  },
});

export const { setError, setDiscussion } = solveProblemSlice.actions;
export default solveProblemSlice.reducer;
