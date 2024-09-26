import React from "react";
import { View, Text } from "react-native";
import * as _const from "../../utils/_const";

const ProblemItem = ({ problem }) => {
  const difficultyStyleColor = () => {
    switch (problem.difficulty) {
      case _const.PROBLEM_DIFFICULTY[1]:
        return "font-sscregular text-green bg-white";
      case _const.PROBLEM_DIFFICULTY[2]:
        return "font-sscregular text-yellow bg-white";
      case _const.PROBLEM_DIFFICULTY[3]:
        return "font-sscregular text-pink bg-white";
      default:
        break;
    }
  };
  return (
    <View className={"bg-white p-4 rounded-lg mb-2 shadow"}>
      <Text className="font-sscsemibold text-lg text-primary mb-2">
        {problem.title}
      </Text>
      <View className={"flex-row justify-between mb-1"}>
        <Text className={"font-sscsemibold text-primary"}>Difficulty:</Text>
        <Text className={difficultyStyleColor()}>{problem.difficulty}</Text>
      </View>
      <View className={"flex-row justify-between mb-1"}>
        <Text className={"font-sscsemibold text-primary"}>Status:</Text>
        <Text className={"font-sscregular text-gray-800"}>
          {problem.status}
        </Text>
      </View>
      <View className={"flex-row justify-between mb-1"}>
        <Text className={"font-sscsemibold text-primary"}>Accepted Count:</Text>
        <Text className={"font-sscregular text-gray-800"}>
          {problem.acceptedCount}
        </Text>
      </View>
      <View className={"flex-row justify-between mb-1"}>
        <Text className={"font-sscsemibold text-primary"}>
          Submission Count:
        </Text>
        <Text className={"font-sscregular text-gray-800"}>
          {problem.submissionCount}
        </Text>
      </View>
      <View className={"flex-row justify-between mb-1"}>
        <Text className={"font-sscsemibold text-primary"}>
          Acceptance Rate:
        </Text>
        <Text className={"font-sscregular text-gray-800"}>
          {problem.acceptanceRate}%
        </Text>
      </View>
    </View>
  );
};

// Define classNames for difficulty colors

export default ProblemItem;
