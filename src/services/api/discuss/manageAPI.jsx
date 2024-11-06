import { axiosInstance } from "../api";

export const addDiscussionAPI = (request) =>
  axiosInstance.post("/discusses", request, {
    requiresAuth: true,
  });

export const updateDiscussionAPI = (id, discussion) =>
  axiosInstance.put(`/discusses/${id}`, discussion, {
    requiresAuth: true,
  });

export const deleteDiscussionAPI = (id) =>
  axiosInstance.delete(`/discusses/${id}`, {
    requiresAuth: true,
  });

export const getCategoriesAPI = () =>
  axiosInstance.get("/v1/discuss/categories", {
    requiresAuth: true,
  });

export const getDiscussionAPI = (id) =>
  axiosInstance.get(`/discusses/${id}`, {
    requiresAuth: true,
  });
