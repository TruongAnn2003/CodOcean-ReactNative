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
  const [posts, setPosts] = useState(discussionPosts || []);
  const [hasMore, setHasMore] = useState(true);
  const handleAddDiscussion = (discussion) => {
    setPosts((prev) => [discussion, ...prev]);
    setFormVisible(false);
  };

  const handleUpdateDiscussion = (updatedDiscussion) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === updatedDiscussion.id ? updatedDiscussion : post
      )
    );
  };

  const handleDeleteDiscussion = (deletedDiscussion) => {
    setPosts((prev) => prev.filter((post) => post.id !== deletedDiscussion.id));
  };

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
    fetchDiscussionPosts();
  }, [filters]);

  const fetchDiscussionPosts = async () => {
    try {
      const resultAction = await dispatch(getDiscussions(filters));
      if (getDiscussions.rejected.match(resultAction))
        await dispatch(
          setError(
            `${t("features.discussion.getDiscussions.failure")} (${error})`
          )
        );
      else {
        let newPosts = [];
        newPosts = resultAction.payload.discussDTOs;
        setPosts([...newPosts]);
        setHasMore(newPosts.length > 0);
      }
    } catch (e) {
      await dispatch(
        setError(
          `${t("features.discussion.getDiscussions.failure")} (${e.message})`
        )
      );
    }
  };

  const updateFilters = (newFilters) => {
    dispatch(setFilters({ newFilters }));
  };

  const handleSearchSubmit = () => {
    updateFilters({ ...filters, searchTerm: inputValue });
  };

   const handleToggleReaction = (postId) => {
     setPosts((prevPosts) =>
       prevPosts.map((post) => {
         if (post.id === postId) {
           return {
             ...post,
             liked: !post.liked,
             reactCount: post.liked
               ? Math.max(0, post.reactCount - 1)
               : post.reactCount + 1,
           };
         }
         return post;
       })
     );
   };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <CategoryList />

      <View className="mb-4 px-2">
        <View className="flex-row items-center space-x-2">
          <View className="flex-1">
            <Input
              placeholder={t("features.discussion.search.placeholder")}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleSearchSubmit}
              leftIcon={<Icon name="search" size={20} color="#3b82f6" />}
              rightIcon={
                inputValue ? (
                  <Icon
                    name="clear"
                    size={20}
                    color="#3b82f6"
                    onPress={() => setInputValue("")}
                  />
                ) : null
              }
              containerStyle={{
                paddingHorizontal: 0,
                paddingVertical: 0,
                height: 45,
              }}
              inputContainerStyle={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                paddingLeft: 8,
                backgroundColor: "white",
                height: "100%",
              }}
              inputStyle={{
                fontSize: 16,
              }}
            />
          </View>

          <TouchableOpacity
            className="bg-blue-500 h-[45px] px-4 rounded-lg justify-center"
            onPress={handleSearchSubmit}
            activeOpacity={0.7}
          >
            <Icon name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <FilterStatus />
      <TouchableOpacity
        className="bg-blue-500 py-3 px-5 rounded-lg mb-4 flex-row items-center justify-center space-x-2"
        onPress={() => setFormVisible((prev) => !prev)}
      >
        <Icon name="add" size={24} color="white" />
        <Text className="text-white font-medium text-base">
          {t("features.discussion.newDiscussion")}
        </Text>
      </TouchableOpacity>

      {isFormVisible && (
        <AddDiscussion
          onClose={() => setFormVisible((prev) => !prev)}
          onAddDiscussion={handleAddDiscussion}
        />
      )}

      <View className="flex-1 space-y-4">
        {posts.map((post) => (
          <DiscussionPost
            key={post.id}
            post={post}
            onToggleReaction={handleToggleReaction}
            onUpdate={handleUpdateDiscussion}
            onDelete={handleDeleteDiscussion}
          />
        ))}
      </View>
    </ScrollView>
  );
}
