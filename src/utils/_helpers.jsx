import AsyncStorage from "@react-native-async-storage/async-storage";

// Validate email format
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate phone number (10 digits)
const validatePhoneNumber = (phoneNumber) => {
  const regex = /^\d{10}$/;
  return regex.test(phoneNumber);
};

// Validate password (min 8 chars, at least one letter, one number, one special character)
const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Save token to AsyncStorage
const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem("jwtToken", token);
    console.log("Token saved successfully!");
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// Retrieve token from AsyncStorage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");
    if (token !== null) {
      console.log("Get Token:", token);
      return token;
    } else {
      console.log("Token not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null; // Return null in case of an error
  }
};

// Remove token from AsyncStorage
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("jwtToken");
    console.log("Token removed successfully!");
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

// Log function with validation for object
const log = (description, obj, level = "info") => {
  let message;

  if (typeof obj === "object" && obj !== null) {
    // Format object to JSON string with indentation
    message = JSON.stringify(obj, null, 2);
  } else {
    // Convert other types to string
    message = String(obj);
  }

  console[level](`${description}:`, message);
};

const cleanRequestParams = (request) => {
  return Object.keys(request).reduce((acc, key) => {
    const value = request[key];
    if (value !== null && value !== "" && value !== "ALL") {
      acc[key] = value;
    }
    return acc;
  }, {});
};

export {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  saveToken,
  getToken,
  removeToken,
  log,
  cleanRequestParams,
};
