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
import { changeProfile } from "../../services/redux-toolkit/reducers/profileSlice";
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
        dispatch(setError("Error changing phone number: " + error));
      }
    } catch (error) {
      dispatch(setError("Error changing phone number: " + error));
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
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={handleAvatarPress}>
        <UserAvatar size={100} src={urlImage} className="mb-2" />
      </TouchableOpacity>
      <Text style={styles.userName}>{fullName}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.value}>
          {new Date(dateOfBirth).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.value}>{phoneNumber}</Text>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={optionsModalVisible}
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <Animated.View
            style={[styles.modalContainer, { opacity: animation }]}
          >
            <Text style={styles.modalTitle}>Options</Text>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleViewImage}
            >
              <Text style={styles.buttonText}>View Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setModalEditAvatarVisible(true)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setOptionsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
      <ChangeAvatarModal
        isOpen={modalEditAvatarVisible}
        onClose={() => setModalEditAvatarVisible(false)}
      />

      <UserEditModal
        onChangeDateOfBirth={handleChangeDateOfBirth}
        // onChangeEmail={handleChangeEmail}
        onChangeFullName={handleChangeFullName}
        onChangePhoneNumber={handleChangePhoneNumber}
      />

      {/* Modal for Viewing Image */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={imageVisible}
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.imageModalContainer}>
            <Image
              source={{ uri: profile?.urlImage }}
              style={styles.image}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeImageModal}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    margin: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#777",
  },
  editProfileButton: {
    backgroundColor: "#048cbf",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  editModalContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  editModalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  saveButton: {
    backgroundColor: "#048cbf",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#DC4C67",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 5,
  },
  imageModalContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  closeButton: {
    backgroundColor: "#DC4C67",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "#048cbf",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UserInfoCard;
