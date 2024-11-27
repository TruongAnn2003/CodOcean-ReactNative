import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ProblemDetail = ({ route }) => {
  const { problem } = route.params;
  const navigation = useNavigation();

  const handleForumPress = () => {
    navigation.navigate("Forum", { problemId: problem.id });
  };

  const handleReportPress = () => {
    navigation.navigate("Report", { problemId: problem.id });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-white rounded-lg shadow-lg m-4 p-6">
        <View className="border-b border-gray-200 pb-4 mb-6">
          <Text className="text-2xl font-sscbold text-secondary-100 mb-3">
            {problem.title}
          </Text>
          <Text className="text-base font-sscregular text-gray-600 leading-6">
            {problem.description}
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between bg-blue-50 p-4 rounded-lg mb-6">
          <View className="items-center px-4">
            <Text className="text-sm font-sscsemibold text-gray-500 mb-1">Difficulty</Text>
            <Text className={`font-sscsemibold ${problem.difficultyLevel === 'Hard' ? 'text-pink' : problem.difficultyLevel === 'Medium' ? 'text-yellow' : 'text-green'}`}>
              {problem.difficulty}
            </Text>
          </View>

          <View className="items-center px-4">
            <Text className="text-sm font-sscsemibold text-gray-500 mb-1">Points</Text>
            <Text className="font-sscsemibold text-secondary">{problem.point}</Text>
          </View>

          <View className="items-center px-4">
            <Text className="text-sm font-sscsemibold text-gray-500 mb-1">Type</Text>
            <Text className="font-sscsemibold text-secondary">{problem.type || 'N/A'}</Text>
          </View>
        </View>

        <View className="bg-gray-50 p-4 rounded-lg mb-6">
          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <Text className="text-sm font-sscsemibold text-gray-500 mb-1">Accepted</Text>
              <Text className="font-sscsemibold text-green">{problem.acceptedCount}</Text>
            </View>
            <View className="items-center">
              <Text className="text-sm font-sscsemibold text-gray-500 mb-1">Submissions</Text>
              <Text className="font-sscsemibold text-secondary">{problem.submissionCount}</Text>
            </View>
            <View className="items-center">
              <Text className="text-sm font-sscsemibold text-gray-500 mb-1">Success Rate</Text>
              <Text className="font-sscsemibold text-green">{problem.acceptanceRate}%</Text>
            </View>
          </View>
        </View>

        {problem.deleted && (
          <View className="bg-red-50 p-4 rounded-lg mb-6">
            <Text className="text-center font-sscsemibold text-pink">
              This problem has been deleted.
            </Text>
          </View>
        )}

        <View className="flex-row justify-end">
          <TouchableOpacity 
            onPress={handleForumPress}
            className="flex-row items-center mr-4 bg-blue-500 px-4 py-2 rounded-lg"
          >
            <FontAwesome name="comments" size={16} color="white" />
            <Text className="text-white ml-2 font-sscsemibold">Forum</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleReportPress}
            className="flex-row items-center bg-red-500 px-4 py-2 rounded-lg"
          >
            <FontAwesome name="flag" size={16} color="white" />
            <Text className="text-white ml-2 font-sscsemibold">Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProblemDetail;
