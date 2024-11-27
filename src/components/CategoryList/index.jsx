import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setFilters } from "../../services/redux-toolkit/reducers/discussionSlice";
import { Card } from "react-native-elements";
import { SvgUri } from "react-native-svg";

const CategoryList = () => {
  const dispatch = useDispatch();
  const { categories, filters } = useSelector((state) => state.discussion);

  const handleSelectCategory = async (value) => {
    const newFilters = { ...filters, category: value };
    await dispatch(setFilters({ newFilters }));
  };

  const renderCategoryItem = ({ item }) => {
    const isSvg = item.imageUrl.endsWith(".svg");

    return (
      <Card containerStyle={styles.card}>
        {isSvg ? (
          <SvgUri
            width="100%"
            height="150"
            uri={item.imageUrl}
            style={styles.image}
          />
        ) : (
          <Card.Image source={{ uri: item.imageUrl }} style={styles.image} />
        )}
        <Card.Title>{item.name}</Card.Title>
        <Card.Divider />
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity
          onPress={() => handleSelectCategory(item.name)}
          style={styles.selectButton}
        >
          <Text style={styles.selectButtonText}>Select Category</Text>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>
          Explore our diverse range of topics and find what interests you
        </Text>
      </View>

      {categories.length > 0 ? (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.name.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noResultsText}>No categories found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    borderRadius: 10,
    elevation: 5,
    marginRight: 15,
    width: 250,
  },
  image: {
    borderRadius: 10,
    height: 150,
    resizeMode: "cover",
  },
  description: {
    marginTop: 10,
    color: "#555",
  },
  noResultsText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 16,
  },
  selectButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default React.memo(CategoryList);
