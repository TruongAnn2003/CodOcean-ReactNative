import { axiosInstance } from "../api";
import queryString from "query-string";
import { cleanRequestParams } from "../../../utils/helpers";
import { FILTER_DEFAULT } from "../../../constants";

export const getTopicsAPI = () =>
  axiosInstance.get("/topics", {
    requiresAuth: true,
  });

export const getProblemsAPI = (filters) => {
  const paramsString = queryString.stringify(cleanRequestParams(filters));
  return axiosInstance.get(`/search/problems?${paramsString}`, {
    requiresAuth: true,
  });
};

export const getTrendingByTopicAPI = (topic, limit = 10) =>
  axiosInstance.get(`/trending/${topic}/${limit}`, {
    requiresAuth: true,
  });
export const getTrendingAPI = (limit = 10) =>
  axiosInstance.get(`/trending/${limit}`, {
    requiresAuth: true,
  });

export const getProblemByIdAPI = (id) =>
  axiosInstance.get(`/problems/find-by-id?problemId=${id}`, {
    requiresAuth: true,
  });
export const getDataStatisticsAPI = (id) =>
  axiosInstance.get(`/statistic`, {
    requiresAuth: true,
  });
