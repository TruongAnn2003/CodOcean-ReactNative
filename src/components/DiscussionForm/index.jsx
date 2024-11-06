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
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker"; // Import expo-image-picker

const DiscussionForm = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState(initialData ? initialData.title : "");
  const [description, setDescription] = useState(
    initialData ? initialData.description : ""
  );
  const [selectedCategories, setSelectedCategories] = useState(
    initialData ? initialData.categories : []
  );
  const [image, setImage] = useState(initialData ? initialData.image : "");
  const { categories } = useSelector((state) => state.searchDiscussion);

  // Hàm xử lý chọn ảnh từ thư viện thiết bị
  const handleImagePick = async () => {
    // Yêu cầu quyền truy cập thư viện ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need your permission to access the photo library."
      );
      return;
    }

    // Mở thư viện ảnh
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Lưu đường dẫn ảnh đã chọn
    }
  };

  const handleSubmit = () => {
    const discussionData = {
      title,
      description,
      categories: selectedCategories,
      image,
    };
    onSubmit(discussionData);
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
      {categories.map((category) => (
        <View key={category.name} style={styles.checkboxContainer}>
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

      <Text style={styles.label}>Image:</Text>
      <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
        <Text style={styles.imageButtonText}>Pick an Image</Text>
      </TouchableOpacity>
      {image ? (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      ) : null}

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
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 15,
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
});

export default DiscussionForm;
