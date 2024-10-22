import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { removeTokens, saveTokens } from "../../../utils/tokenUtils";
import { ROLES } from "../../../constants";
import {
  signInAPI,
  signUpAPI,
  requestOTPForActivationAPI,
  verifyOTPAPI,
  forgotPasswordAPI,
  requestOTPByEmailAPI,
  getCurrentUserAPI,
  refreshAccessTokenAPI,
  signOutAPI,
} from "../../api/auth";

const initialState = {
  isLoading: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isFirstLogin: true,
  error: null,
  role: ROLES.GUEST,
};

// Async actions
export const signUp = createAsyncThunk(
  "/auth/sign-up/request",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await signUpAPI(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Sign up failed");
    }
  }
);

export const signIn = createAsyncThunk(
  "/auth/sign-in/request",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await signInAPI(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Sign in failed");
    }
  }
);

export const requestOTPForActivation = createAsyncThunk(
  "/auth/active-account/request-auth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await requestOTPForActivationAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Account activation failed"
      );
    }
  }
);

export const requestOTPByEmail = createAsyncThunk(
  "/auth/request-otp/request",
  async (email, { rejectWithValue }) => {
    try {
      const response = await requestOTPByEmailAPI(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "OTP request failed");
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "/auth/verify-otp/request-auth",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await verifyOTPAPI(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "OTP verification failed");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "/auth/forgot-password/request",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordAPI(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Password reset failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "/auth/get-current-user/request-auth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to fetch profile");
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken/request",
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshAccessTokenAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/sign-out/request",
  async (_, { rejectWithValue }) => {
    try {
      const response = await signOutAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Reusable handlers for async actions
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setError: (state, action) => {
      state.error = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, handlePending)
      .addCase(signUp.fulfilled, handleFulfilled)
      .addCase(signUp.rejected, handleRejected)
      .addCase(signIn.pending, handlePending)
      .addCase(signIn.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isFirstLogin = action.payload.isFirstLogin;
        state.isAuthenticated = true;
        state.role = action.payload.role;
        saveTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(signIn.rejected, (state, action) => {
        handleRejected(state, action);
        state.isAuthenticated = false;
        state.role = ROLES.GUEST;
        saveTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(requestOTPForActivation.pending, handlePending)
      .addCase(requestOTPForActivation.fulfilled, handleFulfilled)
      .addCase(requestOTPForActivation.rejected, handleRejected)
      .addCase(requestOTPByEmail.pending, handlePending)
      .addCase(requestOTPByEmail.fulfilled, handleFulfilled)
      .addCase(requestOTPByEmail.rejected, handleRejected)
      .addCase(verifyOTP.pending, handlePending)
      .addCase(verifyOTP.fulfilled, handleFulfilled)
      .addCase(verifyOTP.rejected, handleRejected)
      .addCase(forgotPassword.pending, handlePending)
      .addCase(forgotPassword.fulfilled, handleFulfilled)
      .addCase(forgotPassword.rejected, handleRejected)
      .addCase(getCurrentUser.pending, handlePending)
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, handleRejected)
      .addCase(refreshAccessToken.pending, handlePending)
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshAccessToken.rejected, handleRejected)
      .addCase(signOut.pending, handlePending)
      .addCase(signOut.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        removeTokens();
      })
      .addCase(signOut.rejected, handleRejected);
  },
});

export const { setUser, setError } = authSlice.actions;
export default authSlice.reducer;
