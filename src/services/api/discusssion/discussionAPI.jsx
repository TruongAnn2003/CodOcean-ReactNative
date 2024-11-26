import { axiosInstance } from "../api";
import queryString from "query-string";
import { cleanRequestParams } from "../../../utils/helpers";

const BASE_URL = "/discusses";
const BASE_URL_PROFILE = "/profile";

export const getDiscussionsAPI = (filters) => {
  const requestParams = cleanRequestParams(filters);
  const paramsString = queryString.stringify(requestParams);

  return axiosInstance.get(`${BASE_URL}?${paramsString}`, {
    requiresAuth: true,
  });
};

export const getMyDiscussionsAPI = () => {
  return axiosInstance.get(`${BASE_URL_PROFILE}/get-all-uploaded-discusses`, {
    requiresAuth: true,
  });
};

export const addDiscussionAPI = (request) =>
  axiosInstance.post(`${BASE_URL}`, request, {
    requiresAuth: true,
  });

export const updateDiscussionAPI = (id, discussion) =>
  axiosInstance.put(`${BASE_URL}/${id}`, discussion, {
    requiresAuth: true,
  });

export const deleteDiscussionAPI = (id) =>
  axiosInstance.delete(`${BASE_URL}/${id}`, {
    requiresAuth: true,
  });

export const getDiscussionAPI = (id) =>
  axiosInstance.get(`${BASE_URL}/${id}`, {
    requiresAuth: true,
  });
