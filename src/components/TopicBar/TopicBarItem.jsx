import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

function TopicBarItem({ topic, onSelect }) {
  return (
    <TouchableOpacity
      className="px-4 py-2 bg-white rounded-full mx-2 flex-row items-center"
      onPress={() => onSelect(topic)}
    >
      <Text className="text-gray-100 text-base font-sscregular mr-2">
        {topic.name}
      </Text>
      <View className="w-4 h-4 bg-gray-300 rounded-full justify-center items-center">
        <Text className="text-white text-xs font-sscregular">
          {topic.quantity}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default TopicBarItem;
