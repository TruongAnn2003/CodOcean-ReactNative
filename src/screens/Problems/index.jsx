import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { PROBLEM_DIFFICULTY, PROBLEM_STATUS } from "../../constants";
import { setError } from "../../services/redux-toolkit/reducers/messageSlice";
import {
  getProblems,
  getTopics,
  getTrending,
  setFilters,
  getProblemById,
} from "../../services/redux-toolkit/reducers/problemSlice";

import ProblemList from "../../components/ProblemList";
import SelectInput from "../../components/SelectInput";
import TopicBar from "../../components/TopicBar";
import TrendingProblems from "../../components/TrendingProblems";
import { formatString } from "../../utils/formatting";
import { FILTER_DEFAULT } from "../../constants";

const Problems = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const scrollViewRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { problems, filters, isLoading, totalPage, topics, error } =
    useSelector((state) => state.problem);

  const fetchTopics = async () => {
    try {
      const resultAction = await dispatch(getTopics());
      if (getTopics.rejected.match(resultAction))
        await dispatch(
          setError(`${t("features.problem.getTopics.failure")}: ${resultAction.error.message}`)
        );
    } catch (e) {
      dispatch(
        setError(`${t("features.problem.getTopics.failure")}: ${e.message}`)
      );
    }
  };

  const fetchProblems = async () => {
    try {
      const resultAction = await dispatch(getProblems(filters));
      if (getProblems.rejected.match(resultAction))
        await dispatch(
          setError(`${t("features.problem.getProblems.failure")}: ${error}`)
        );
      else {
        // Scroll to top after loading new problems
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      }
    } catch (e) {
      dispatch(
        setError(`${t("features.problem.getProblems.failure")}: ${e.message}`)
      );
    }
  };

  const fetchTrending = async () => {
    try {
      const resultAction = await dispatch(getTrending(10));
      if (getTrending.rejected.match(resultAction))
        await dispatch(
          setError(`${t("features.problem.getTrending.failure")}: ${error}`)
        );
    } catch (e) {
      dispatch(
        setError(`${t("features.problem.getTrending.failure")}: ${e.message}`)
      );
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchTrending();
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [filters]);

  const updateFilters = async (newFilters) => {
    await dispatch(setFilters({ newFilters }));
  };

  const handleFilterChange = async (name, value) => {
    await updateFilters({ ...filters, [name]: value, pageNumber: 0 });
  };

  const handleRemoveStatusFilter = (status) => {
    let removedStatus = {};
    const entry = Object.entries(filters).find(([key, value]) => value === status);

    if (entry && entry[0] === 'searchTerm') {
      removedStatus = { searchTerm: '' };
    } else {
      removedStatus[entry[0]] = 'ALL';
    }
    const newFilters = { ...filters, ...removedStatus };
    dispatch(setFilters({ newFilters }));
  };

  const handleClearFilters = () => {
    const newFilters = {
      ...FILTER_DEFAULT,
      pageNumber: 0
    };
    dispatch(setFilters({ newFilters }));
    setSearchTerm("");
  };

  const loadMoreProblems = async () => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    await updateFilters({
      ...filters,
      pageNumber:
        filters.pageNumber >= totalPage - 1 ? 0 : filters.pageNumber + 1,
    });
    setIsLoadingMore(false);
  };

  const handleScroll = async (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isCloseToBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;

    if (isCloseToBottom && !isLoading && !isLoadingMore) {
      await loadMoreProblems();
    }
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
        <Text className="text-pink font-sscsemibold">
          {error?.message || "An error occurred"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 p-4"
      contentContainerStyle={{ paddingBottom: 20 }}
      onScroll={handleScroll}
      scrollEventThrottle={16}
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
        {filters && (
          <View className="mb-4">
            <View className="flex-row flex-wrap">
              {['status', 'difficulty', 'topic', 'searchTerm'].map(key => {
                const value = filters[key];
                if (
                  value &&
                  value !== "all" &&
                  value !== "ALL" &&
                  value !== "All" &&
                  value !== ""
                ) {
                  return (
                    <View
                      key={value}
                      className="flex-row items-center bg-blue-50 rounded-full px-3 py-1.5 mr-2 mb-2"
                    >
                      <Text className="text-secondary font-sscregular mr-2">
                        {value}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveStatusFilter(value)}
                        className="p-1"
                      >
                        <FontAwesome name="times" size={16} color="#024873" />
                      </TouchableOpacity>
                    </View>
                  );
                }
                return null;
              })}
            </View>

            {['status', 'difficulty', 'topic', 'searchTerm'].some(key => {
              const value = filters[key];
              return value && value !== 'all' && value !== 'ALL' && value !== '';
            }) && (
              <TouchableOpacity
                onPress={handleClearFilters}
                className="bg-secondary py-2 px-4 rounded-full self-start mt-2"
              >
                <Text className="text-white font-sscsemibold">
                  Clear All Filters
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

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

      <TrendingProblems />
      <ProblemList onScroll={handleScroll} />
    </ScrollView>
  );
};

export default Problems;