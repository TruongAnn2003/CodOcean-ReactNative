import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { PROBLEM_STATUS, PROBLEM_DIFFICULTY } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { getProblemById } from "../../services/redux-toolkit/reducers/problemSlice";
import { setError } from "../../services/redux-toolkit/reducers/errorSlice";
import { useTranslation } from "react-i18next";
const ProblemItem = ({ problem, index }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const difficultyStyleColor = () => {
    switch (problem.difficulty) {
      case PROBLEM_DIFFICULTY[1]:
        return "font-sscregular text-green bg-white";
      case PROBLEM_DIFFICULTY[2]:
        return "font-sscregular text-yellow bg-white";
      case PROBLEM_DIFFICULTY[3]:
        return "font-sscregular text-pink bg-white";
      default:
        return "font-sscregular text-gray bg-white";
    }
  };

  const handlePress = async () => {
    try {
      const resultAction = await dispatch(getProblemById(problem.id));
      if (getAllSolvedProblems.rejected.match(resultAction))
        await dispatch(
          setError(
            `${t("features.collapsibles.getProblemById.failure")}: ${error}`
          )
        );
    } catch (e) {
      dispatch(
        setError(
          `${t("features.collapsibles.getProblemById.failure")}: ${e.message}`
        )
      );
    }
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="bg-white p-4 rounded-lg mb-2 shadow flex-row items-center">
        <Image
          source={{
            uri: `https://picsum.photos/id/${index + 100}/200/300`,
          }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 10,
            marginRight: 10,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text className="font-sscsemibold text-lg text-secondary mb-2">
            {problem.title}
          </Text>
          <View className="flex-row justify-between mb-1">
            <Text className="font-sscsemibold text-secondary">Difficulty:</Text>
            <Text className={difficultyStyleColor()}>{problem.difficulty}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="font-sscsemibold text-secondary">Status:</Text>
            <Text className="font-sscregular text-gray-800">
              {problem.status}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="font-sscsemibold text-secondary">
              Accepted Count:
            </Text>
            <Text className="font-sscregular text-gray-800">
              {problem.acceptedCount}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="font-sscsemibold text-secondary">
              Submission Count:
            </Text>
            <Text className="font-sscregular text-gray-800">
              {problem.submissionCount}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="font-sscsemibold text-secondary">
              Acceptance Rate:
            </Text>
            <Text className="font-sscregular text-gray-800">
              {problem.acceptanceRate}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProblemItem;
