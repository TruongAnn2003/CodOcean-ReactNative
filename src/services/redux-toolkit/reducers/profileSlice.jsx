import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProfileAPI,
  getAllSolvedProblemsAPI,
  getAllUploadedProblemsAPI,
  ChangeAvatarAPI,
  ChangeEmailAPI,
  ChangeProfileAPI,
} from "../../api/profile";

import {
  addReactDiscussionAPI,
  deleteReactDiscussionAPI,
} from "../../api/discuss/searchAPI";
import { deleteDiscussionAPI } from "../../api/discuss/manageAPI";

const initialState = {
  isLoading: false,
  profile: {
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    email: "",
    urlImage: "",
    createdAt: "",
    updatedAt: "",
    role: "",
    locked: false,
    vipexpDate: null,
  },
  error: null,
  solvedProblems: [],
  uploadedProblems: [],
  discussionPosts: [],
};

export const getProfile = createAsyncThunk(
  "/profile/get-profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfileAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to fetch profile");
    }
  }
);

export const getAllSolvedProblems = createAsyncThunk(
  "/profile/get-all-solved-problems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllSolvedProblemsAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Failed to fetch all solved problems"
      );
    }
  }
);

export const getAllUploadedProblems = createAsyncThunk(
  "/profile/get-all-uploaded-problems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUploadedProblemsAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Failed to fetch all uploaded problems"
      );
    }
  }
);

export const getAllUploadedDiscussions = createAsyncThunk(
  "/profile/get-all-uploaded-discussions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUploadedDiscussionsAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Failed to fetch all uploaded discussions"
      );
    }
  }
);

export const addReactDiscussion = createAsyncThunk(
  "/profile/add-react-discussion",
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
  "/profile/delete-react-discussion",
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

export const deleteDiscussion = createAsyncThunk(
  "/profile/delete-discussion",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteDiscussionAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Delete discussion failed");
    }
  }
);

export const ChangeAvatar = createAsyncThunk(
  "/profile/change-avatar",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await ChangeAvatarAPI(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Change avatar failed");
    }
  }
);

export const ChangeEmail = createAsyncThunk(
  "/profile/change-email",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await ChangeEmailAPI(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Change email failed");
    }
  }
);

export const ChangeProfile = createAsyncThunk(
  "/profile/change-profile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await ChangeProfileAPI(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Change profile failed");
    }
  }
);

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleFulfilled = (state, action) => {
  state.isLoading = false;
  state.profile = action.payload.profile || null;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload || "An error occurred";
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, handlePending)
      .addCase(getProfile.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.profile = action.payload.profile;
      })
      .addCase(getProfile.rejected, handleRejected)
      .addCase(getAllSolvedProblems.pending, handlePending)
      .addCase(getAllSolvedProblems.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.solvedProblems = action.payload;
      })
      .addCase(getAllSolvedProblems.rejected, handleRejected)
      .addCase(getAllUploadedProblems.pending, handlePending)
      .addCase(getAllUploadedProblems.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.uploadedProblems = action.payload;
      })
      .addCase(getAllUploadedProblems.rejected, handleRejected)
      .addCase(getAllUploadedDiscussions.pending, handlePending)
      .addCase(getAllUploadedDiscussions.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.discussionPosts = action.payload;
      })
      .addCase(getAllUploadedDiscussions.rejected, handleRejected)
      .addCase(addReactDiscussion.pending, handlePending)
      .addCase(addReactDiscussion.fulfilled, handleFulfilled)
      .addCase(addReactDiscussion.rejected, handleRejected)
      .addCase(deleteReactDiscussion.pending, handlePending)
      .addCase(deleteReactDiscussion.fulfilled, handleFulfilled)
      .addCase(deleteReactDiscussion.rejected, handleRejected)
      .addCase(deleteDiscussion.pending, handlePending)
      .addCase(deleteDiscussion.fulfilled, handleFulfilled)
      .addCase(deleteDiscussion.rejected, handleRejected)
      .addCase(ChangeAvatar.pending, handlePending)
      .addCase(ChangeAvatar.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.profile.urlImage = action.payload;
      })
      .addCase(ChangeAvatar.rejected, handleRejected)
      .addCase(ChangeEmail.pending, handlePending)
      .addCase(ChangeEmail.fulfilled, (state, action) => {
        handleFulfilled(state, action);
      })
      .addCase(ChangeEmail.rejected, handleRejected)
      .addCase(ChangeProfile.pending, handlePending)
      .addCase(ChangeProfile.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.profile = action.payload.profile;
      })
      .addCase(ChangeProfile.rejected, handleRejected);
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
