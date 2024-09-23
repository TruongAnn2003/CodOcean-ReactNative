import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useGlobalContext } from "../../services/providers";
import UserAvatar from "react-native-user-avatar";
import getAvatarLink from "../../services/dicebear-avt";
import { MaterialIcons } from "@expo/vector-icons";

const CustomDrawerContent = (props) => {
  const { user } = useGlobalContext();

  return (
    <DrawerContentScrollView {...props} style={styles.drawer}>
      <View className="flex items-center mb-6 p-4 border-b border-gray-600">
        <UserAvatar
          size={100}
          name={user?.fullName}
          src={getAvatarLink(user?.fullName)}
          className="mb-2"
        />
        <Text className="text-lg text-white font-sscbold">
          {user?.fullName}
        </Text>
      </View>

      <View className="mt-4 px-4">
        <DrawerItem
          label="Profile"
          onPress={() => props.navigation.navigate("Profile")}
          icon={() => <MaterialIcons name="person" size={24} color="white" />}
          className="p-3 rounded-lg mb-3 "
          labelStyle={{
            color: "white",
            fontSize: 16,
            fontWeight: "600",
            fontFamily: "SairaSemiCondensed-SemiBold",
          }}
        />
        <DrawerItem
          label="Problems"
          onPress={() => props.navigation.navigate("Problems")}
          icon={() => (
            <MaterialIcons name="assignment" size={24} color="white" />
          )}
          className="p-3 rounded-lg mb-3"
          labelStyle={{
            color: "white",
            fontSize: 16,
            fontWeight: "600",
            fontFamily: "SairaSemiCondensed-SemiBold",
          }}
        />
        <DrawerItem
          label="Logout"
          onPress={() => props.navigation.navigate("Login")}
          icon={() => (
            <MaterialIcons name="assignment" size={24} color="white" />
          )}
          className="p-3 rounded-lg mb-3"
          labelStyle={{
            color: "white",
            fontSize: 16,
            fontWeight: "600",
            fontFamily: "SairaSemiCondensed-SemiBold",
          }}
        />
      </View>

      <View className="mt-auto items-center mb-6">
        {/* <Image
          source={{ uri: "https://your-image-url.com/your-image.jpg" }} // Đường dẫn đến ảnh của bạn
          className="w-32 h-32 rounded-full"
        /> */}
      </View>
    </DrawerContentScrollView>
  );
};
const styles = StyleSheet.create({
  drawer: {
    backgroundColor: "#030BA6", // Màu primary (ví dụ: màu xanh đậm)
    flex: 1,
  },
});
export default CustomDrawerContent;
