import axios from "axios";
import * as _helpers from "../../../utils/_helpers";
import * as _const from "../../../utils/_const";

const BASE_URL = `${_const.REACT_APP_BASE_API_URL}/api`;

const getUserProfile = async () => {
  const token = await _helpers.getToken();
  const requestURL = `${BASE_URL}/profile/get-profile`;
  return await axios.get(requestURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getDataStatistics = async () => {
  const token = await _helpers.getToken();
  const requestURL = `${BASE_URL}/statistic`;
  return await axios.get(requestURL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getUserProfile, getDataStatistics };
