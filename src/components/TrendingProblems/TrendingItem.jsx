// TrendingItem.js
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { PROBLEM_DIFFICULTY } from "../../constants";

const TrendingItem = ({ problem, onSelect, index }) => {
  const difficultyStyleColor = () => {
    switch (problem.difficulty) {
      case PROBLEM_DIFFICULTY[1]:
        return "bg-green-100 text-green";
      case PROBLEM_DIFFICULTY[2]:
        return "bg-yellow-100 text-yellow";
      case PROBLEM_DIFFICULTY[3]:
        return "bg-pink-100 text-pink";
      default:
        return "bg-gray-100 text-gray";
    }
  };

  return (
    <TouchableOpacity
      className="w-100 bg-white rounded-2xl mx-2 shadow-lg overflow-hidden"
      onPress={() => onSelect(problem)}
    >
      <View style={{ height: 96, backgroundColor: "#4A90E2" }}>
        <Image
          source={{
            uri: `https://picsum.photos/id/${index + 100}/200/300`,
          }}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "cover",
          }}
        />
      </View>

      <View className="px-4 pt-3 pb-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text
            className={`${difficultyStyleColor()} font-sscsemibold px-3 py-1 rounded-full text-sm`}
          >
            {problem.difficultyLevel}
          </Text>
          <View className="flex-row items-center">
            <FontAwesome5 name="fire" size={16} color="#FF6B6B" />
            <Text className="font-sscregular text-secondary ml-1">
              {problem.submissionCount}
            </Text>
          </View>
        </View>

        <Text className="font-sscsemibold text-lg text-secondary mb-2 leading-6">
          {problem.title}
        </Text>

        <View className="flex-row justify-between items-center mt-2">
          <View className="flex-row items-center">
            <FontAwesome5 name="users" size={14} color="#6C757D" />
            <Text className="font-sscregular text-gray-600 ml-1 text-sm">
              {problem.acceptedCount || 0} solved
            </Text>
          </View>
          <View className="flex-row items-center">
            <FontAwesome5 name="chart-line" size={14} color="#28A745" />
            <Text className="font-sscregular text-green ml-1 text-sm">
              {problem.acceptanceRate || 0}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TrendingItem;
