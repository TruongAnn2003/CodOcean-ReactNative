import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import ProblemItem from "./ProblemItem";
import { useSelector, useDispatch } from "react-redux";
import { getProblemById } from "../../services/redux-toolkit/reducers/problemSlice";

const ProblemList = ({ onScroll }) => {
  const dispatch = useDispatch();
  const { problems, isLoading } = useSelector((state) => state.problem);

  const handleSelectProblem = async (problem) => {
    try {
      const resultAction = await dispatch(getProblemById(problem.id));
      if (getProblemById.rejected.match(resultAction)) {
        console.error("Failed to get problem details");
      }
    } catch (error) {
      console.error("Error getting problem details:", error);
    }
  };

  return (
    <ScrollView className="flex-1" onScroll={onScroll} scrollEventThrottle={16}>
      <View className="bg-gray-50 rounded-lg p-4 shadow-md">
        <Text className="text-lg font-sscbold text-secondary mb-4">
          Problems
        </Text>

        {problems.map((problem, index) => (
          <ProblemItem
            key={problem.id}
            problem={problem}
            index={index}
            onSelect={() => handleSelectProblem(problem)}
          />
        ))}

        {isLoading && (
          <View className="flex items-center">
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ProblemList;
