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

/*
getProblems -> request default
{
  "pageNumber": 0,
  "limit": 10,
  "status": null,
  "difficulty": null,
  "topic": null,
  "searchTerm": ""
}
*/
const getProblems = async (request) => {
  const token = await _helpers.getToken();
  const paramsString = queryString.stringify(
    _helpers.cleanRequestParams(request)
  );
  const requestURL = `${BASE_URL}/search/problems?${paramsString}`;
  return await axios.get(requestURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

//http://localhost:8000/api/trending/{topic}/{limit}
//http://localhost:8000/api/trending/array/15
const getTrendingProblemsByTopic = async (topic, limit = 10) => {
  const token = await _helpers.getToken();
  const requestURL = `${BASE_URL}/trending/${topic}/${limit}`;
  return await axios.get(requestURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getTrendingProblems = async (limit = 10) => {
  const token = await _helpers.getToken();
  const requestURL = `${BASE_URL}/trending/${limit}`;
  return await axios.get(requestURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getProblemById = async (id) => {
  const token = await _helpers.getToken();
  const requestURL = `${BASE_URL}/problems/findById?problemId=${id}`;
  return await axios.get(requestURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAllSolvedProblems = async () => {
  const token = await _helpers.getToken();
  const requestURL = `${BASE_URL}/profile/get-all-solved-problems`;
  return await axios.get(requestURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getAllUploadedProblems = async () => {
  const token = await _helpers.getToken();
  const requestURL = `${BASE_URL}/profile/get-all-uploaded-problems`;
  return await axios.get(requestURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export {
  getProblems,
  getAllTopics,
  getTrendingProblems,
  getTrendingProblemsByTopic,
  getProblemById,
  getAllSolvedProblems,
  getAllUploadedProblems,
};
