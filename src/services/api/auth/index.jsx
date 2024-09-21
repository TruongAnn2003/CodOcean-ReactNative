import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = `http://localhost:8000/api/login`;

const register = async (request) => {
  const requestURL = `${BASE_URL}/register`;
  return await axios.post(requestURL, request);
};

const login = async (request) => {
  const requestURL = `${BASE_URL}/sign-in`;
  console.log(request);
  console.log(requestURL);
  try {
    const response = await axios.post(requestURL, request, { timeout: 5000 });
    //  await AsyncStorage.setItem("userToken", response.data.token);

    return response.data;
  } catch (error) {
    if (error.response) {
      // Lỗi từ server trả về, ví dụ: 401, 404
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      // Yêu cầu đã được gửi nhưng không có phản hồi từ server
      throw new Error("No response from server");
    } else {
      // Lỗi khác
      throw new Error(error.message);
    }
  }
};
export { register, login };
