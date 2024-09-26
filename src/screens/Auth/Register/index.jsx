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
  ActivityIndicator, // Đừng quên import ActivityIndicator nếu bạn dùng nó
} from "react-native";
import { register } from "../../../services/api/auth";
import { useGlobalContext } from "../../../services/providers";
import * as _formatting from "../../../utils/_formatting";
import * as _helpers from "../../../utils/_helpers";
import * as _const from "../../../utils/_const"
import getAvatarLink from "../../../services/dicebear-avt";
import DateTimePicker from "@react-native-community/datetimepicker"; // Import DateTimePicker
import { images as Imgs } from "../../../constants";

const Register = ({ navigation }) => {
  const { loading, setLoading, error, setError } = useGlobalContext();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    dateOfBirth: new Date(), // Ngày mặc định là ngày hiện tại
    urlImage: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false); // State để quản lý hiển thị DatePicker

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

    if (_helpers.validatePhoneNumber(phoneNumber) === false) {
      Alert.alert("Error", "Invalid phone number format");
      return;
    }
    if (_helpers.validateEmail(email) === false) {
      Alert.alert("Error", "Invalid email format");
      return;
    }
    if (_helpers.validatePassword(password) === false) {
      Alert.alert("Error", "Invalid password format");
      return;
    }

    try {
      const response = await register({
        fullName,
        email,
        phoneNumber,
        password,
        dateOfBirth: dateOfBirth,
        urlImage: getAvatarLink(fullName),
      });

      if (response.status === _const.RESPONSE_STATUS.Ok) {
        Alert.alert("Success", "Account created successfully");
        navigation.navigate("Login");
      } else {
        Alert.alert(
          "Signup failed",
          response.data.message || "An error occurred"
        );
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again later.");
      console.error("Signup error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
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
          <View className="w-full p-4 justify-center items-center ">
            <Text className="text-2xl mb-6 font-sscsemibold text-primary">
              Register
            </Text>

            {/* Các trường input khác */}
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

            <Pressable
              style={{
                width: "100%",
                height: 48,
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 8,
                justifyContent: "center",
                paddingLeft: 16,
                marginBottom: 16,
              }}
              onPress={() => setShowDatePicker(true)} // Mở DatePicker khi người dùng bấm vào
            >
              <Text className="text-base font-sscregular text-[#D1D5DB]">
                {formData.dateOfBirth
                  ? formData.dateOfBirth.toLocaleDateString()
                  : "Select Date of Birth"}
              </Text>
            </Pressable>

            {/* DateTimePicker Component */}
            {showDatePicker && (
              <DateTimePicker
                value={formData.dateOfBirth} // Giá trị hiện tại của ngày sinh
                mode="date" // Đặt chế độ là chọn ngày
                display="default" // Giao diện mặc định
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || formData.dateOfBirth;
                  setShowDatePicker(false); // Đóng DatePicker sau khi chọn
                  handleChange("dateOfBirth", currentDate); // Cập nhật ngày sinh
                }}
              />
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={{
                width: "100%",
                height: 48,
                backgroundColor: "#1E3A8A",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
                marginBottom: 16,
              }}
              disabled={loading}
              onPress={handleSubmit}
            >
              <Text className="text-white text-base font-sscregular">
                {loading ? "Registering..." : "Submit"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-secondary-100 text-base font-sscregular">
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
