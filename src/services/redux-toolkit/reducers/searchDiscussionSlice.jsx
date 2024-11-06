import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getCategoriesAPI,
  getDiscussionsAPI,
  addReactDiscussionAPI,
  deleteReactDiscussionAPI,
  getCommentAPI,
  getCommentsAPI,
  addCommentAPI,
  updateCommentAPI,
  deleteCommentAPI,
} from "../../api/discuss/searchAPI.jsx";

const initialState = {
  isLoading: false,
  error: null,
  filters: {
    pageNumber: 0,
    limit: 10,
    searchTerm: "",
    category: "",
  },
  discussionPosts: [],
  categories: [],
};

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

export const getDiscussions = createAsyncThunk(
  "/search-discussion/get-discussions",
  async (request, { rejectWithValue }) => {
    try {
      const response = await getDiscussionsAPI(request);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Get discussions failed");
    }
  }
);

export const addReactDiscussion = createAsyncThunk(
  "/search-discussion/react/add-react-discussion",
  async (request, { rejectWithValue }) => {
    try {
      const response = await addReactDiscussionAPI(request);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Add react discussion failed"
      );
    }
  }
);

export const deleteReactDiscussion = createAsyncThunk(
  "/search-discussion/react/delete-react-discussion",
  async (request, { rejectWithValue }) => {
    try {
      const response = await deleteReactDiscussionAPI(request);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Delete react discussion failed"
      );
    }
  }
);

export const getComment = createAsyncThunk(
  "/comment-discussion/comment/get-comment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getCommentAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Failed to fetch comment by id"
      );
    }
  }
);

export const getComments = createAsyncThunk(
  "/search-discussion/comment/get-comments",
  async (discussId, { rejectWithValue }) => {
    try {
      const response = await getCommentsAPI(discussId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Failed to fetch comments of discussion"
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "/search-discussion/comment/add-comment",
  async (request, { rejectWithValue }) => {
    try {
      const response = await addCommentAPI(request);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to add comment");
    }
  }
);

export const updateComment = createAsyncThunk(
  "/search-discussion/comment/update-comment",
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const response = await updateCommentAPI(id, text);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to update comment");
    }
  }
);

export const deleteComment = createAsyncThunk(
  "/search-discussion/comment/delete-comment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteCommentAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to delete comment");
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
  name: "search-discussion",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload.error;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload.newFilters };
    },
    toggleReaction: (state, action) => {
      const postId = action.payload;
      const postIndex = state.discussionPosts.findIndex(
        (post) => post.id === postId
      );
      if (postIndex !== -1) {
        const discussionPost = state.discussionPosts[postIndex];
        discussionPost.liked = !discussionPost.liked;
        if (discussionPost.liked) {
          discussionPost.reactCount += 1;
        } else {
          discussionPost.reactCount -= 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, handlePending)
      .addCase(getCategories.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, handleRejected)
      .addCase(getDiscussions.pending, handlePending)
      .addCase(getDiscussions.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.discussionPosts = action.payload.discussDTOs;
      })
      .addCase(getDiscussions.rejected, handleRejected)
      .addCase(addReactDiscussion.pending, handlePending)
      .addCase(addReactDiscussion.fulfilled, handleFulfilled)
      .addCase(addReactDiscussion.rejected, handleRejected)
      .addCase(deleteReactDiscussion.pending, handlePending)
      .addCase(deleteReactDiscussion.fulfilled, handleFulfilled)
      .addCase(deleteReactDiscussion.rejected, handleRejected)
      .addCase(getComments.pending, handlePending)
      .addCase(getComments.fulfilled, handleFulfilled)
      .addCase(getComments.rejected, handleRejected)
      .addCase(getComment.pending, handlePending)
      .addCase(getComment.fulfilled, handleFulfilled)
      .addCase(getComment.rejected, handleRejected)
      .addCase(addComment.pending, handlePending)
      .addCase(addComment.fulfilled, handleFulfilled)
      .addCase(addComment.rejected, handleRejected)
      .addCase(updateComment.pending, handlePending)
      .addCase(updateComment.fulfilled, handleFulfilled)
      .addCase(updateComment.rejected, handleRejected)
      .addCase(deleteComment.pending, handlePending)
      .addCase(deleteComment.fulfilled, handleFulfilled)
      .addCase(deleteComment.rejected, handleRejected);
  },
});

export const { setError, setFilters, toggleReaction } =
  solveProblemSlice.actions;
export default solveProblemSlice.reducer;
