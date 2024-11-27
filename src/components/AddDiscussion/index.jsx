import React, { memo, useRef, useState } from "react";
import {
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

const AddDiscussion = ({ onClose, onAddDiscussion }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endAt, setEndAt] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date()); // Initialize with current date
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.discussion);

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
    setSelectedCategories([]);
  };

  const handleAddDiscussion = async () => {
    try {
      const request = {
        title,
        description,
        endAt,
        categories: selectedCategories,
      };

      const resultAction = await dispatch(addDiscussion(request));
      console.log("Data:", resultAction.payload);

      if (addDiscussion.fulfilled.match(resultAction)) {
        await dispatch(setSuccess("Add Discussion successfully"));
        onAddDiscussion(resultAction.payload);
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
