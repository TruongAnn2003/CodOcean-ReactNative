// components/FormGetEmail.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

const FormGetEmail = ({ onContinue }) => {
  const [email, setEmail] = useState("");

  const handleContinue = () => {
    if (email) {
      onContinue(email); 
    } else {
      Alert.alert("Error", "Please enter your email.");
    }
  };

  return (
    <View className="w-full">
      <Text className="mb-2 text-lg font-sscregular text-secondary">
        Enter Your Email:
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 text-base focus:border-secondary focus:outline-none"
        keyboardType="email-address"
      />
      <Button title="Continue" onPress={handleContinue} />
    </View>
  );
};

export default FormGetEmail;
