import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getNotificationByIdAPI,
  getNotificationsAPI,
  setNotificationReadAPI,
  setAllNotificationReadAPI,
} from '../api/index';

const initialState = {
  isLoading: false,
  error: null,
  notifications: [],
  notification: null,
};

export const getNotificationById = createAsyncThunk(
  '/notification/get-notification-by-id/request-auth',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getNotificationByIdAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to fetch notification by id');
    }
  },
);

export const getNotifications = createAsyncThunk(
  '/notification/get-notifications/request-auth',
  async ({ pageNumber, limit }, { rejectWithValue }) => {
    try {
      const response = await getNotificationsAPI(pageNumber, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to fetch notifications');
    }
  },
);

export const setNotificationRead = createAsyncThunk(
  '/notification/set-notification-read/request-auth',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await setNotificationReadAPI(notificationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to set notification as read');
    }
  },
);

export const setAllNotificationsRead = createAsyncThunk(
  '/notification/set-all-notifications-read/request-auth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await setAllNotificationReadAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to set all notifications as read');
    }
  },
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
  state.error = action.payload || 'An error occurred';
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, handlePending)
      .addCase(getNotifications.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, handleRejected)

      .addCase(getNotificationById.pending, handlePending)
      .addCase(getNotificationById.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.notification = action.payload;
      })
      .addCase(getNotificationById.rejected, handleRejected)

      .addCase(setNotificationRead.pending, handlePending)
      .addCase(setNotificationRead.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        const index = state.notifications.findIndex((notification) => notification.id === action.meta.arg);
        if (index !== -1) {
          state.notifications[index].read = true;
        }
      })
      .addCase(setNotificationRead.rejected, handleRejected)

      .addCase(setAllNotificationsRead.pending, handlePending)
      .addCase(setAllNotificationsRead.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.notifications.forEach((notification) => (notification.read = true));
      })
      .addCase(setAllNotificationsRead.rejected, handleRejected);
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
