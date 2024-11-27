import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { PROBLEM_STATUS, PROBLEM_DIFFICULTY } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getProblemById } from "../../services/redux-toolkit/reducers/problemSlice";
import { setError } from "../../services/redux-toolkit/reducers/messageSlice";
import { useTranslation } from "react-i18next";
import { FontAwesome } from "@expo/vector-icons";

const ProblemItem = ({ problem, index }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.problem);
  const { t } = useTranslation();

  const difficultyStyleColor = () => {
    switch (problem.difficulty) {
      case PROBLEM_DIFFICULTY[1]:
        return "font-sscregular text-green";
      case PROBLEM_DIFFICULTY[2]:
        return "font-sscregular text-yellow";
      case PROBLEM_DIFFICULTY[3]:
        return "font-sscregular text-pink";
      default:
        return "font-sscregular text-gray";
    }
  };

  const handlePress = async () => {
    try {
      const resultAction = await dispatch(getProblemById(problem.id));
      if (getProblemById.fulfilled.match(resultAction)) {
        navigation.navigate('ProblemDetail', { problem: resultAction.payload });
      } else {
        await dispatch(
          setError(`${t("features.problem.getProblemById.failure")}: ${error}`)
        );
      }
    } catch (e) {
      dispatch(
        setError(
          `${t("features.problem.getProblemById.failure")}: ${e.message}`
        )
      );
    }
  };

  const handleForumPress = () => {
    navigation.navigate("Forum", { problemId: problem.id });
  };

  const handleReportPress = () => {
    navigation.navigate("Report", { problemId: problem.id });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="bg-white p-4 rounded-lg mb-3 shadow-lg">
        <View className="flex-row items-center mb-3">
          <Image
            source={{
              uri: `https://picsum.photos/id/${index + 100}/200/300`,
            }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
            className="mr-3"
          />
          <View className="flex-1">
            <Text className="font-sscsemibold text-lg text-secondary">
              {problem.title}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className={`${difficultyStyleColor()} mr-3 px-2 py-1 bg-blue-50 rounded-full`}>
                {problem.difficulty}
              </Text>
              <Text className="font-sscregular text-gray-600 px-2 py-1 bg-green-50 rounded-full">
                {problem.status}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between mb-3 bg-gray-50 p-3 rounded-lg">
          <View className="items-center">
            <Text className="font-sscsemibold text-secondary mb-1">Accepted</Text>
            <Text className="font-sscregular text-gray-800">{problem.acceptedCount}</Text>
          </View>
          <View className="items-center">
            <Text className="font-sscsemibold text-secondary mb-1">Submissions</Text>
            <Text className="font-sscregular text-gray-800">{problem.submissionCount}</Text>
          </View>
          <View className="items-center">
            <Text className="font-sscsemibold text-secondary mb-1">Success Rate</Text>
            <Text className="font-sscregular text-green">{problem.acceptanceRate}%</Text>
          </View>
        </View>

        {/* <View className="flex-row justify-end">
          <TouchableOpacity 
            onPress={handleForumPress}
            className="flex-row items-center mr-4 bg-blue-500 px-3 py-2 rounded-lg"
          >
            <FontAwesome name="comments" size={16} color="white" />
            <Text className="text-white ml-2 font-sscsemibold">Forum</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleReportPress}
            className="flex-row items-center bg-red-500 px-3 py-2 rounded-lg"
          >
            <FontAwesome name="flag" size={16} color="white" />
            <Text className="text-white ml-2 font-sscsemibold">Report</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

export default ProblemItem;
