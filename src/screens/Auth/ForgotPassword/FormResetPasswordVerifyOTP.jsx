// components/FormResetPasswordVerifyOTP.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

const FormResetPasswordVerifyOTP = ({ email, onVerify }) => {
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (newPassword && otp) {
      onVerify(newPassword, otp); // Gọi hàm verify với newPassword và otp
    } else {
      Alert.alert("Error", "Please fill in all fields.");
    }
  };

  return (
    <View className="w-full p-4">
      <Text className="mb-2 text-lg font-sscregular text-secondary">
        Your Email:
      </Text>
      <TextInput
        value={email}
        placeholder="Email"
        className="w-full h-12 font-sscregular border border-gray-300 rounded-lg px-4 mb-4 text-base bg-gray-100"
        editable={false} // Không thể chỉnh sửa email
      />

      <Text className="mb-2 text-lg font-sscregular text-secondary">
        New Password:
      </Text>
      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        className="w-full h-12 font-sscregular border border-gray-300 rounded-lg px-4 mb-4 text-base focus:border-secondary focus:outline-none"
        secureTextEntry={true} // Ẩn mật khẩu khi nhập
      />

      <Text className="mb-2 text-lg font-sscregular text-secondary">OTP:</Text>
      <TextInput
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        className="w-full h-12 font-sscregular border border-gray-300 rounded-lg px-4 mb-4 text-base focus:border-secondary focus:outline-none"
      />

      <TouchableOpacity
        className="w-full h-12 bg-secondary justify-center items-center rounded-lg mb-4"
        onPress={handleVerify}
      >
        <Text className="text-white text-lg font-sscsemibold">Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FormResetPasswordVerifyOTP;
