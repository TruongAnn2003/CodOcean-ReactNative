import { axiosInstance } from "../../../../services/api/api";

const BASE_URL = '/v1/notifications';

export const getNotificationByIdAPI = (id) =>
  axiosInstance.get(`${BASE_URL}/${id}`, {
    requiresAuth: true,
  });

export const getNotificationsAPI = (pageNumber = 0, limit = 5) =>
  axiosInstance.get(BASE_URL, {
    params: { pageNumber, limit },
    requiresAuth: true,
  });

export const setNotificationReadAPI = (id) =>
  axiosInstance.put(
    `${BASE_URL}/${id}`,
    {},
    {
      requiresAuth: true,
    },
  );

export const setAllNotificationReadAPI = () =>
  axiosInstance.put(
    `${BASE_URL}`,
    {},
    {
      requiresAuth: true,
    },
  );
