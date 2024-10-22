import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getTopicsAPI,
  getProblemsAPI,
  getProblemByIdAPI,
  getTrendingAPI,
  getTrendingByTopicAPI,
  getDataStatisticsAPI,
} from "../../api/problem";

const initialState = {
  isLoading: false,
  error: null,
  filters: {
    pageNumber: 0,
    limit: 2,
    status: null,
    difficulty: null,
    topic: null,
    searchTerm: "",
  },
  problems: [],
  topics: [],
  statisticsDatasets: {
    totalEasy: 0,
    totalNormal: 0,
    totalHard: 0,
    easy: [0, 0, 0, 0, 0, 0, 0],
    normal: [0, 0, 0, 0, 0, 0, 0],
    hard: [0, 0, 0, 0, 0, 0, 0],
  },
  totalPage: 0,
  trendingProblems: [],
};

export const getTopics = createAsyncThunk(
  "/problem/get-topics/request-auth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTopicsAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Get topics failed");
    }
  }
);

export const getProblemById = createAsyncThunk(
  "/problem/get-problem-by-id/request-auth",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProblemByIdAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Get problem by id failed");
    }
  }
);

export const getProblems = createAsyncThunk(
  "/problem/get-problems/request-auth",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await getProblemsAPI(filters);
      console.info("filters", filters);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Get problems failed");
    }
  }
);

export const getTrendingByTopic = createAsyncThunk(
  "/problem/get-trending-by-topic/request-auth",
  async ({ topic, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await getTrendingByTopicAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Get trending by topic failed"
      );
    }
  }
);

export const getTrending = createAsyncThunk(
  "/problem/get-trending/request-auth",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await getTrendingAPI(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Get trending failed");
    }
  }
);

export const getDataStatistics = createAsyncThunk(
  "/problem/get-data-statistics/request-auth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDataStatisticsAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Get data statistics failed"
      );
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
  state.user = null;
  state.error = action.payload || "An error occurred";
};

const problemSlice = createSlice({
  name: "problem",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload.error;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload.newFilters }; // Cập nhật bộ lọc mới
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTopics.pending, handlePending)
      .addCase(getTopics.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.topics = action.payload;
      })
      .addCase(getTopics.rejected, handleRejected)
      .addCase(getProblemById.pending, handlePending)
      .addCase(getProblemById.fulfilled, handleFulfilled)
      .addCase(getProblemById.rejected, handleRejected)
      .addCase(getProblems.pending, handlePending)
      .addCase(getProblems.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        console.log("After Update:", state.filters);
        state.problems = action.payload.problemDTOs;
        state.totalPage = action.payload.totalPage;
      })
      .addCase(getProblems.rejected, handleRejected)
      .addCase(getTrending.pending, handlePending)
      .addCase(getTrending.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.trendingProblems = action.payload;
      })
      .addCase(getTrending.rejected, handleRejected)
      .addCase(getTrendingByTopic.pending, handlePending)
      .addCase(getTrendingByTopic.fulfilled, handleFulfilled)
      .addCase(getTrendingByTopic.rejected, handleRejected)
      .addCase(getDataStatistics.pending, handlePending)
      .addCase(getDataStatistics.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.statisticsDatasets = action.payload;
      })
      .addCase(getDataStatistics.rejected, handleRejected);
  },
});

export const { setError, setFilters } = problemSlice.actions;
export default problemSlice.reducer;
