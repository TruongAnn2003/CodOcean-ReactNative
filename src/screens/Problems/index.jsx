import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  FILTER_DEFAULT,
  PROBLEM_STATUS,
  PROBLEM_DIFFICULTY,
} from "../../constants";
import {
  setFilters,
  getProblems,
  getTopics,
  getTrending,
  getDataStatistics,
} from "../../services/redux-toolkit/reducers/problemSlice";
import { setError } from "../../services/redux-toolkit/reducers/errorSlice";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import ProblemList from "../../components/ProblemList";
import TopicBar from "../../components/TopicBar";
import SelectInput from "../../components/SelectInput";
import TrendingProblems from "../../components/TrendingProblems";
import Icon from "react-native-vector-icons/Feather";
import { formatString } from "../../utils/formatting";

const Problems = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    problems,
    filters,
    isLoading,
    totalPage,
    topics,
    trendingProblems,
    error,
  } = useSelector((state) => state.problem);

  const fetchTopics = async () => {
    try {
      const resultAction = await dispatch(getTopics());
      if (getTopics.rejected.match(resultAction))
        await dispatch(
          setError(`${t("features.collapsibles.getTopics.failure")}: ${error}`)
        );
    } catch (e) {
      dispatch(
        setError(
          `${t("features.collapsibles.getTopics.failure")}: ${e.message}`
        )
      );
    }
  };

  const fetchProblems = async () => {
    try {
      const resultAction = await dispatch(getProblems(filters));
      if (getProblems.rejected.match(resultAction))
        await dispatch(
          setError(
            `${t("features.collapsibles.getProblems.failure")}: ${error}`
          )
        );
    } catch (e) {
      dispatch(
        setError(
          `${t("features.collapsibles.getProblems.failure")}: ${e.message}`
        )
      );
    }
  };

  const fetchTrendingProblems = async () => {
    try {
      const resultAction = await dispatch(getTrending());
      if (getTrending.rejected.match(resultAction))
        await dispatch(
          setError(
            `${t("features.collapsibles.getTrending.failure")}: ${error}`
          )
        );
    } catch (e) {
      dispatch(
        setError(
          `${t("features.collapsibles.getTrending.failure")}: ${e.message}`
        )
      );
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchTrendingProblems();
  }, []);

  useEffect(() => {
    fetchProblems(); // Fetch problems with updated filters
  }, [filters]);

  const loadMoreProblems = () => {
    updateFilters({
      ...filters,
      pageNumber:
        filters.pageNumber === totalPage ? totalPage : filters.pageNumber + 1,
    });
  };

  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (scrollY + layoutHeight >= contentHeight - 50 && !isLoading) {
      loadMoreProblems();
    }
  };

  const updateFilters = (newFilters) => {
    dispatch(setFilters({ newFilters })); // Update filters
  };

  const handleFilterChange = (name, value) => {
    updateFilters({ ...filters, [name]: value, pageNumber: 0 });
  };

  if (isLoading && problems.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#048cbf" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-pink">
          {error?.message || "An error occurred"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 p-4"
      contentContainerStyle={{ paddingBottom: 20 }}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      ref={scrollViewRef}
    >
      <View className="mb-4 bg-gray-50 rounded-lg p-4 shadow-md">
        <TopicBar
          topics={topics}
          onSelect={(value) => handleFilterChange("topic", value)}
        />
        <View className="flex-row items-center bg-white rounded-full border border-gray-300 p-2 mb-4">
          <TextInput
            placeholder="Search problems"
            value={searchTerm}
            onChangeText={setSearchTerm}
            className="flex-1 text-base font-sscregular px-4 text-gray-700"
            placeholderTextColor="gray"
          />
          <TouchableOpacity
            onPress={() => handleFilterChange("searchTerm", searchTerm)}
            className="bg-white rounded-full p-2 justify-center items-center"
          >
            <Icon name="search" size={18} color="#024873" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Text className="text-secondary font-sscsemibold mb-2">
              Status: {formatString(filters.status)}
            </Text>
            <SelectInput
              options={PROBLEM_STATUS.map((status) => ({
                name: formatString(status),
                value: status,
              }))}
              onSelect={(value) => handleFilterChange("status", value)}
            />
          </View>

          <View className="flex-1 ml-2">
            <Text className="text-secondary font-sscsemibold mb-2">
              Difficulty: {formatString(filters.difficulty)}
            </Text>
            <SelectInput
              options={PROBLEM_DIFFICULTY.map((difficulty) => ({
                name: formatString(difficulty),
                value: difficulty,
              }))}
              onSelect={(value) => handleFilterChange("difficulty", value)}
            />
          </View>
        </View>
      </View>
      <TrendingProblems></TrendingProblems>
      <ProblemList problems={problems} isloading={isLoading} />
    </ScrollView>
  );
};

export default Problems;
