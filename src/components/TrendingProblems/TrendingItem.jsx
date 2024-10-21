// TrendingItem.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import * as _const from "../../utils/_const";

const TrendingItem = ({ problem, onSelect }) => {
  const difficultyStyleColor = () => {
    switch (problem.difficultyLevel) {
      case _const.PROBLEM_DIFFICULTY[1]:
        return "font-sscregular text-green bg-white";
      case _const.PROBLEM_DIFFICULTY[2]:
        return "font-sscregular text-yellow bg-white";
      case _const.PROBLEM_DIFFICULTY[3]:
        return "font-sscregular text-pink bg-white";
      default:
        return "font-sscregular text-gray bg-white";
    }
  };


  return (
    <TouchableOpacity
      className="w-100 p-4 bg-white rounded-lg mx-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
      onPress={() => onSelect(problem)}
    >
      <Text className="font-sscsemibold text-lg text-secondary mb-2">
        {problem.name}
      </Text>

      <View className="flex-row items-center mb-1">
        <Icon name="user" size={18} color="#024873" />
        <Text className="font-sscregular text-secondary ml-1">
          {": "} {problem.submissionCount}
        </Text>
      </View>
      <Text className={`${difficultyStyleColor()} mb-2`}>
        {problem.difficultyLevel}
      </Text>
    </TouchableOpacity>
  );
};

export default TrendingItem;
