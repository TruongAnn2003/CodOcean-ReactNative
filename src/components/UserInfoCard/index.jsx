import React from "react";
import { View, Text } from "react-native";
import UserAvatar from "react-native-user-avatar";
import getAvatarLink from "../../services/dicebear-avt";
const UserInfoCard = ({ user }) => {
  return (
    <View className="bg-white p-5 m-4 rounded-lg shadow-lg items-center">
      <UserAvatar
        size={100}
        name={user?.fullName}
        src={getAvatarLink(user?.fullName)}
      />
      <Text className="text-2xl mb-4 font-sscbold">{user?.fullName}</Text>
      <View className="w-full mb-2 flex-row justify-between">
        <Text className="text-base font-sscregular">Email:</Text>
        <Text className="text-base font-sscregular">{user?.email}</Text>
      </View>
      <View className="w-full mb-2 flex-row justify-between">
        <Text className="text-base font-sscregular">Date of Birth:</Text>
        <Text className="text-base font-sscregular">
          {new Date(user?.dateOfBirth).toLocaleDateString()}
        </Text>
      </View>
      <View className="w-full flex-row justify-between">
        <Text className="text-base font-sscregular">Phone Number:</Text>
        <Text className="text-base font-sscregular">{user?.phoneNumber}</Text>
      </View>
    </View>
  );
};

export default UserInfoCard;
