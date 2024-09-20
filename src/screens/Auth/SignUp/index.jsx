import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match!");
      return;
    }

    try {
      const response = await fetch(
        "https://food-app-api-demo.onrender.com/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();
      console.log(response);
      if (response.ok) {
        Alert.alert("Success", "Account created successfully");
        console.log("Token:", data.token);
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
    <View className={"flex-1 justify-center items-center p-4 bg-white"}>
      <Text className={"text-2xl font-bold mb-6 text-gray-800"}>Sign Up</Text>

      <TextInput
        className={"w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />

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

      <TextInput
        className={"w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        className={
          "w-full h-12 bg-blue-600 justify-center items-center rounded-lg mb-4"
        }
        onPress={handleSignUp}
      >
        <Text className={"text-white text-lg"}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text className={"text-blue-600 text-base mt-2"}>
          Already have an account? Log in
        </Text>
      </TouchableOpacity>
    </View>
  );
}
