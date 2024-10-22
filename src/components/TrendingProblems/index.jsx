import React from "react";
import { View, Text, FlatList } from "react-native";
import TrendingItem from "./TrendingItem";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { getProblemById } from "../../services/redux-toolkit/reducers/problemSlice";
import { useTranslation } from "react-i18next";
const TrendingProblems = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { trendingProblems, isloading } = useSelector((state) => state.problem);
  const { t } = useTranslation();
  const handleSelectItem = async (problem) => {
    try {
      const resultAction = await dispatch(getProblemById(problem.id));
      if (getProblemById.rejected.match(resultAction))
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

  const renderItem = ({ item }) => (
    <TrendingItem
      problem={item}
      onSelect={(problem) => handleSelectItem(problem)}
    />
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
