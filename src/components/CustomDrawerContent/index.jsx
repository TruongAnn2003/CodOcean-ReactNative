import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// import UserAvatar from "react-native-user-avatar";
import Icon from "react-native-vector-icons/Feather";
import { useSelector, useDispatch } from "react-redux";
import { WhaleBg } from "../../constants/images";
import UserAvatar from "../UserAvatar";
import { signOut } from "../../services/redux-toolkit/reducers/authSlice";

const CustomDrawerContent = (props) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    const resultAction = await dispatch(signOut());
    if (signOut.fulfilled.match(resultAction))
      props.navigation.navigate("SignIn");
    else dispatch(setError(t("signOut.failure")));
  };
  return (
    <DrawerContentScrollView {...props} style={styles.drawer}>
      <View className="flex items-center mb-6 p-4 border-b">
        <UserAvatar size={60} src={user?.urlImage} className="mb-2" />
        <Text className="text-lg text-white font-sscbold">
          {user?.fullName}
        </Text>
      </View>

      <View className="px-4">
        <DrawerItem
          label="Profile"
          onPress={() => props.navigation.navigate("Profile")}
          icon={() => <Icon name="user" size={24} color="#ffff" />}
          className="p-3 rounded-lg mb-3 "
          labelStyle={{
            color: "white",
            fontSize: 16,
            fontWeight: "600",
            fontFamily: "SairaSemiCondensed-Regular",
          }}
        />
        <DrawerItem
          label="Problems"
          onPress={() => props.navigation.navigate("Problems")}
          icon={() => <Icon name="code" size={24} color="#ffff" />}
          className="p-3 rounded-lg mb-3"
          labelStyle={{
            color: "white",
            fontSize: 16,
            fontWeight: "600",
            fontFamily: "SairaSemiCondensed-Regular",
          }}
        />
        <DrawerItem
          label="Discussions"
          onPress={() => props.navigation.navigate("Discussions")}
          icon={() => <Icon name="message-square" size={24} color="#ffff" />}
          className="p-3 rounded-lg mb-3"
          labelStyle={{
            color: "white",
            fontSize: 16,
            fontWeight: "600",
            fontFamily: "SairaSemiCondensed-Regular",
          }}
        />
        <DrawerItem
          label="Statistics"
          onPress={() => props.navigation.navigate("Statistics")}
          icon={() => <Icon name="activity" size={24} color="#ffff" />}
          className="p-3 rounded-lg mb-3"
          labelStyle={{
            color: "white",
            fontSize: 16,
            fontWeight: "600",
            fontFamily: "SairaSemiCondensed-Regular",
          }}
        />
        <DrawerItem
          label="Setting"
          onPress={() => props.navigation.navigate("Setting")}
          icon={() => <Icon name="settings" size={24} color="#ffff" />}
          className="p-3 rounded-lg mb-3"
          labelStyle={{
            color: "white",
            fontSize: 16,
            fontWeight: "600",
            fontFamily: "SairaSemiCondensed-Regular",
          }}
        />
        <DrawerItem
          label="Logout"
          onPress={handleSignOut}
          icon={() => <Icon name="log-out" size={24} color="#ffff" />}
          className="p-3 rounded-lg mb-3"
          labelStyle={{
            color: "white",
            fontSize: 16,
            fontWeight: "600",
            fontFamily: "SairaSemiCondensed-Regular",
          }}
        />
      </View>

      <View className="w-full items-center">
        <WhaleBg />
      </View>
    </DrawerContentScrollView>
  );
};
const styles = StyleSheet.create({
  drawer: {
    backgroundColor: "#024873",
    flex: 1,
  },
});
export default CustomDrawerContent;
