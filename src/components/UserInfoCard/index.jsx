import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  setSuccess,
} from "../../services/redux-toolkit/reducers/messageSlice";
import { changeProfile, ChangeEmail } from "../../services/redux-toolkit/reducers/profileSlice";
import ChangeAvatarModal from "../ChangeAvatarModal";
import UserAvatar from "../UserAvatar";
import UserEditModal from "../UserEditModal";

const UserInfoCard = () => {
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [modalEditAvatarVisible, setModalEditAvatarVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const dispatch = useDispatch();
  const { profile, error } = useSelector((state) => state.profile);
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || "");
  const [dateOfBirth, setDateOfBirth] = useState(profile?.dateOfBirth || "");
  const [urlImage, setUrlImage] = useState(profile?.urlImage || "");

  useEffect(() => {
    setFullName(profile?.fullName);
    setUrlImage(profile?.urlImage);
    setEmail(profile?.email);
    setPhoneNumber(profile?.phoneNumber);
    setDateOfBirth(profile?.dateOfBirth);
  }, [profile]);

  const handleAvatarPress = () => {
    setOptionsModalVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleEdit = () => {
    console.log("Profile updated:", {
      fullName,
      email,
      phoneNumber,
      dateOfBirth,
    });
    setEditModalVisible(false);
  };

  const handleViewImage = () => {
    setImageVisible(true);
    setOptionsModalVisible(false);
  };

  const closeImageModal = () => {
    setImageVisible(false);
  };

  const handleChangeEmail = async (email, otp) => {
    try {
      const resultAction = await dispatch(ChangeEmail({ email, otp }));
      if (ChangeEmail.fulfilled.match(resultAction)) {
        dispatch(setSuccess("Email changed successfully"));
        console.log("Email changed successfully:", resultAction.payload);
      } else {
        dispatch(setError("Error changing email"));
        console.error("Error changing email:", resultAction.payload);
      }
    } catch (error) {
      console.error("Error changing email:", error);
    }
  };

  const handleChangeFullName = async (value) => {
    try {
      const resultAction = await dispatch(changeProfile({ fullName: value }));
      if (changeProfile.fulfilled.match(resultAction)) {
        dispatch(setSuccess("Fullname changed successfully"));
      } else {
        dispatch(setError("Error changing fullname"));
      }
    } catch (e) {
      dispatch(setError("Error changing fullname: ", e));
    }
  };

  const handleChangePhoneNumber = async (value) => {
    try {
      const resultAction = await dispatch(
        changeProfile({ phoneNumber: value })
      );
      if (changeProfile.fulfilled.match(resultAction)) {
        dispatch(setSuccess("Phone number changed successfully"));
      } else {
        dispatch(setError(`Error changing phone number: ${error?.message || error}`));
      }
    } catch (error) {
      dispatch(setError(`Error changing phone number: ${error?.message || error}`));
    }
  };

  const handleChangeDateOfBirth = async (value) => {
    try {
      const resultAction = await dispatch(
        changeProfile({ dateOfBirth: value })
      );
      if (changeProfile.fulfilled.match(resultAction)) {
        dispatch(setSuccess("Date of birth changed successfully"));
      } else {
        dispatch(setError("Error changing date of birth: " + error));
      }
    } catch (error) {
      dispatch(setError("Error changing date of birth: " + error));
    }
  };

  return (
    <View className="bg-white rounded-2xl shadow-md p-6 m-4">
      <View className="flex items-center">
        <TouchableOpacity onPress={handleAvatarPress}>
          <UserAvatar size={100} src={urlImage} className="mb-4" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          {fullName}
        </Text>
      </View>

      <View className="space-y-4">
        <View className="flex flex-col py-2 border-b border-gray-100">
          <Text className="text-gray-600 font-medium mb-1">Email</Text>
          <Text className="text-gray-800 break-all">{email}</Text>
        </View>

        <View className="flex flex-row items-center justify-between py-2 border-b border-gray-100">
          <Text className="text-gray-600 font-medium">Date of Birth</Text>
          <Text className="text-gray-800">
            {new Date(dateOfBirth).toLocaleDateString()}
          </Text>
        </View>

        <View className="flex flex-row items-center justify-between py-2 border-b border-gray-100">
          <Text className="text-gray-600 font-medium">Phone Number</Text>
          <Text className="text-gray-800">{phoneNumber}</Text>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={optionsModalVisible}
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <Animated.View
            style={{ opacity: animation }}
            className="bg-white rounded-xl p-6 w-[80%] shadow-lg"
          >
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
              Options
            </Text>

            <TouchableOpacity
              className="bg-blue-500 py-3 px-4 rounded-lg mb-3"
              onPress={handleViewImage}
            >
              <Text className="text-white font-semibold text-center">
                View Image
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-500 py-3 px-4 rounded-lg mb-3"
              onPress={() => setModalEditAvatarVisible(true)}
            >
              <Text className="text-white font-semibold text-center">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-500 py-3 px-4 rounded-lg"
              onPress={() => setOptionsModalVisible(false)}
            >
              <Text className="text-white font-semibold text-center">
                Cancel
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <ChangeAvatarModal
        isOpen={modalEditAvatarVisible}
        onClose={() => setModalEditAvatarVisible(false)}
      />

      <UserEditModal
        isOpen={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onChangeDateOfBirth={handleChangeDateOfBirth}
        onChangeFullName={handleChangeFullName}
        onChangePhoneNumber={handleChangePhoneNumber}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={imageVisible}
        onRequestClose={closeImageModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl p-6 w-[80%] items-center">
            <Image
              source={{ uri: profile?.urlImage }}
              className="w-[200px] h-[200px] rounded-lg mb-4"
              resizeMode="contain"
            />
            <TouchableOpacity
              className="bg-red-500 py-3 px-4 rounded-lg w-full"
              onPress={closeImageModal}
            >
              <Text className="text-white font-semibold text-center">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserInfoCard;
