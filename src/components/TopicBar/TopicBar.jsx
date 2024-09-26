import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import TopicBarItem from "./TopicBarItem";

function TopicBar({ topics, onSelect }) {
  return (
    <View classname="py-2">
      <FlatList
        data={topics}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TopicBarItem topic={item} onSelect={onSelect} />
        )}
      />
    </View>
  );
}

export default TopicBar;
