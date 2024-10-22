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
import { useSelector } from "react-redux";

const ForgotPassword = ({ navigation }) => {
  const { isLoading, error } = useSelector((state) => state.auth); // error có thể là object
  const [email, setEmail] = useState("");
  const handleContinue = async (email) => {
    setEmail(email);
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <View className="flex items-center w-full">
        <Imgs.LogoBgBlue className="mb-4" />
        <View className="w-full p-4 justify-center items-center ">
          <Text className="text-2xl mb-6 font-sscsemibold text-secondary">
            Forgot Password
          </Text>
          {email === "" ? (
            <FormGetEmail loading onContinue={handleContinue} />
          ) : (
            <FormResetPasswordVerifyOTP
              email={email}
            />
          )}
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text className="text-secondary text-base font-sscregular">
              Sign In
            </Text>
          </TouchableOpacity>
          {isLoading && <ActivityIndicator size="large" />}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
