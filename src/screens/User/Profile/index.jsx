import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import UserInfoCard from "../../../components/UserInfoCard";
import { setError } from "../../../services/redux-toolkit/reducers/messageSlice";
import { getProfile } from "../../../services/redux-toolkit/reducers/profileSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const fetchProfileUser = async () => {
    try {
      const resultAction = await dispatch(getProfile());
      if (getProfile.rejected.match(resultAction)) {
        dispatch(setError("Fetch Profile Fail!"));
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchProfileUser();
  }, []);

  return (
    <View className="flex-1 bg-white p-4">
      <UserInfoCard />

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
