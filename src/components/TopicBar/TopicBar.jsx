import React from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import TopicBarItem from "./TopicBarItem";

function TopicBar({ topics, onSelect }) {
  return (
    <View className="bg-white rounded-lg p-4 mb-4">
      <TouchableOpacity
        onPress={() => onSelect("ALL")}
        className="bg-secondary rounded-lg px-4 py-2 mb-4 self-start"
      >
        <Text className="text-white font-sscsemibold">All Topics</Text>
      </TouchableOpacity>

      <FlatList
        data={topics}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TopicBarItem topic={item} onSelect={onSelect} />
        )}
        className="flex-grow"
        ItemSeparatorComponent={() => <View className="w-2" />}
      />
    </View>
  );
}

export default TopicBar;
