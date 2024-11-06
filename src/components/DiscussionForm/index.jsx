import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Platform,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const DiscussionForm = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState(initialData ? initialData.title : "");
  const [description, setDescription] = useState(
    initialData ? initialData.description : ""
  );
  const [selectedCategories, setSelectedCategories] = useState(
    initialData ? initialData.categories : []
  );
  const [images, setImages] = useState(
    initialData ? initialData.images || [] : []
  );
  const [endAt, setEndAt] = useState(
    initialData && initialData.endAt ? new Date(initialData.endAt) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { categories } = useSelector((state) => state.searchDiscussion);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need your permission to access the photo library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  const createFormData = (images, selectedCategories) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    const categoryList = selectedCategories.map((category) => ({
      name: category.name,
      description: category.description,
    }));

    formData.append("categories", JSON.stringify(categoryList));
    images.forEach((uri, index) => {
      formData.append("imageUrls", {
        uri,
        name: `photo_${index}.jpg`,
        type: "image/jpeg",
      });
    });
    formData.append("endAt", new Date(endAt).toISOString().replace("Z", "")); // Adding endAt to the formData

    return formData;
  };

  const handleSubmit = () => {
    const formData = createFormData(images, selectedCategories);
    onSubmit(formData);
  };

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imagePreview} />
  );

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Hide the date picker after selection
    if (event.type === "set") {
      setEndAt(selectedDate || endAt); // Update endAt with the selected date
    } // If canceled, do nothing
  };

  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true}>
      <Text style={styles.title}>
        {initialData ? "Edit Discussion" : "Add Discussion"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Categories:</Text>
      {categories.map((category, index) => (
        <View key={category.name + index} style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={selectedCategories.includes(category.name)}
            onPress={(isChecked) =>
              setSelectedCategories(
                isChecked
                  ? [...selectedCategories, category.name]
                  : selectedCategories.filter((c) => c !== category.name)
              )
            }
            fillColor="#007AFF"
            text={category.name}
            textStyle={styles.checkboxLabel}
          />
        </View>
      ))}

      <Text style={styles.label}>End Date:</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {endAt ? new Date(endAt).toLocaleString() : "Select Date"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(endAt) || new Date()}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Images:</Text>
      <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
        <Text style={styles.imageButtonText}>Pick an Image</Text>
      </TouchableOpacity>

      {images.length > 0 && (
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageList}
        />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {initialData ? "Update Discussion" : "Create Discussion"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  imageButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageList: {
    marginVertical: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
    resizeMode: "cover",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DiscussionForm;
