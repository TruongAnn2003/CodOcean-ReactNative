import { axiosInstance } from "../api";

const BASE_URL = "/profile";

export const getProfileAPI = () => {
  return axiosInstance.get(`${BASE_URL}/get-profile`, {
    requiresAuth: true,
  });
};

export const getAllSolvedProblemsAPI = (id) =>
  axiosInstance.get(`${BASE_URL}/get-all-solved-problems`, {
    requiresAuth: true,
  });

export const getAllUploadedProblemsAPI = (id) =>
  axiosInstance.get(`${BASE_URL}/get-all-uploaded-problems`, {
    requiresAuth: true,
  });

export const getAllUploadedDiscussionsAPI = (id) =>
  axiosInstance.get(`${BASE_URL}/get-all-uploaded-discusses`, {
    requiresAuth: true,
  });

export const ChangeAvatarAPI = (formData) =>
  axiosInstance.post(`${BASE_URL}/change-avatar`, formData, {
    requiresAuth: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const ChangeEmailAPI = (formData) =>
  axiosInstance.post(`${BASE_URL}/change-email`, formData, {
    requiresAuth: true,
  });

export const ChangeProfileAPI = (formData) =>
  axiosInstance.post(`${BASE_URL}/change-profile`, formData, {
    requiresAuth: true,
  });
