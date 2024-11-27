import React from "react";
import { View, Text, FlatList } from "react-native";
import TrendingItem from "./TrendingItem";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { getProblemById, setError } from "../../services/redux-toolkit/reducers/problemSlice";
import { useTranslation } from "react-i18next";
import { FontAwesome5 } from "@expo/vector-icons";

const TrendingProblems = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { trendingProblems, isLoading, error } = useSelector((state) => state.problem);
  const { t } = useTranslation();

  const handleSelectItem = async (problem) => {
    try {
      const resultAction = await dispatch(getProblemById(problem.id));
      if (getProblemById.rejected.match(resultAction)) {
        await dispatch(
          setError(
            `${t("features.problem.getProblemById.failure")}: ${error}`
          )
        );
      } else {
        navigation.navigate("ProblemDetail", { problem: resultAction.payload });
      }
    } catch (e) {
      dispatch(
        setError(
          `${t("features.problem.getProblemById.failure")}: ${e.message}`
        )
      );
    }
  };

  const renderItem = ({ item, index }) => (
    <TrendingItem
      problem={item}
      onSelect={handleSelectItem}
      index={index}
    />
  );

  return (
    <View className="bg-gray-50 rounded-lg p-4 mb-4 shadow-md">
      <View className="flex-row items-center mb-4">
        <Text className="text-lg font-sscbold text-secondary mr-2">
          Trending Problems
        </Text>
        <FontAwesome5 name="fire" size={16} color="#FF6B6B" />
      </View>
      <FlatList
        data={trendingProblems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </View>
  );
};

export default TrendingProblems;
