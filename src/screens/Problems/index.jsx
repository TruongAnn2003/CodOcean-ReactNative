import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { useGlobalContext } from "../../services/providers";
import { getAllTopics, getProblems } from "../../services/api/problem";
import * as _helpers from "../../utils/_helpers";
const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filter criteria
  const [pageNumber, setPageNumber] = useState(0);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [topic, setTopic] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProblems = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProblems({
        pageNumber: 0,
        limit: 10,
        status: null,
        difficulty: null,
        topic: null,
        searchTerm: "",
      });
      _helpers.log("fetchProblems-response", response);
      if (response.status === 200) {
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
    fetchProblems();
  }, [pageNumber, limit, status, difficulty, topic, searchTerm]);

  const renderItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
      <Text>Difficulty: {item.difficulty}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Accepted Count: {item.acceptedCount}</Text>
      <Text>Submission Count: {item.submissionCount}</Text>
      <Text>Acceptance Rate: {item.acceptanceRate}%</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={{ color: "red" }}>{error}</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View>
        <TextInput
          placeholder="Search problems"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        />
        <Button title="Filter" onPress={fetchProblems} />
      </View>
      <FlatList
        data={problems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default Problems;
