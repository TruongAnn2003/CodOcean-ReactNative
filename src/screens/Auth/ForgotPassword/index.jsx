import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    console.log("Email:", email);
    alert("A password reset link has been sent to your email.");
  };

  return (
    <View className={"flex-1 justify-center items-center p-4 bg-white"}>
      <Text className={"text-2xl font-bold mb-6 text-gray-800"}>
        Forgot Password
      </Text>

      <TextInput
        className={"w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"}
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        className={
          "w-full h-12 bg-blue-600 justify-center items-center rounded-lg mb-4"
        }
        onPress={handleResetPassword}
      >
        <Text className={"text-white text-lg"}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text className={"text-blue-600 text-base mt-2"}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
