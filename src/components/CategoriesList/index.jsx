import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import PropTypes from "prop-types";

export function CategoriesList({ categories, onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const handleSelect = (category) => {
    setSelectedCategory(category);
    if (onSelect) {
      onSelect(category);
    }
  };

  const handleToggleDescription = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesList}
    >
      {/* Add the "All" category */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryItem,
            selectedCategory === "ALL" && styles.selected,
          ]}
          onPress={() => handleSelect("ALL")}
        >
          <Text style={styles.categoryText}>All</Text>
        </TouchableOpacity>
      </View>

      {categories.map((category, index) => (
        <View key={index} style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategory === category.name && styles.selected,
            ]}
            onPress={() => handleSelect(category.name)}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleToggleDescription(category.name)}
          >
            {expandedCategory === category.name && (
              <Text style={styles.categoryDescription}>
                {category.description}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

CategoriesList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func,
};

const styles = StyleSheet.create({
  categoriesList: {
    marginBottom: 16,
    paddingVertical: 10,
  },
  categoryContainer: {
    marginRight: 10,
    alignItems: "center",
  },
  categoryItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#007bff", // Background color when selected
  },
  categoryText: {
    fontWeight: "bold",
    color: "#333",
  },
  categoryDescription: {
    color: "#666",
    fontSize: 12,
    marginTop: 5,
  },
});

export default CategoriesList;
