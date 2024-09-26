import axios from "axios";
import * as _const from "../../../utils/_const";
import * as _helpers from "../../../utils/_helpers";
import queryString from "query-string";

const BASE_URL = `${_const.REACT_APP_BASE_API_URL}/api/login`;

/*
{
  "fullName": "John Doe",
  "email": "teomzxc@gmail.com",
  "phoneNumber": "2234567890",
  "password": "abcdef",
  "dateOfBirth": "1990-01-01T00:00:00",
  "urlImage": "https://example.com/path/to/new-avatar.jpg"
}
*/
const register = async (request) => {
  const requestURL = `${BASE_URL}/register`;
  return await axios.post(requestURL, request);
};

/*
{
  "email": "abc@gmail.com",
  "password": "123456Abc@"
}
*/
const login = async (request) => {
  const requestURL = `${BASE_URL}/sign-in`;
  return await axios.post(requestURL, request);
};

const activeAccountRequestOTP = async (token, request) => {
  const paramsString = queryString.stringify(request);
  const requestURL = `${BASE_URL}/request-otp${paramsString}`;
  return await axios.get(requestURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

/*
{
  "email": "abc@gmail.com"
}
*/
const requestOTP = async (request) => {
  const paramsString = queryString.stringify(request);
  const requestURL = `${BASE_URL}/request-otp?${paramsString}`;
  return await axios.get(requestURL);
};

/*
{
  "otp": "646172"
}
*/
const verifyOTP = async (token, request) => {
  const requestURL = `${BASE_URL}/verify-otp`;
  return await axios.post(requestURL, request, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

/*
{
  "email": "abc@gmail.com",
  "newPassword": "123456Abc@",
  "otp": "646172",
}
*/
const forgotPassword = async (request) => {
  const requestURL = `${BASE_URL}/forgot-password`;
  return await axios.post(requestURL, request);
};

export {
  register,
  login,
  activeAccountRequestOTP,
  requestOTP,
  verifyOTP,
  forgotPassword,
};
