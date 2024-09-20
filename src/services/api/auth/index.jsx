import axios from "axios";
const BASE_URL = `${process.env.REACT_APP_BASE_API_URL}/api`;
const signUp = async (request) => {
  const requestURL = `${BASE_URL}/register`;
  return await axios.post(requestURL, request);
};

const login = async (request) => {
  const requestURL = `${BASE_URL}/login`;
  return await axios.post(requestURL, request);
};
export {signUp, login}