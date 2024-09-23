import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import UserAvatar from "react-native-user-avatar";
import getAvatarLink from "../../services/dicebear-avt";
const UserInfoCard = ({ user }) => {
  return (
    <View style={tw`bg-white p-5 m-4 rounded-lg shadow-lg items-center`}>
      <UserAvatar
        size={100}
        name={user.fullName}
        src={getAvatarLink(user.fullName)}
      />
      <Text style={[tw`text-2xl  mb-4`, { fontFamily: "SSC-Bold" }]}>
        {user.fullName}
      </Text>
      <View style={tw`w-full mb-2 flex-row justify-between`}>
        <Text style={[tw` text-base`, { fontFamily: "SSC-Bold" }]}>Email:</Text>
        <Text style={[tw`text-base`, { fontFamily: "SSC-Regular" }]}>
          {user?.email}
        </Text>
      </View>
      <View style={tw`w-full mb-2 flex-row justify-between`}>
        <Text style={[tw` text-base`, { fontFamily: "SSC-Bold" }]}>
          Date of Birth:
        </Text>
        <Text style={[tw`text-base`, { fontFamily: "SSC-Regular" }]}>
          {new Date(user?.dateOfBirth).toLocaleDateString()}
        </Text>
      </View>
      <View style={tw`w-full flex-row justify-between`}>
        <Text style={[tw` text-base`, { fontFamily: "SSC-Bold" }]}>
          Phone Number:
        </Text>
        <Text style={[tw`text-base`, { fontFamily: "SSC-Regular" }]}>
          {user?.phoneNumber}
        </Text>
      </View>
    </View>
  );
};

export default UserInfoCard;
