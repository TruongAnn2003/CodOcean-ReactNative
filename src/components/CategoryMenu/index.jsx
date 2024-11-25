import React, { useState, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { SvgUri } from "react-native-svg";

const CategoryMenu = ({ onSelectedCategoriesChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [error, setError] = useState("");

  const categories = useSelector((state) => state.discussion.categories);

  const handleSelectAll = () => {
    setSelectedCategories([...categories]);
    onSelectedCategoriesChange([...categories]);
    setError("");
  };

  const handleSelectCategory = (category) => {
    const isSelected = selectedCategories.some((cat) => cat.id === category.id);
    const updatedSelectedCategories = isSelected
      ? selectedCategories.filter((cat) => cat.id !== category.id)
      : [...selectedCategories, category];

    if (updatedSelectedCategories.length === 0) {
      setError("Please select at least one category");
    } else {
      setError("");
    }

    setSelectedCategories(updatedSelectedCategories);
    onSelectedCategoriesChange(updatedSelectedCategories);
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    onSelectedCategoriesChange([]);
    setError("");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.headerTitle}>Categories</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="gray"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandableContainer}>
          <TouchableOpacity onPress={handleSelectAll} style={styles.button}>
            <Text style={styles.buttonText}>Select All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClearAll} style={styles.buttonClear}>
            <Text style={styles.buttonText}>Clear All</Text>
          </TouchableOpacity>
          {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleSelectCategory(item)}
              >
                <CheckBox
                  checked={selectedCategories.some((cat) => cat.id === item.id)}
                  onPress={() => handleSelectCategory(item)}
                  containerStyle={styles.checkbox}
                />
                <View style={styles.cardContent}>
                  {item.imageUrl.endsWith(".svg") ? (
                    <SvgUri
                      width={40} // Adjusted size
                      height={40} // Adjusted size
                      uri={item.imageUrl}
                      style={styles.image}
                    />
                  ) : (
                    <Image
                      source={{ uri: item.imageUrl || "" }}
                      style={styles.image}
                    />
                  )}

                  <View style={styles.infoContainer}>
                    <Text style={styles.categoryName}>{item.name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.categoryId}>ID: {item.id}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  expandableContainer: {
    paddingVertical: 10,
  },
  button: {
    paddingVertical: 10,
  },
  buttonClear: {
    paddingVertical: 10,
    color: "red",
  },
  buttonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  errorMessage: {
    color: "red",
    marginVertical: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
  },
  checkbox: {
    marginRight: 10,
  },
  image: {
    width: 40, // Adjusted size
    height: 40, // Adjusted size
    borderRadius: 5,
  },
  infoContainer: {
    marginLeft: 10,
    flexGrow: 1,
  },
  categoryName: {
    fontWeight: "500",
  },
  description: {
    fontSize: 12,
    color: "#777",
  },
  categoryId: {
    fontSize: 10,
    color: "#aaa",
  },
});

export default memo(CategoryMenu);
