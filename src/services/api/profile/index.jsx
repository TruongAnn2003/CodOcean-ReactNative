import { axiosInstance } from "../api";

export const getProfileAPI = () => {
  return axiosInstance.get("/profile/get-profile", {
    requiresAuth: true,
  });
};
export const getAllSolvedProblemsAPI = () =>
  axiosInstance.get(`/profile/get-all-solved-problems`, {
    requiresAuth: true,
  });
export const getAllUploadedProblemsAPI = () =>
  axiosInstance.get(`/profile/get-all-uploaded-problems`, {
    requiresAuth: true,
  });
export const getAllUploadedDiscussionsAPI = (id) =>
  axiosInstance.get(`/profile/get-all-uploaded-discusses`, {
    requiresAuth: true,
  });

export const ChangeAvatarAPI = (formData) =>
  axiosInstance.post(`/profile/change-avatar`, formData, {
    requiresAuth: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const ChangeEmailAPI = (formData) =>
  axiosInstance.post(`/profile/change-email`, formData, {
    requiresAuth: true,
  });

export const ChangeProfileAPI = (formData) =>
  axiosInstance.post(`/profile/change-profile`, formData, {
    requiresAuth: true,
  });
