import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_API_URL}/api`;

const getUser = async (paramsString) => {
  const requestURL = `${BASE_URL}/users?${paramsString}`;
  return await axios.get(requestURL);
};

const getUsersExcludingCurrentUser = async (paramsString) => {
  const requestURL = `${BASE_URL}/users?${paramsString}`;
  return await axios.get(requestURL);
  //get-users-excluding-cur-user?curUserId=${curUserId}&page=${size}&size=${size}
};

const getUsersByNameExcludingCurrentUser = async (paramsString) => {
  const requestURL = `${BASE_URL}/users?${paramsString}`;
  return await axios.get(requestURL);
  //get-users-by-name-excluding-cur-user?fullName=${fullName}&curUserId=${curUserId}&page=${size}&size=${size}
};

export {
  signUp,
  loginUser,
  getUser,
  getUsersExcludingCurrentUser,
  getUsersByNameExcludingCurrentUser,
};
