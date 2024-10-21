import React from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import TopicBarItem from "./TopicBarItem";

function TopicBar({ topics, onSelect }) {
  return (
    <View className="flex-row items-center py-2">
      <TouchableOpacity
        onPress={() => onSelect("ALL")}
        className="bg-secondary rounded-full mx-2 flex-row items-center px-4 py-2 w-50 h-10"
      >
        <Text className="text-white font-sscsemibold">All</Text>
      </TouchableOpacity>
      <FlatList
        data={topics}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TopicBarItem topic={item} onSelect={onSelect} />
        )}
        contentContainerStyle={{ flexDirection: "row" }} // Ensures the items are in a row
      />
    </View>
  );
}

export default TopicBar;
