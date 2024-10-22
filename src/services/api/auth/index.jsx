import { axiosInstance } from '../api';
import queryString from 'query-string';
import { getTokens } from '../../../utils/tokenUtils';

export const signUpAPI = (formData) => axiosInstance.post('/auth/v1/sign-up', formData);

export const signInAPI = (formData) => axiosInstance.post('/auth/v1/sign-in', formData);

export const requestOTPForActivationAPI = () =>
  axiosInstance.get('/auth/v1/request-otp', {
    requiresAuth: true,
  });

export const requestOTPByEmailAPI = (email) => {
  const paramsString = queryString.stringify({ email });
  return axiosInstance.get(`/auth/v1/request-otp?${paramsString}`);
};

export const verifyOTPAPI = (formData) =>
  axiosInstance.post('/auth/v1/verify-otp', formData, {
    requiresAuth: true,
  });
export const forgotPasswordAPI = (formData) => axiosInstance.post('/auth/v1/forgot-password', formData);

export const getCurrentUserAPI = () => {
  return axiosInstance.get('/user/current', {
    requiresAuth: true,
  });
};

export const refreshAccessTokenAPI = async () => {
  const { refreshToken } = await getTokens();
  return axiosInstance.post(
    '/auth/v1/refresh-token',
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    },
  );
};

export const signOutAPI = async () => {
  const { refreshToken } = await getTokens();
  return axiosInstance.post(
    '/auth/v1/sign-out',
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    },
  );
};
