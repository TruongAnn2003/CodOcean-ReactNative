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
