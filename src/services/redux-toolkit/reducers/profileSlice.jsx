import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProfileAPI,
  getAllUploadedDiscussionsAPI,
  getAllUploadedProblemsAPI,
  getAllSolvedProblemsAPI,
  ChangeAvatarAPI,
  ChangeEmailAPI,
  ChangeProfileAPI,
} from "../../api/profile";
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
  "/profile/get-profile/request-auth",
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
  "/profile/get-all-solved-problems/request-auth",
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

export const getAllUploadedDiscussions = createAsyncThunk(
  "/profile/get-all-uploaded-discussions/request-auth",
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

export const getAllUploadedProblems = createAsyncThunk(
  "/profile/get-all-uploaded-problems/request-auth",
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

export const changeAvatar = createAsyncThunk(
  "/profile/change-avatar/request-auth",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await ChangeAvatarAPI(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Change avatar failed");
    }
  }
);

export const changeEmail = createAsyncThunk(
  "/profile/change-email/request-auth",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await ChangeEmailAPI(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Change email failed");
    }
  }
);

export const changeProfile = createAsyncThunk(
  "/profile/change-profile/request-auth",
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
      .addCase(getAllSolvedProblems.fulfilled, handleFulfilled)
      .addCase(getAllSolvedProblems.rejected, handleRejected)
      .addCase(getAllUploadedDiscussions.pending, handlePending)
      .addCase(getAllUploadedDiscussions.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.discussionPosts = action.payload;
      })
      .addCase(getAllUploadedDiscussions.rejected, handleRejected)
      .addCase(getAllUploadedProblems.pending, handlePending)
      .addCase(getAllUploadedProblems.fulfilled, handleFulfilled)
      .addCase(getAllUploadedProblems.rejected, handleRejected)
      .addCase(changeAvatar.pending, handlePending)
      .addCase(changeAvatar.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        console.warn("profile", state.profile);
        state.profile = { ...state.profile, urlImage: action.payload };
      })
      .addCase(changeAvatar.rejected, handleRejected)
      .addCase(changeEmail.pending, handlePending)
      .addCase(changeEmail.fulfilled, handleFulfilled)
      .addCase(changeEmail.rejected, handleRejected)
      .addCase(changeProfile.pending, handlePending)
      .addCase(changeProfile.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        const newProfile = {
          ...action.payload.profile,
        };
        state.profile = newProfile;
      })
      .addCase(changeProfile.rejected, handleRejected);
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
