import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Alert,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { register } from "../../../services/api/auth";
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "../../../utils/_helpers";
import { useGlobalContext } from "../../../services/providers";
import { formatDate } from "../../../utils/_formatting";
import getAvatarLink from "../../../services/dicebear-avt";
import DatePicker from "react-native-date-picker";
import { images as Imgs } from "../../../constants";

const Register = ({ navigation }) => {
  const { loading, setLoading, error, setError } = useGlobalContext();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    dateOfBirth: new Date(), // Ensure default is a Date object
    urlImage: "",
  });
  const [open, setOpen] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const { fullName, email, phoneNumber, password, dateOfBirth, urlImage } =
      formData;

    if (!fullName || !email || !phoneNumber || !password || !dateOfBirth) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (validatePhoneNumber(phoneNumber) === false) {
      Alert.alert("Error", "Invalid phone number format");
      return;
    }
    if (validateEmail(email) === false) {
      Alert.alert("Error", "Invalid email format");
      return;
    }
    if (validatePassword(password) === false) {
      Alert.alert("Error", "Invalid password format");
      return;
    }

    try {
      const data = await register({
        fullName,
        email,
        phoneNumber,
        password,
        dateOfBirth: formatDate(dateOfBirth),
        urlImage: getAvatarLink(fullName),
      });

      if (data.message === "user.login.register_successfully") {
        Alert.alert("Success", "Account created successfully");
        navigation.navigate("Login");
      } else {
        Alert.alert("Signup failed", data.message || "An error occurred");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again later.");
      console.error("Signup error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <View className="flex items-center w-full">
          <Imgs.LogoBgBlue className="mb-4" />
          <View className="w-full p-4 justify-center items-center">
            <Text className="font-sscsemibold text-2xl mb-6 text-primary">
              Register
            </Text>

            <TextInput
              className="w-full h-12 border font-sscregular border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
              placeholder="Full Name"
              value={formData.fullName}
              onChangeText={(value) => handleChange("fullName", value)}
            />
            <TextInput
              className="w-full h-12 border font-sscregular border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
            />
            <TextInput
              className="w-full h-12 border font-sscregular border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(value) => handleChange("phoneNumber", value)}
            />
            <TextInput
              className="w-full h-12 border font-sscregular border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
              placeholder="Password"
              secureTextEntry={true}
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
            />
            <TextInput
              className="w-full h-12 border font-sscregular border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
              placeholder="Date of Birth"
              secureTextEntry={true}
              value={formData.dateOfBirth}
              onChangeText={(value) => handleChange("dateOfBirth", date)}
            />

            <TouchableOpacity
              className="w-full h-12 bg-primary justify-center items-center rounded-lg mb-4"
              disabled={loading}
              onPress={handleSubmit}
            >
              <Text className="text-white font-sscsemibold text-lg">
                {loading ? "Registering..." : "Submit"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-secondary-100 font-sscregular text-base ">
                Login
              </Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" />}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
