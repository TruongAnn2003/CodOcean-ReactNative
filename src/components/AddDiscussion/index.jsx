import React, { memo, useRef, useState } from "react";
import {
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { Button } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { addDiscussion } from "../../services/redux-toolkit/reducers/discussionSlice";
import {
    setError,
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

//   const handleFileChange = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (result.assets && !result.cancelled) {
//       const newFiles = result.assets.map((file) => ({
//         url: file.uri,
//         file: file,
//       }));
//       setSelectedFiles((prev) => [...prev, ...newFiles]);
//     }
//   };

  const handleFileChange = async () => {
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
          const newFiles = result.assets.map((file) => ({
            url: file.uri,
            file: file,
          }));
          setSelectedFiles((prev) => [...prev, ...newFiles]);
        }
      }
    }
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
        {
          type: "application/json",
        }
      )
    );
    selectedFiles.forEach((file) => {
      formData.append("multipartFiles", {
        uri: file.url,
        name: file.file.fileName || "photo.png",
        type: "image/png", 
      });
    });


    try {
      const resultAction = await dispatch(addDiscussion(formData));
      if (addDiscussion.fulfilled.match(resultAction)) {
        dispatch(setSuccess("Add Discussion successfully"));
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
    <View style={styles.container}>
      <Text style={styles.title}>Create New Discussion</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, errors.title ? styles.errorInput : null]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
          />
          {errors.title && <Text style={styles.errorMsg}>{errors.title}</Text>}
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
            style={[styles.input, errors.endAt ? styles.errorInput : null]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {endAt
                ? new Date(endAt).toLocaleString()
                : "Select date and time"}
            </Text>
          </TouchableOpacity>
          {errors.endAt && <Text style={styles.errorMsg}>{errors.endAt}</Text>}
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
            <Text>Add Images</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  textarea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
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
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
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
    backgroundColor: "red",
    borderRadius: 50,
    padding: 5,
  },
  submitButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#007BFF",
  },
  cancelButton: {
    backgroundColor: "#FF6F61",
  },
});

export default memo(AddDiscussion);
