import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // Corrected import
import { REACT_APP_ACCESS_TOKEN_KEY, REACT_APP_REFRESH_TOKEN_KEY } from "@env";

// Save tokens
export const saveTokens = async (accessToken, refreshToken) => {
  try {
    if (accessToken && refreshToken) {
      await AsyncStorage.setItem(REACT_APP_ACCESS_TOKEN_KEY, accessToken);
      await AsyncStorage.setItem(REACT_APP_REFRESH_TOKEN_KEY, refreshToken);
    } else {
      console.error("tokens is null");
    }
  } catch (error) {
    console.error("Failed to save tokens:", error);
  }
};

// Retrieve tokens
export const getTokens = async () => {
  try {
    const accessToken = await AsyncStorage.getItem(REACT_APP_ACCESS_TOKEN_KEY);
    const refreshToken = await AsyncStorage.getItem(
      REACT_APP_REFRESH_TOKEN_KEY
    );
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Failed to retrieve tokens:", error);
    return { accessToken: null, refreshToken: null };
  }
};

// Remove tokens
export const removeTokens = async () => {
  try {
    await AsyncStorage.removeItem(REACT_APP_ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REACT_APP_REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to remove tokens:", error);
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token); // Decode the token
    const currentTime = Date.now() / 1000; // Get current time in seconds
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true; // If decoding fails, treat token as expired
  }
};
