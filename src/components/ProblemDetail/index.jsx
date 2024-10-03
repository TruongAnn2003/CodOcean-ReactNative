import React from "react";
import { View, Text } from "react-native";

const ProblemDetail = ({ route }) => {
  const { problem } = route.params;
  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-sscbold text-secondary-100 mb-2">
        {problem.name}
      </Text>
      <Text className="text-base font-sscsemibold text-secondary mb-4">
        {problem.description}
      </Text>

      <View className="mb-4">
        <Text className="text-lg font-sscsemibold text-secondary-100">
          Difficulty:{" "}
          <Text className="text-secondary ">{problem.difficultyLevel}</Text>
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-lg font-sscsemibold text-secondary-100">
          Points: <Text className="text-secondary">{problem.point}</Text>
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-lg font-sscsemibold text-secondary-100">
          Accepted Submissions:{" "}
          <Text className="text-secondary">{problem.acceptedCount}</Text>
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-lg font-sscsemibold text-secondary-100">
          Total Submissions:{" "}
          <Text className="text-secondary">{problem.submissionCount}</Text>
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-lg font-sscsemibold text-secondary-100">
          Acceptance Rate:{" "}
          <Text className="text-green">{problem.acceptanceRate}%</Text>
        </Text>
      </View>

      {problem.type && (
        <View className="mb-4">
          <Text className="text-lg font-sscsemibold text-secondary-100">
            Type: <Text className="text-secondary">{problem.type}</Text>
          </Text>
        </View>
      )}

      {problem.deleted && (
        <View className="mb-4">
          <Text className="text-lg font-sscsemibold text-pink">
            This problem has been deleted.
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProblemDetail;
