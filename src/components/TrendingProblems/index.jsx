import React from "react";
import { View, Text, FlatList } from "react-native";
import TrendingItem from "./TrendingItem";
import { getProblemById } from "../../services/api/problem";
import { useNavigation } from "@react-navigation/native";
const TrendingProblems = ({ trendingProblems }) => {
  const navigation = useNavigation();
  const handleSelectItem = async (problem) => {
    try {
      const response = await getProblemById(problem.id);
      console.log(response.data);
      navigation.navigate("ProblemDetail", { problem: response.data });
    } catch (error) {
      console.error("Failed to navigate:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TrendingItem
      problem={item}
      onSelect={(problem) => handleSelectItem(problem)}
    />
  );

  return (
    <View className="bg-gray-50 rounded-lg p-4 mb-4 shadow-md">
      <Text className={"text-lg font-sscbold text-secondary mb-4"}>
        Trending Problems
      </Text>
      <FlatList
        data={trendingProblems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={"px-2"}
      />
    </View>
  );
};

export default TrendingProblems;
