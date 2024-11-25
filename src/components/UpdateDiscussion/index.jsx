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
import { updateDiscussion } from "../../services/redux-toolkit/reducers/discussionSlice";
import {
  setError,
  setSuccess,
} from "../../services/redux-toolkit/reducers/messageSlice";
import CategoryMenu from "../CategoryMenu";

const UpdateDiscussion = ({ post, onClose }) => {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [endAt, setEndAt] = useState(post.endAt);
  const [selectedCategories, setSelectedCategories] = useState(post.categories);
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
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

  const handleUpdateDiscussion = async () => {
    try {
      const resultAction = await dispatch(
        updateDiscussion(post.id, {
          title,
          description,
          categories: selectedCategories,
          endAt,
        })
      );
      if (updateDiscussion.fulfilled.match(resultAction)) {
        dispatch(setSuccess("Add Discussion successfully"));
        clearState();
      } else {
        dispatch(setError(`Error add discussion (${error})`));
      }
    
    } catch (e) {
      console.error("Error add discussion: ", e);
    }
    finally{
      onClose()
    }
  };

  const handleSelectedCategoriesChange = (categories) => {
    setSelectedCategories(categories);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleUpdateDiscussion();
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
      <Text style={styles.title}>Edit Discussion</Text>

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

export default memo(UpdateDiscussion);
