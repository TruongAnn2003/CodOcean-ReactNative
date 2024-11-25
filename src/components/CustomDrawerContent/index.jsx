import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import { WhaleBg } from "../../constants/images";
import { signOut } from "../../services/redux-toolkit/reducers/authSlice";
import UserAvatar from "../UserAvatar";

const CustomDrawerContent = (props) => {
  const { profile } = useSelector((state) => state.profile);
  const [avatar, setAvatar] = useState(
    "https://res.cloudinary.com/du5medjhm/image/upload/v1730996001/avatar-40_d7hhex.png"
  );
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    setAvatar(profile.urlImage);
    setName(profile.fullName);
  }, [profile]);
  const handleSignOut = async () => {
    const resultAction = await dispatch(signOut());
    if (signOut.fulfilled.match(resultAction))
      props.navigation.navigate("SignIn");
    else dispatch(setError(t("signOut.failure")));
  };
  return (
    <DrawerContentScrollView {...props} style={styles.drawer}>
      <View className="flex items-center mb-6 p-4 border-b">
        <UserAvatar size={60} src={profile?.urlImage} className="mb-2" />
        <Text className="text-lg text-white font-sscbold">
          {profile?.fullName}
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
export default React.memo(CustomDrawerContent);
