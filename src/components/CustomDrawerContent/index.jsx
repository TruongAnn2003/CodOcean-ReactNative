import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useGlobalContext } from "../../services/providers";
import UserAvatar from "react-native-user-avatar";
const CustomDrawerContent = (props) => {
  const { user } = useGlobalContext();
  return (
    <DrawerContentScrollView {...props} className="bg-white p-4">
      <View className="flex items-center mb-6">
        <UserAvatar
          size={50}
          name={user.fullName}
          src={user.urlImage}
          className="mb-2"
        />
        <Text className="text-lg font-bold text-gray-800">
          {user.fullName}
        </Text>
      </View>

      <DrawerItemList {...props} className="mt-4" />

      <TouchableOpacity
        onPress={() => alert("Logged out!")}
        className="bg-red-500 p-4 mt-6 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
