import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import UserInfoCard from "../../../components/UserInfoCard";
import { login, saveToken, getToken } from "../../../services/api/auth";
import { getUserProfile } from "../../../services/api/user";
import { useGlobalContext } from "../../../services/providers";

const Profile = () => {
  const { user } = useGlobalContext();
  return (
    <View className={`flex-1 bg-gray-300 p-4`}>
      <UserInfoCard user={user}></UserInfoCard>
    </View>
  );
};

export default Profile;
