import axios from "axios";
import * as _helpers from "../../../utils/_helpers";
import * as _const from "../../../utils/_const";
import queryString from "query-string";

const BASE_URL = `${_const.REACT_APP_BASE_API_URL}/api`;

const getAllTopics = async () => {
  const token = await _helpers.getToken();
  const requestURL = `${BASE_URL}/topics`;
  return await axios.get(requestURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getProblems = async (request) => {
  const token = await _helpers.getToken();
  const paramsString = queryString.stringify(request);
  const requestURL = `${BASE_URL}/search/problems?${paramsString}`;
  _helpers.log("getProblems-requestURL", requestURL);
  _helpers.log("getProblems-token", token);
  return await axios.get(requestURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getStatisticsDatasets = async (paramsString) => {
  const requestURL = `${BASE_URL}/statistic?${paramsString}`;
  return await axios.get(requestURL);
};

const getProblem = async (paramString) => {
  return await axios.get(`${BASE_URL}/problems/findById?${paramString}`);
};

//http://localhost:8000/api/trending/{topic}/{limit}
//http://localhost:8000/api/trending/array/15

//TODO

const getAllProblemByUserId = async (paramsString) => {
  const requestURL = `${BASE_URL}/problems/get-profile-problems?${paramsString}`;
  console.log(requestURL);
  return await axios.get(requestURL);
};

const deleteProblem = async (paramsString) => {
  const requestURL = `${BASE_URL}/problems/delete?${paramsString}`;
  console.log(requestURL);
  return await axios.delete(requestURL);
};

const getProblemsByOwner = async (ownerId) => {
  const requestURL = `${BASE_URL}/problems/get-problems-by-owner?userId=${ownerId}`;
  const response = await axios.get(requestURL);
  return response.data;
};

const getProblemsByOwnerAndName = async (ownerId, name) => {
  const requestURL = `${BASE_URL}/problems/get-problems-by-owner-and-name?userId=${ownerId}&name=${name}`;
  const response = await axios.get(requestURL);
  return response.data;
};

export { getProblems, getAllTopics };
