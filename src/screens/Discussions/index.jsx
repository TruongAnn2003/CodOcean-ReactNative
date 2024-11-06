import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CategoriesList from "../../components/CategoriesList";
import DiscussionForm from "../../components/DiscussionForm";
import DiscussionPost from "../../components/DiscussionPost";
import { FilterStatus } from "../../components/FilterStatus";
import { addDiscussion } from "../../services/redux-toolkit/reducers/manageDiscussionSlice";
import { setError } from "../../services/redux-toolkit/reducers/messageSlice";
import {
  getCategories,
  getDiscussions,
  setFilters,
} from "../../services/redux-toolkit/reducers/searchDiscussionSlice";

export default function Discussions() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { discussionPosts, filters, error, categories } = useSelector(
    (state) => state.searchDiscussion
  );
  const [inputValue, setInputValue] = useState("");
  const [isFormVisible, setFormVisible] = useState(false); // State to control form visibility
  const [currentDiscussion, setCurrentDiscussion] = useState(); // State for current discussion data

  useEffect(() => {
    dispatch(getCategories())
      .unwrap()
      .catch((err) =>
        dispatch(
          setError(
            `${t("features.discussion.getCategories.failure")} (${err.message})`
          )
        )
      );
  }, []);

  useEffect(() => {
    dispatch(getDiscussions(filters))
      .unwrap()
      .catch((err) =>
        dispatch(
          setError(
            `${t("features.discussion.getDiscussions.failure")} (${
              err.message
            })`
          )
        )
      );
  }, [filters]);

  const updateFilters = (newFilters) => {
    dispatch(setFilters({ newFilters }));
  };

  const handleSearchSubmit = () => {
    updateFilters({ ...filters, searchTerm: inputValue });
  };

  const handleFilterCategory = (value) => {
    updateFilters({ ...filters, category: value });
  };

  const handleRemoveStatusFilter = (status) => {
    let removedStatus = {};
    const entry = Object.entries(filters).find(
      ([key, value]) => value === status
    );
    if (entry && entry[0] === "searchTerm") {
      removedStatus = { searchTerm: "" };
    } else {
      removedStatus[entry[0]] = "ALL";
    }
    updateFilters({ ...filters, ...removedStatus });
  };

  const handleNewDiscussion = () => {
    setCurrentDiscussion({
      title: "",
      description: "",
      categories: [],
      endAt: "",
      image: "",
    });
    setFormVisible(true);
  };

  const handleEditDiscussion = (discussion) => {
    setCurrentDiscussion(discussion);
    setFormVisible(true);
  };

  const handleFormSubmit = async (discussionData) => {
    console.log("Discussion data:", discussionData);
    try {
      const resultAction = await dispatch(addDiscussion(discussionData));
      if (addDiscussion.fulfilled.match(resultAction)) {
        dispatch(setSuccess("Add Discussion successfully"));
      } else {
        dispatch(setError("Error add discussion"));
      }
    } catch (e) {
      console.error("Error add discussion:", e);
    }
    setFormVisible(false);
  };

  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true}>
      <CategoriesList categories={categories} onSelect={handleFilterCategory} />
      <View style={styles.searchContainer}>
        <TextInput
          placeholder={"Discussion Title"}
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleSearchSubmit} // Allow submit via keyboard
        />
        <Button title={"Search"} onPress={handleSearchSubmit} />
      </View>

      <FilterStatus onRemoveFilter={handleRemoveStatusFilter} />

      <Button title={"New Discussion"} onPress={handleNewDiscussion} />

      {isFormVisible && (
        <DiscussionForm
          initialData={currentDiscussion}
          onSubmit={handleFormSubmit}
        />
      )}

      <ScrollView style={styles.discussionsContainer}>
        {discussionPosts.map((discussion) => (
          <View key={discussion.id}>
            {/* <DiscussionPost
        
              discussion={discussion}
              onEdit={() => handleEditDiscussion(discussion)} // Pass edit function
            /> */}
            <DiscussionPost post={discussion}></DiscussionPost>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    height: 40,
    flex: 1, // Take up all available space
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 10, // Spacing between input and button
  },
  discussionsContainer: {
    flex: 1,
  },
});
