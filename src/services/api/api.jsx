import axios from "axios";
import { getTokens } from "../../utils/tokenUtils";
import axiosRetry from "axios-retry";
// import { REACT_APP_API_URL } from "@env";

const REACT_APP_API_URL =
  "https://06f8-2001-ee0-51de-d090-95ab-7481-5212-94a3.ngrok-free.app/api";
  
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
