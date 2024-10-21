import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import PieChart from "../../../components/Charts/PieChart";
import LineChart from "../../../components/Charts/LineChart";
import { getDataStatistics } from "../../../services/api/user";
import { useGlobalContext } from "../../../services/providers";
const Statistics = () => {
  const [dataStatistics, setDataStatistics] = useState({
    totalEasy: 0,
    totalNormal: 0,
    totalHard: 0,
    easy: [0, 0, 0, 0, 0, 0, 0],
    normal: [0, 0, 0, 0, 0, 0, 0],
    hard: [0, 0, 0, 0, 0, 0, 0],
  });
  const { loading, setLoading, error, setError } = useGlobalContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDataStatistics();
        setDataStatistics(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#024873" />; // Show loading indicator
  }

  if (error) {
    return <Text style={{ color: "red" }}>Error: {error}</Text>; // Show error message if there's an error
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="mb-4 bg-gray-50 rounded-lg p-4 shadow-md">
        <PieChart
          data={[
            {
              name: "Easy",
              population: dataStatistics.totalEasy,
              color: "#00B485",
              legendFontColor: "#024873",
              legendFontSize: 15,
            },
            {
              name: "Normal",
              population: dataStatistics.totalNormal,
              color: "#FBD601",
              legendFontColor: "#024873",
              legendFontSize: 15,
            },
            {
              name: "Hard",
              population: dataStatistics.totalHard,
              color: "#DC4C67",
              legendFontColor: "#024873",
              legendFontSize: 15,
            },
          ]}
          title={"Problem Difficulty Distribution"}
        />
      </View>
      <View className="mb-4 bg-gray-50 rounded-lg p-4 shadow-md">
        <LineChart
          data={{
            labels: [
              "Day 1",
              "Day 2",
              "Day 3",
              "Day 4",
              "Day 5",
              "Day 6",
              "Day 7",
            ],
            datasets: [
              {
                data: dataStatistics.easy,
                color: () => "#00B485",
                strokeWidth: 2,
                label: "Easy",
              },
              {
                data: dataStatistics.normal,
                color: () => "#FBD601",
                strokeWidth: 2,
                label: "Normal",
              },
              {
                data: dataStatistics.hard,
                color: () => "#DC4C67",
                strokeWidth: 2,
                label: "Hard",
              },
            ],
          }}
          title={"Weekly Problem Distribution"}
        />
      </View>
    </View>
  );
};

export default Statistics;
