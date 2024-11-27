import React, { memo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { Button } from "react-native-elements";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addDiscussion } from "../../services/redux-toolkit/reducers/discussionSlice";
import {
  setError,
  setInfo,
  setSuccess,
} from "../../services/redux-toolkit/reducers/messageSlice";
import CategoryMenu from "../CategoryMenu";

const AddDiscussion = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endAt, setEndAt] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date()); // Initialize with current date
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.discussion);

  // const handleFileChange = async () => {
  //   const permissionResult =
  //     await ImagePicker.requestMediaLibraryPermissionsAsync();

  //   if (permissionResult.granted === false) {
  //     Alert.alert("Permission to access camera roll is required!");
  //     return;
  //   }

  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     quality: 1,
  //   });

  //   if (!result.cancelled) {
  //     if (result.assets && result.assets.length > 0) {
  //       const file = result.assets[0];
  //       if (file.fileSize > 5000000) {
  //         dispatch(setError("File size should be less than 5MB"));
  //       } else {
  //         const newFiles = result.assets.map((file) => ({
  //           url: file.uri,
  //           file: file,
  //         }));
  //         setSelectedFiles((prev) => [...prev, ...newFiles]);
  //       }
  //     }
  //   }
  // };
  const handleFileChange = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1, // Chất lượng ảnh gốc
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileSize = file.fileSize || (await getFileSize(file.uri)); // Luôn đảm bảo lấy được kích thước file

        // Kiểm tra kích thước file trước khi xử lý
        if (fileSize > 5000000) {
          // Nén và resize ảnh
          try {
            const resizedImage = await ImageManipulator.manipulateAsync(
              file.uri,
              [{ resize: { width: 1024 } }], // Resize chiều rộng xuống 1024
              { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG } // Nén 80%, định dạng JPEG
            );

            const compressedFile = {
              ...file,
              uri: resizedImage.uri,
              fileSize:
                resizedImage.fileSize || (await getFileSize(resizedImage.uri)), // Cập nhật kích thước
            };

            // Kiểm tra lại kích thước sau khi nén
            if (compressedFile.fileSize > 5000000) {
              dispatch(
                setError("File size should be less than 5MB after resizing")
              );
            } else {
              const newFiles = [
                {
                  url: compressedFile.uri,
                  file: compressedFile,
                },
              ];
              setSelectedFiles((prev) => [...prev, ...newFiles]);
            }
          } catch (error) {
            console.error("Error resizing image:", error.message);
            dispatch(setError("Failed to resize image"));
          }
        } else {
          // Nếu file đã nhỏ hơn 5MB
          const newFiles = [
            {
              url: file.uri,
              file: file,
            },
          ];
          setSelectedFiles((prev) => [...prev, ...newFiles]);
        }
      }
    }
  };

  // Hàm lấy kích thước file
  const getFileSize = async (uri) => {
    const info = await FileSystem.getInfoAsync(uri);
    return info.size;
  };

  const removeImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!endAt) newErrors.endAt = "End date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearState = () => {
    setTitle("");
    setDescription("");
    setEndAt("");
    setSelectedFiles([]);
    setSelectedCategories([]);
  };

  const handleAddDiscussion = async () => {
    const formData = new FormData();
    formData.append(
      "request",
      new Blob(
        [
          JSON.stringify({
            title,
            description,
            endAt,
            categories: selectedCategories,
          }),
        ],
        { type: "application/json" }
      )
    );

    selectedFiles.forEach((file) => {
      formData.append("multipartFiles", {
        uri: file.uri.startsWith("file://") ? file.uri : `file://${file.uri}`,
        type: file.type || "image/jpeg",
        name: file.name || "photo.jpg",
      });
    });
    console.log("formData:", JSON.stringify(formData, null, 2));
    try {
      const resultAction = await dispatch(addDiscussion(formData));
      console.log("Result action:", JSON.stringify(resultAction, null, 2));

      if (addDiscussion.fulfilled.match(resultAction)) {
        await dispatch(setSuccess("Add Discussion successfully"));
        clearState();
      } else {
        dispatch(setError(`Error add discussion (${error})`));
      }
    } catch (e) {
      console.error("Error add discussion: ", e);
    }
  };

  const handleSelectedCategoriesChange = (categories) => {
    setSelectedCategories(categories);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleAddDiscussion();
    }
  };

  const onChange = async (event, selectedDate) => {
    const currentDate = selectedDate || date;
    await setShowDatePicker(false);
    await setDate(currentDate);
    await setEndAt(currentDate.toISOString());
  };

  return (
    <Modal visible={true} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.title}>Create New Discussion</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <FontAwesome name="times" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.title ? styles.errorInput : null,
                  ]}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter title"
                />
                {errors.title && (
                  <Text style={styles.errorMsg}>{errors.title}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[
                    styles.textarea,
                    errors.description ? styles.errorInput : null,
                  ]}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  placeholder="Enter description"
                  ref={inputRef}
                />
                {errors.description && (
                  <Text style={styles.errorMsg}>{errors.description}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>End Date & Time</Text>
                <TouchableOpacity
                  style={[
                    styles.input,
                    errors.endAt ? styles.errorInput : null,
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>
                    {endAt
                      ? new Date(endAt).toLocaleString()
                      : "Select date and time"}
                  </Text>
                </TouchableOpacity>
                {errors.endAt && (
                  <Text style={styles.errorMsg}>{errors.endAt}</Text>
                )}
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  is24Hour={true}
                  display={"spinner"}
                  onChange={onChange}
                />
              )}

              <CategoryMenu
                onSelectedCategoriesChange={handleSelectedCategoriesChange}
              />

              <View style={styles.imagesSection}>
                <Text style={styles.label}>Images</Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleFileChange}
                >
                  <FontAwesome name="plus" size={24} />
                  <Text style={styles.uploadButtonText}>Add Images</Text>
                </TouchableOpacity>

                <FlatList
                  data={selectedFiles}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item.url }} style={styles.image} />
                      <TouchableOpacity
                        onPress={() => removeImage(index)}
                        style={styles.removeImageButton}
                      >
                        <FontAwesome name="times" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  )}
                  numColumns={3}
                />
              </View>

              <View style={styles.submitButtonContainer}>
                <Button
                  title="Cancel"
                  onPress={onClose}
                  buttonStyle={styles.cancelButton}
                />
                <Button
                  title="Create Discussion"
                  onPress={handleSubmit}
                  buttonStyle={styles.submitButton}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  textarea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "red",
  },
  errorMsg: {
    marginTop: 5,
    fontSize: 12,
    color: "red",
  },
  imagesSection: {
    marginTop: 20,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  imageContainer: {
    position: "relative",
    margin: 5,
    borderRadius: 5,
    overflow: "hidden",
    width: "30%",
  },
  image: {
    width: "100%",
    height: 100,
    objectFit: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    borderRadius: 50,
    padding: 5,
  },
  submitButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingVertical: 10,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: "#FF6F61",
    paddingHorizontal: 20,
  },
});

export default memo(AddDiscussion);

