import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addReactDiscussionAPI,
  deleteReactDiscussionAPI,
} from "../../api/discusssion/reactAPI";
import { getCategoriesAPI } from "../../api/discusssion/categoryAPI";
import {
  addDiscussionAPI,
  updateDiscussionAPI,
  deleteDiscussionAPI,
  getDiscussionAPI,
  getDiscussionsAPI,
} from "../../api/discusssion/discussionAPI";
import {
  replyCommentAPI,
  getRepliesCommentByIdAPI,
  getCommentAPI,
  getCommentsAPI,
  addCommentAPI,
  updateCommentAPI,
  deleteCommentAPI,
} from "../../api/discusssion/commentAPI";

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
  "/discussion/get-all-categories/request-auth",
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
  "/discussion/get-discussions/request-auth",
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
  "/discussion/react/add-react-discussion/request-auth",
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
  "/discussion/react/delete-react-discussion/request-auth",
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
  "/discussion/comment/get-comment/request-auth",
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
  "/discussion/comment/get-comments/request-auth",
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
  "/discussion/comment/add-comment/request-auth",
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
  "/discussion/comment/update-comment/request-auth",
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
  "/discussion/comment/delete-comment/request-auth",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteCommentAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to delete comment");
    }
  }
);

export const replyComment = createAsyncThunk(
  "/discussion/comment/reply/request-auth",
  async (request, { rejectWithValue }) => {
    try {
      const response = await replyCommentAPI(request);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to delete comment");
    }
  }
);
export const getRepliesCommentById = createAsyncThunk(
  "/discussion/comment/get-replies-by-id/request-auth",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRepliesCommentByIdAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to delete comment");
    }
  }
);

export const addDiscussion = createAsyncThunk(
  "/discussion/add/request-auth",
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
  "/discussion/update/request-auth",
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
  "/discussion/delete/request-auth",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteDiscussionAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Delete discussion failed");
    }
  }
);

export const getDiscussion = createAsyncThunk(
  "/discussion/get-discussion-by-id/request-auth",
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
  state.error = action.payload || "An error occurred";
};

const discussionSlice = createSlice({
  name: "discussion",
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
      .addCase(deleteComment.rejected, handleRejected)

      .addCase(replyComment.pending, handlePending)
      .addCase(replyComment.fulfilled, handleFulfilled)
      .addCase(replyComment.rejected, handleRejected)

      .addCase(getRepliesCommentById.pending, handlePending)
      .addCase(getRepliesCommentById.fulfilled, handleFulfilled)
      .addCase(getRepliesCommentById.rejected, handleRejected)

      .addCase(addDiscussion.pending, handlePending)
      .addCase(addDiscussion.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.discussions.push(action.payload.discussDTOs);
      })
      .addCase(addDiscussion.rejected, handleRejected)

      .addCase(updateDiscussion.pending, handlePending)
      .addCase(updateDiscussion.fulfilled, handleFulfilled)
      .addCase(updateDiscussion.rejected, handleRejected)

      .addCase(deleteDiscussion.pending, handlePending)
      .addCase(deleteDiscussion.fulfilled, handleFulfilled)
      .addCase(deleteDiscussion.rejected, handleRejected)

      .addCase(getDiscussion.pending, handlePending)
      .addCase(getDiscussion.fulfilled, handleFulfilled)
      .addCase(getDiscussion.rejected, handleRejected);
  },
});

export const { setError, setFilters, toggleReaction } = discussionSlice.actions;
export default discussionSlice.reducer;
