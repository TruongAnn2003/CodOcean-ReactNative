import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_API_URL}/api`;
const getProblems = async (request) => {
  const requestURL = `${BASE_URL}/search/problems`;
  return await axios.post(requestURL, request);
};

const getAllTopics = async () => {
  const requestURL = `${BASE_URL}/topics`;
  return await axios.get(requestURL);
};

const getStatisticsDatasets = async (paramsString) => {
  const requestURL = `${BASE_URL}/statistic?${paramsString}`;
  return await axios.get(requestURL);
};

const getProblem = async (paramString) => {
  return await axios.get(`${BASE_URL}/problems/findById?${paramString}`);
};

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

export {
  getProblems,
  getAllTopics,
  getStatisticsDatasets,
  getAllProblemByUserId,
  deleteProblem,
  getProblem,
  getProblemsByOwner,
  getProblemsByOwnerAndName,
};
