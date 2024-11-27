import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import * as _formatting from "../../utils/formatting";
function TopicBarItem({ topic, onSelect }) {
  return (
    <TouchableOpacity
      className="w-auto px-4 py-2.5 bg-white rounded-full mx-2 flex-row items-center border border-gray-100 shadow-sm hover:shadow-md active:bg-gray-50"
      onPress={() => onSelect(topic?.name)}
    >
      <Text className="text-secondary text-base font-sscsemibold mr-3">
        {_formatting.formatString(topic?.name) || "Error name"}
      </Text>
      <View className="min-w-[28px] h-7 bg-blue-50 rounded-full justify-center items-center px-2">
        <Text className="text-secondary font-sscsemibold text-sm">
          {topic?.quantity !== undefined ? topic.quantity : "0"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default TopicBarItem;
