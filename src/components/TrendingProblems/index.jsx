import React from "react";
import { View, Text, FlatList } from "react-native";
import ProblemItem from "../ProblemList/ProblemItem"; // Ensure you have this component to render individual problems
import TrendingItem from "./TrendingItem";

const TrendingProblems = ({ trendingProblems }) => {
  const renderItem = ({ item }) => (
    <TrendingItem problem={item} onSelect={() => {}} />
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
