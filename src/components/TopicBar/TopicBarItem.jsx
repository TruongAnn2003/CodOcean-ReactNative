import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import * as _formatting from "../../utils/_formatting";
function TopicBarItem({ topic, onSelect }) {
  return (
    <TouchableOpacity
      className="w-auto px-4 py-2 bg-white rounded-full mx-2 flex-row items-center"
      onPress={() => onSelect(topic?.name)}
    >
      <Text className="text-primary text-base font-sscregular mr-2">
        {_formatting.formatString(topic?.name) || "Error name"}
      </Text>
      <View className="w-5 h-5 bg-gray-300 rounded-full justify-center items-center">
        <Text className="text-black text-xs font-sscregular">
          {topic?.quantity !== undefined ? topic.quantity : "0"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default TopicBarItem;
