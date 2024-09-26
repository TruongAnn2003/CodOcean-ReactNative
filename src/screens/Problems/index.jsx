import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  getProblems,
  getAllTopics,
  getTrendingProblemsByTopic,
  getTrendingProblems,
} from "../../services/api/problem";
import * as _const from "../../utils/_const";
import * as _helpers from "../../utils/_helpers";
import * as _formatting from "../../utils/_formatting";
import ProblemList from "../../components/ProblemList";
import TopicBar from "../../components/TopicBar";
import SelectInput from "../../components/SelectInput";
import { useGlobalContext } from "../../services/providers";
const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [trendingProblems, setTrendingProblems] = useState([]);
  const { loading, setLoading, error, setError } = useGlobalContext();
  const [filter, setFilter] = useState({
    pageNumber: 0,
    limit: 10,
    status: "",
    difficulty: "",
    topic: "",
    searchTerm: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTopics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllTopics();
      if (response.status === _const.RESPONSE_STATUS.Ok) {
        setTopics(response.data);
        // _helpers.log("fetchTopics-data", response.data);
      } else {
        Alert.alert("Error", "Failed to fetch topics.");
      }
    } catch (err) {
      console.error("Error fetching topics:", err);
      setError(err.message || "An error occurred while fetching topics.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingProblems = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getTrendingProblems();
      if (response.status === _const.RESPONSE_STATUS.Ok) {
        setTrendingProblems(response.data);
        // _helpers.log("fetchTrendingProblems-data", response.data);
      } else {
        Alert.alert("Error", "Failed to fetch trending problems.");
      }
    } catch (err) {
      console.error("Error fetching trending problems:", err);
      setError(
        err.message || "An error occurred while fetching trending problems."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProblems = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProblems(filter);
      if (response.status === _const.RESPONSE_STATUS.Ok) {
        setProblems(response.data.problemDTOs);
      } else {
        Alert.alert("Error", "Failed to fetch problems.");
      }
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError(err.message || "An error occurred while fetching problems.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchTrendingProblems();
  }, []);

  useEffect(() => {
    _helpers.log("fetchProblems-filter", filter);
    fetchProblems();
  }, [filter]);

  const handleFilterChange = (name, value) => {
    setFilter({ ...filter, [name]: value });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <View className="mb-4">
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
            <Text className="text-white text-lg font-sscsemibold">🔍</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Text className="text-gray-700 font-semibold mb-2">
              Status: {_formatting.formatString(filter.status)}
            </Text>
            <SelectInput
              options={_const.PROBLEM_STATUS.map((status) => ({
                name: _formatting.formatString(status),
                value: status,
              }))}
              onSelect={(value) => handleFilterChange("status", value)}
            />
          </View>

          <View className="flex-1 ml-2">
            <Text className="text-gray-700 font-semibold mb-2">
              Difficulty: {_formatting.formatString(filter.difficulty)}
            </Text>
            <SelectInput
              options={_const.PROBLEM_DIFFICULTY.map((difficulty) => ({
                name: _formatting.formatString(difficulty),
                value: difficulty,
              }))}
              onSelect={(value) => handleFilterChange("difficulty", value)}
            />
          </View>
        </View>
      </View>
      <ProblemList problems={problems} />
    </View>
  );
};

export default Problems;
