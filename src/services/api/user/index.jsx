import axios from "axios";
import { REACT_APP_BASE_API_URL } from "../../../utils/const";
const BASE_URL = `${REACT_APP_BASE_API_URL}/api/profile`;

const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { getUserProfile };
