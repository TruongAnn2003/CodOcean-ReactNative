import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProfileAPI,
  getAllSolvedProblemsAPI,
  getAllUploadedProblemsAPI,
} from "../../api/profile";

const initialState = {
  isLoading: false,
  profile: {},
  error: null,
  solvedProblems: [],
  uploadedProblems: [],
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
        state.profile = action.payload;
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
      .addCase(getAllUploadedProblems.rejected, handleRejected);
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
