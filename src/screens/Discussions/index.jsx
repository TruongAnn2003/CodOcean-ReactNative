import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, Icon } from "react-native-elements";
import CategoryList from "../../components/CategoryList";
import DiscussionPost from "../../components/DiscussionPost";
import FilterStatus from "../../components/FilterStatus";
import UpdateDiscussion from "../../components/UpdateDiscussion";
import {
  addDiscussion,
  getCategories,
  getDiscussions,
  setFilters,
} from "../../services/redux-toolkit/reducers/discussionSlice";
import {
  setError,
  setSuccess,
} from "../../services/redux-toolkit/reducers/messageSlice";
import AddDiscussion from "../../components/AddDiscussion";

export default function Discussions() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { discussionPosts, filters, error } = useSelector(
    (state) => state.discussion
  );
  const [inputValue, setInputValue] = useState("");
  const [isFormVisible, setFormVisible] = useState(false);

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

  return (
    <ScrollView style={styles.container}>
      <CategoryList />

      <View style={styles.searchContainer}>
        <Input
          placeholder={t("features.discussion.search.placeholder")}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleSearchSubmit}
          leftIcon={<Icon name="search" size={24} color="#007bff" />}
          rightIcon={
            inputValue ? (
              <Icon
                name="clear"
                size={24}
                color="#007bff"
                onPress={() => setInputValue("")}
              />
            ) : null
          }
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputStyle}
        />
        <Button
          title={t("features.discussion.search.button")}
          onPress={handleSearchSubmit}
          containerStyle={styles.searchButtonContainer}
          buttonStyle={styles.searchButtonStyle}
        />
      </View>

      <FilterStatus />

      <TouchableOpacity
        style={styles.newDiscussionButton}
        onPress={() => setFormVisible((prev) => !prev)}
      >
        <Text style={styles.newDiscussionButtonText}>
          {t("features.discussion.newDiscussion")}
        </Text>
      </TouchableOpacity>

      {isFormVisible && (
        <AddDiscussion onClose={() => setFormVisible((prev) => !prev)} />
      )}

      <View style={styles.discussionsContainer}>
        {discussionPosts.map((discussion) => (
          <DiscussionPost key={discussion.id} post={discussion} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  searchContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 8,
  },
  inputStyle: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#007bff",
    paddingLeft: 16,
  },
  searchButtonContainer: {
    marginTop: 8,
  },
  searchButtonStyle: {
    backgroundColor: "#007bff",
    borderRadius: 25,
  },
  newDiscussionButton: {
    backgroundColor: "#007bff",
    borderRadius: 25,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  newDiscussionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  discussionsContainer: {
    flex: 1,
  },
});
