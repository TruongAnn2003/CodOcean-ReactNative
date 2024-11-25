import axios from "axios";
import { getTokens } from "../../utils/tokenUtils";
import axiosRetry from "axios-retry";
// import { REACT_APP_API_URL } from "@env";

const REACT_APP_API_URL =
  "https://8e4a-2001-ee0-51de-d090-95ad-176b-2e25-3301.ngrok-free.app/api";
  
const axiosInstance = axios.create({
  baseURL: REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const { accessToken } = await getTokens();
    if (config.requiresAuth && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { axiosInstance };
