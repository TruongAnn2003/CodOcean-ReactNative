import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/login/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      const token = data.token;
      const isActive = data.isActive;
      if (isActive === false) {
        navigation.navigate("ActiveAccountScreen", { token });
      } else {
        await AsyncStorage.setItem("jwtToken", token);

        console.log(response.ok);
        if (response.ok) {
          navigation.navigate("Profile");
        } else {
          Alert.alert(
            "Đăng nhâp thất bại",
            data.message || "An error occurred"
          );
        }
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again later.");
      console.error("Login error:", error);
    }
  };

  return (
    <View className={"flex-1 justify-center items-center p-4 bg-white"}>
      <Text className={"text-2xl font-bold mb-6 text-gray-800"}>Login</Text>

      <TextInput
        className={"w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className={"w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        className={
          "w-full h-12 bg-blue-600 justify-center items-center rounded-lg mb-4"
        }
        onPress={handleSignIn}
      >
        <Text className={"text-white text-lg"}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text className={"text-blue-600 text-base mt-2"}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text className={"text-blue-600 text-base mt-2"}>
          Create an Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}
