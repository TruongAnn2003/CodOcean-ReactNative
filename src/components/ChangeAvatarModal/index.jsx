import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  setError,
  setSuccess,
} from "../../services/redux-toolkit/reducers/messageSlice";
import { AVATAR_LINKS } from "../../constants/images";
import { changeAvatar } from "../../services/redux-toolkit/reducers/profileSlice";
import * as ImagePicker from "expo-image-picker";

const ChangeAvatarModal = ({ isOpen, onClose }) => {
  const { profile } = useSelector((state) => state.profile);
  const [selectedAvatar, setSelectedAvatar] = useState(
    profile.urlImage || null
  );
  const dispatch = useDispatch();

  const defaultAvatars = [...AVATAR_LINKS];

  const handleFileUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.fileSize > 5000000) {
          dispatch(setError("File size should be less than 5MB"));
        } else {
          setSelectedAvatar(file.uri);
        }
      }
    }
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleChangeAvatar = async () => {
    if (!selectedAvatar) {
      dispatch(setError("Please select an avatar first."));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: selectedAvatar,
        name: "avatar.png",
        type: "image/png",
      });

      const resultAction = await dispatch(changeAvatar(formData));
      if (changeAvatar.fulfilled.match(resultAction)) {
        dispatch(setSuccess("Avatar changed successfully"));
        onClose();
      } else {
        dispatch(setError("Error changing avatar"));
      }
    } catch (e) {
      dispatch(setError("Error changing avatar"));
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.modalWrapper}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Change Avatar</Text>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.avatarSection}>
              <Text style={styles.avatarTitle}>
                Choose from Default Avatars
              </Text>
              <ScrollView horizontal={true} style={styles.avatarContainer}>
                {defaultAvatars.map((avatar, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleAvatarSelect(avatar)}
                    style={[
                      styles.avatarButton,
                      selectedAvatar === avatar && styles.selected,
                    ]}
                  >
                    <Image
                      source={{ uri: avatar }}
                      style={styles.avatarImage}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.uploadSection}>
              <Text style={styles.avatarTitle}>Upload Your Own</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleFileUpload}
              >
                <Text style={styles.uploadText}>Click to upload an image</Text>
              </TouchableOpacity>
            </View>

            {selectedAvatar && (
              <View style={styles.previewSection}>
                <Text style={styles.avatarTitle}>Preview</Text>
                <Image
                  source={{ uri: selectedAvatar || "" }}
                  style={styles.previewImage}
                />
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleChangeAvatar}
                style={styles.saveButton}
              >
                <Text>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    fontSize: 18,
    color: "#333",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    marginTop: 20,
  },
  avatarSection: {
    marginBottom: 20,
  },
  avatarTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  avatarContainer: {
    flexDirection: "row",
  },
  avatarButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    margin: 5,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
  },
  selected: {
    borderColor: "blue",
    borderWidth: 2,
  },
  uploadSection: {
    marginVertical: 20,
  },
  uploadButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  uploadText: {
    color: "#fff",
  },
  previewSection: {
    marginVertical: 20,
    alignItems: "center",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  saveButton: {
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 5,
  },
});

export default ChangeAvatarModal;
