import React from "react";
import { View, TouchableOpacity, Alert, Text } from "react-native";
import { useGlobalContext } from "../../services/providers";
function Problems({ navigation }) {
  const { user } = useGlobalContext();
  return (
    <View className="flex-1 items-center justify-center bg-gray-300">
      <Text>Main Screen</Text>
      <Text>{user?.fullname}</Text>
    </View>
  );
}
export default Problems;
