import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import ProblemItem from "./ProblemItem"; // Import component ProblemItem

import { useSelector } from "react-redux";
const ProblemList = ({ problems, isloading }) => {
  // const { problems, isloading } = useSelector((state) => state.problem);
  return (
    <View className="flex-1 bg-gray-50 rounded-lg p-4 shadow-md">
      <Text className={"text-lg font-sscbold text-secondary mb-4"}>
        Problems
      </Text>

      {problems.map((problem, index) => (
        <ProblemItem key={index} problem={problem} index={index} />
      ))}

      {isloading && (
        <View className="flex items-center">
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

export default ProblemList;
