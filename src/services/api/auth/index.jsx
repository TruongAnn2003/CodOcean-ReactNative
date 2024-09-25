import axios from "axios";
import * as _const from "../../../utils/_const";
import * as _helpers from "../../../utils/_helpers";
const BASE_URL = `${_const.REACT_APP_BASE_API_URL}/api/login`;

const register = async (request) => {
  const requestURL = `${BASE_URL}/register`;
  return await axios.post(requestURL, request);
};

const login = async (request) => {
  const requestURL = `${BASE_URL}/sign-in`;
  return await axios.post(requestURL, request);
};

const requestOtp = async (token) => {
  const requestURL = `${BASE_URL}/request-otp`;
  return await axios.get(requestURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const verifyOtp = async (token, otp) => {
  const requestURL = `${BASE_URL}/verify-otp`;
  return await axios.post(
    requestURL,
    { otp },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export { register, login, requestOtp, verifyOtp };
