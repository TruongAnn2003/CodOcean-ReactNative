import { axiosInstance } from "../api";

const BASE_URL = "/v1/discuss/comments";

export const getCommentsAPI = (discussId) =>
  axiosInstance.get(`${BASE_URL}?discussId=${discussId}`, {
    requiresAuth: true,
  });

export const getCommentAPI = (id) =>
  axiosInstance.get(`${BASE_URL}/${id}`, {
    requiresAuth: true,
  });

export const addCommentAPI = (request) =>
  axiosInstance.post(`${BASE_URL}`, request, {
    requiresAuth: true,
  });

export const updateCommentAPI = (id, text) =>
  axiosInstance.put(
    `${BASE_URL}/${id}`,
    { text },
    {
      requiresAuth: true,
    }
  );

export const deleteCommentAPI = (id) =>
  axiosInstance.delete(`${BASE_URL}/${id}`, {
    requiresAuth: true,
  });

export const replyCommentAPI = (request) =>
  axiosInstance.post(`${BASE_URL}/reply`, request, {
    requiresAuth: true,
  });

export const getRepliesCommentByIdAPI = (id) =>
  axiosInstance.get(`${BASE_URL}/replies?commentId=${id}`, {
    requiresAuth: true,
  });
