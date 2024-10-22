import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import UserInfoCard from "../../../components/UserInfoCard";
import { useSelector } from "react-redux";

const Profile = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View className="flex-1 bg-white p-4">
      <UserInfoCard user={user} />

      <View className="flex-row justify-around my-4 border-t border-gray-300 pt-4">
        <TouchableOpacity
          onPress={() => handleNavigate("MyProblems")}
          className="flex-1 items-center bg-white rounded-lg shadow-md p-2 mx-2"
        >
          <Text className="font-sscsemibold text-secondary">My Problems</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleNavigate("MyDiscuss")}
          className="flex-1 items-center bg-white rounded-lg shadow-md p-2 mx-2"
        >
          <Text className="font-sscsemibold text-secondary">My Discuss</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleNavigate("Statistics")}
          className="flex-1 items-center bg-white rounded-lg shadow-md p-2 mx-2"
        >
          <Text className="font-sscsemibold text-secondary">Statistics</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
