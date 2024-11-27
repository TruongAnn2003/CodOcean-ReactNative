import { axiosInstance } from "../api";

const BASE_URL = "/v1/discuss/categories";

export const getCategoriesAPI = () =>
  axiosInstance.get(`${BASE_URL}`, {
    requiresAuth: true,
  });
