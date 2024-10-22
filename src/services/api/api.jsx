import axios from "axios";
import { getTokens } from "../../utils/tokenUtils";
import axiosRetry from "axios-retry";
import { REACT_APP_API_URL } from "@env";
// Set up axios instance
// console.log("REACT_APP_API_URL", REACT_APP_API_URL);

// const REACT_APP_API_URL = process.env["REACT_APP_API_URL"];
const axiosInstance = axios.create({
  baseURL: REACT_APP_API_URL,
});

axiosRetry(axiosInstance, {
  retries: 3, // Retry up to 3 times
  retryCondition: (error) =>
    error.response?.status >= 500 || error.code === "ECONNABORTED", // Retry on 5xx or timeout errors
  retryDelay: (retryCount) => retryCount * 1000, // Exponential backoff: 1s, 2s, 3s
});

// Request interceptor for adding Authorization header
axiosInstance.interceptors.request.use(
  async (config) => {
    const { accessToken } = await getTokens(); // Retrieve tokens
    if (config.requiresAuth && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Add the token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { axiosInstance };
