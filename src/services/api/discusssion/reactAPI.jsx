import { axiosInstance } from "../api";

const API_REACT = "/v1/react/discuss";

export const addReactDiscussionAPI = (discussId) =>
  axiosInstance.post(
    `${API_REACT}`,
    {
      discussId,
    },
    {
      requiresAuth: true,
    }
  );

export const deleteReactDiscussionAPI = (discussId) =>
  axiosInstance.delete(`${API_REACT}/${discussId}`, {
    requiresAuth: true,
  });
