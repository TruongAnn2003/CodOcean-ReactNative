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
  ScrollView,
  Modal,
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

const UpdateDiscussion = ({ post, onClose, onEditDiscussion }) => {
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
      const request = {
        title,
        description,
        categories: selectedCategories,
        endAt,
      };
      const resultAction = await dispatch(
        updateDiscussion({
          id: post.id,
          request,
        })
      );
      if (updateDiscussion.fulfilled.match(resultAction)) {
        dispatch(setSuccess("Edit Discussion successfully"));
        clearState();
        onEditDiscussion(resultAction.payload);
      } else {
        dispatch(setError(`Error edit discussion (${error})`));
      }
    } catch (e) {
      console.error("Error edit discussion: ", e);
    } finally {
      onClose();
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
    <Modal visible={true} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-11/12 max-h-[90%] bg-white rounded-xl">
          <ScrollView>
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-800">
                Edit Discussion
              </Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <FontAwesome name="times" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View className="p-4">
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-1">
                  Title
                </Text>
                <TextInput
                  className={`w-full p-3 border rounded-lg ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter title"
                />
                {errors.title && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.title}
                  </Text>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-1">
                  Description
                </Text>
                <TextInput
                  className={`w-full p-3 border rounded-lg min-h-[100px] ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  placeholder="Enter description"
                  ref={inputRef}
                />
                {errors.description && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </Text>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-1">
                  End Date & Time
                </Text>
                <TouchableOpacity
                  className={`w-full p-3 border rounded-lg ${
                    errors.endAt ? "border-red-500" : "border-gray-300"
                  }`}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className="text-gray-700">
                    {endAt
                      ? new Date(endAt).toLocaleString()
                      : "Select date and time"}
                  </Text>
                </TouchableOpacity>
                {errors.endAt && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.endAt}
                  </Text>
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

              <View className="flex-row justify-between mt-6">
                <Button
                  title="Cancel"
                  onPress={onClose}
                  buttonStyle="bg-gray-500 px-6 py-2 rounded-lg"
                  titleStyle="text-white font-semibold"
                />
                <Button
                  title="Edit Discussion"
                  onPress={handleSubmit}
                  buttonStyle="bg-blue-500 px-6 py-2 rounded-lg"
                  titleStyle="text-white font-semibold"
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default memo(UpdateDiscussion);
