import { axiosInstance } from "../api";
import queryString from "query-string";
import { cleanRequestParams } from "../../../utils/helpers";

const API_COMMENT = "/v1/discuss/comments";
const API_DISCUSSION = "/discusses";
const API_REACT = "/v1/react/discuss";
const API_PROFILE = "/api/profile";

export const getCategoriesAPI = () =>
  axiosInstance.get("/v1/discuss/categories", {
    requiresAuth: true,
  });

export const getDiscussionsAPI = (filters) => {
  const requestParams = cleanRequestParams(filters);
  const paramsString = queryString.stringify(requestParams);

  return axiosInstance.get(`${API_DISCUSSION}?${paramsString}`, {
    requiresAuth: true,
  });
};

export const getMyDiscussionsAPI = () => {
  return axiosInstance.get(`${API_PROFILE}/get-all-uploaded-discusses`, {
    requiresAuth: true,
  });
};

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

export const getCommentsAPI = (discussId) =>
  axiosInstance.get(`${API_COMMENT}?discussId=${discussId}`, {
    requiresAuth: true,
  });

export const getCommentAPI = (id) =>
  axiosInstance.get(`${API_COMMENT}/${id}`, {
    requiresAuth: true,
  });

export const addCommentAPI = (request) =>
  axiosInstance.post(`${API_COMMENT}`, request, {
    requiresAuth: true,
  });

export const updateCommentAPI = (id, text) =>
  axiosInstance.put(
    `${API_COMMENT}/${id}`,
    { text },
    {
      requiresAuth: true,
    }
  );

export const deleteCommentAPI = (id) =>
  axiosInstance.delete(`${API_COMMENT}/${id}`, {
    requiresAuth: true,
  });
