import axios from "axios";
import { REACT_APP_BASE_API_URL } from "../../../utils/const";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = `${REACT_APP_BASE_API_URL}/api/login`;

const register = async (request) => {
  const requestURL = `${BASE_URL}/register`;
  try {
    console.log(requestURL);
    console.log(request);
    const response = await axios.post(requestURL, request, { timeout: 5000 });
    console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const login = async (request) => {
  const requestURL = `${BASE_URL}/sign-in`;
  try {
    const response = await axios.post(requestURL, request, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const requestOtp = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/request-otp`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const verifyOtp = async (token, otp) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/verify-otp`,
      { otp },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem("jwtToken", token);
    console.log("Token saved successfully!");
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");
    if (token !== null) {
      console.log("Token:", token);
      return token;
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
  }
};

export { register, login, requestOtp, verifyOtp, getToken, saveToken };
