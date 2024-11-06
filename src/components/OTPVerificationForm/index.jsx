import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons"; // or any other icon library you prefer

const OTPVerificationForm = ({ onSendOTP, onVerifyOTP }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", otp: "" });
  const [resendTimer, setResendTimer] = useState(0);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (!validateEmail(value) && value) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      otp[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      otp[index - 1].focus();
    }
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = () => {
    if (resendTimer > 0) return;
    startResendTimer();
    console.log("Resending OTP to", email);
    onSendOTP(email);
  };

  const handleVerifyOTP = async () => {
    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrors((prev) => ({
        ...prev,
        otp: "Please enter a valid 6-digit OTP",
      }));
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("OTP Verified", otpValue);
      onVerifyOTP(email, otpValue);
      setErrors({ email: "", otp: "" });
    } catch (error) {
      setErrors((prev) => ({ ...prev, otp: "Invalid OTP" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-blue-50 items-center justify-center p-4">
      <View className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <View className="text-center mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            OTP Verification
          </Text>
          <Text className="text-sm text-gray-600">
            Please enter the verification code sent to your email
          </Text>
        </View>

        <View className="mb-4">
          <View className="flex-row items-center border-b border-gray-300 pb-2">
            <Feather name="mail" size={20} color="#9CA3AF" className="mr-2" />
            <TextInput
              className={`flex-1 py-2 text-gray-900 ${
                errors.email ? "border-red-500" : "border-transparent"
              } border-b`}
              placeholder="Enter your email"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={handleEmailChange}
            />
          </View>
          {errors.email && (
            <Text className="text-red-600 text-sm mt-1">{errors.email}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700">
            Verification Code
          </Text>
          <View className="flex-row justify-center mt-2">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                className={`w-12 h-12 border rounded-md text-center text-lg ${
                  errors.otp ? "border-red-500" : "border-gray-300"
                }`}
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyDown(e, index)}
              />
            ))}
          </View>
          {errors.otp && (
            <Text className="text-red-600 text-sm mt-1 text-center">
              {errors.otp}
            </Text>
          )}
        </View>

        <TouchableOpacity onPress={handleResendOTP} disabled={resendTimer > 0}>
          <Text
            className={`text-sm font-medium ${
              resendTimer > 0 ? "text-gray-400" : "text-blue-600"
            }`}
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-600 rounded-md py-3 mt-4"
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Verify OTP
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OTPVerificationForm;
