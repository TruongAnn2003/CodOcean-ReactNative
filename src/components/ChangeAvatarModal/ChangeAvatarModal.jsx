import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { avatarSuggestions } from "../../constants/images";
import { ChangeAvatar } from "../../services/redux-toolkit/reducers/profileSlice";
import { useDispatch } from "react-redux";
import {
  setError,
  setSuccess,
} from "../../services/redux-toolkit/reducers/messageSlice";
import { useTranslation } from "react-i18next";


const ChangeAvatarModal = ({ visible, onClose }) => {
  const [selectedUri, setSelectedUri] = useState(avatarSuggestions[0].uri);
  const dispatch = useDispatch();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {

      setSelectedUri(result.assets[0].uri);
    }
  };

  const handleChangeAvatar = async () => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: selectedUri,
        name: "avatar.jpg",
        type: "image/jpeg",
      });

      const resultAction = await dispatch(ChangeAvatar(formData));
      if (ChangeAvatar.fulfilled.match(resultAction)) {
        dispatch(setSuccess("Avatar changed successfully"));
        console.log("Avatar changed successfully:", resultAction.payload);
      } else {
        dispatch(setError("Error changing avatar"));
        console.error("Error changing avatar:", resultAction.payload);
      }
      onClose();
    } catch (error) {
      console.error("Error changing avatar:", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Change Avatar</Text>
          <FlatList
            data={avatarSuggestions}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedUri(item.uri)}>
                <Image
                  source={{ uri: item.uri }}
                  style={[
                    styles.avatar,
                    selectedUri === item.uri && styles.selectedAvatar,
                  ]}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.avatarList}
          />
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {selectedUri && (
            <Image
              source={{ uri: selectedUri || avatarSuggestions[0].uri }}
              style={styles.selectedImage}
            />
          )}
          <View style={styles.buttonContainer}>
            <Button title="Change" onPress={handleChangeAvatar} />
            <Button title="Cancel" onPress={onClose} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
  },
  avatarList: {
    paddingVertical: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedAvatar: {
    borderColor: "blue",
  },
  selectedImage: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
});

export default ChangeAvatarModal;
