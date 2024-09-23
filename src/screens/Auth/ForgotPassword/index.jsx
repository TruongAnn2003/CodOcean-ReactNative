import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { images as Imgs } from "../../../constants";
export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    console.log("Email:", email);
    alert("A password reset link has been sent to your email.");
  };

  return (
    <View className={"flex-1 justify-center items-center p-4 bg-white"}>
      <Imgs.LogoBgBlue className="mb-4" />
      <Text className={"text-2xl font-sscsemibold mb-6 text-primary"}>
        Forgot Password
      </Text>

      <TextInput
        className={
          "w-full h-12 font-sscregular border border-gray-300 rounded-lg px-4 mb-4 focus:border-secondary focus:outline-none"
        }
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        className={
          "w-full h-12 bg-primary justify-center items-center rounded-lg mb-4"
        }
        onPress={handleResetPassword}
      >
        <Text className={"text-white text-lg font-sscsemibold"}>
          Reset Password
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text className={"text-secondary-100 text-base mt-2 font-sscregular"}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
