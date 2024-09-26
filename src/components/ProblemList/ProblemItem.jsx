import React from "react";
import { View, Text } from "react-native";

const ProblemItem = ({ problem }) => {
  return (
    <View style={"bg-white p-4 rounded-lg mb-2 shadow"}>
      <Text style={"text-lg font-bold text-gray-800 mb-2"}>
        {problem.title}
      </Text>
      <View style={"flex-row justify-between mb-1"}>
        <Text style={"font-semibold text-gray-600"}>Difficulty:</Text>
        <Text
          style={["font-normal text-gray-800", styles[problem.difficulty]]}
        >
          {problem.difficulty}
        </Text>
      </View>
      <View style={"flex-row justify-between mb-1"}>
        <Text style={"font-semibold text-gray-600"}>Status:</Text>
        <Text style={"font-normal text-gray-800"}>{problem.status}</Text>
      </View>
      <View style={"flex-row justify-between mb-1"}>
        <Text style={"font-semibold text-gray-600"}>Accepted Count:</Text>
        <Text style={"font-normal text-gray-800"}>
          {problem.acceptedCount}
        </Text>
      </View>
      <View style={"flex-row justify-between mb-1"}>
        <Text style={"font-semibold text-gray-600"}>Submission Count:</Text>
        <Text style={"font-normal text-gray-800"}>
          {problem.submissionCount}
        </Text>
      </View>
      <View style={"flex-row justify-between mb-1"}>
        <Text style={"font-semibold text-gray-600"}>Acceptance Rate:</Text>
        <Text style={"font-normal text-gray-800"}>
          {problem.acceptanceRate}%
        </Text>
      </View>
    </View>
  );
};

// Define styles for difficulty colors
const styles = {
  easy: { color: "green" },
  medium: { color: "orange" },
  hard: { color: "red" },
};

export default ProblemItem;
