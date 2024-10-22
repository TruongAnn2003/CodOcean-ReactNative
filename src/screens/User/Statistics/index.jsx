import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PieChart from "../../../components/Charts/PieChart";
import LineChart from "../../../components/Charts/LineChart";
import { getDataStatistics } from "../../../services/redux-toolkit/reducers/problemSlice";
import { setError } from "../../../services/redux-toolkit/reducers/errorSlice";
const Statistics = () => {
  const { isloading, error, statisticsDatasets } = useSelector(
    (state) => state.problem
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultAction = await dispatch(getDataStatistics());
        if (getDataStatistics.rejected.match(resultAction)) {
          await dispatch(
            setError(
              `${t("features.collapsibles.getStatistics.failure")} (${error})`
            )
          );
        }
      } catch (e) {
        await dispatch(
          setError(
            `${t("features.collapsibles.getStatistics.failure")} (${e.message})`
          )
        );
      }
    };

    fetchData();
  }, []);

  if (isloading) {
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
              population: statisticsDatasets.totalEasy,
              color: "#00B485",
              legendFontColor: "#024873",
              legendFontSize: 15,
            },
            {
              name: "Normal",
              population: statisticsDatasets.totalNormal,
              color: "#FBD601",
              legendFontColor: "#024873",
              legendFontSize: 15,
            },
            {
              name: "Hard",
              population: statisticsDatasets.totalHard,
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
                data: statisticsDatasets.easy,
                color: () => "#00B485",
                strokeWidth: 2,
                label: "Easy",
              },
              {
                data: statisticsDatasets.normal,
                color: () => "#FBD601",
                strokeWidth: 2,
                label: "Normal",
              },
              {
                data: statisticsDatasets.hard,
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
