// screens/ForgotPasswordScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import FormGetEmail from "./FormGetEmail";
import FormResetPasswordVerifyOTP from "./FormResetPasswordVerifyOTP";
import { images as Imgs } from "../../../constants";
import { requestOTP, forgotPassword } from "../../../services/api/auth";
import { useGlobalContext } from "../../../services/providers";
import * as _const from "../../../utils/_const";
const ForgotPassword = ({ navigation }) => {
  const { loading, setLoading } = useGlobalContext();
  const [email, setEmail] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleContinue = async (email) => {
    setLoading(true);
    try {
      setEmail(email);
      const response = await requestOTP({ email });
      if (response.status === _const.RESPONSE_STATUS.Created) {
        setIsOtpSent(true);
        Alert.alert("Success", "OTP has been sent to your email.");
      } else {
        Alert.alert("Error", "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      Alert.alert("Error", "An error occurred while requesting OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (newPassword, otp) => {
    setLoading(true);
    try {
      if (!newPassword || !otp) {
        Alert.alert("Error", "Please provide both OTP and new password.");
        return;
      }

      const response = await forgotPassword({ email, otp, newPassword });

      if (response.status === _const.RESPONSE_STATUS.Ok) {
        Alert.alert("Success", "Your password has been successfully reset.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      Alert.alert(
        "Error",
        "An error occurred while resetting password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <View className="flex items-center w-full">
        <Imgs.LogoBgBlue className="mb-4" />
        <View className="w-full p-4 justify-center items-center ">
          <Text className="text-2xl mb-6 font-sscsemibold text-primary">
            Forgot Password
          </Text>
          {isOtpSent ? (
            <FormResetPasswordVerifyOTP
              loading
              email={email}
              onVerify={handleVerify}
            />
          ) : (
            <FormGetEmail loading onContinue={handleContinue} />
          )}
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-secondary-100 text-base font-sscregular">
              Login
            </Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="large" />}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
