import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Dimensions,ScrollView } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import {
  getAllSolvedProblems,
  getAllUploadedProblems,
} from "../../../services/api/problem";
import ProblemList from "../../../components/ProblemList";

const UploadedProblemsRoute = ({ problems, loading }) => {
  return (
    <ScrollView className="flex-1 p-4">
      {loading ? (
        <ActivityIndicator size="large" color="#024873" />
      ) : (
        <ProblemList problems={problems} loading={loading} />
      )}
    </ScrollView>
  );
};

const SolvedProblemsRoute = ({ problems, loading }) => {
  return (
    <ScrollView className="flex-1 p-4">
      {loading ? (
        <ActivityIndicator size="large" color="#024873" />
      ) : (
        <ProblemList problems={problems} loading={loading} />
      )}
    </ScrollView>
  );
};

const MyProblems = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "uploaded", title: "Uploaded" },
    { key: "solved", title: "Solved" },
  ]);

  const [solvedProblems, setSolvedProblems] = useState([]);
  const [uploadedProblems, setUploadedProblems] = useState([]);
  const [loadingSolved, setLoadingSolved] = useState(true);
  const [loadingUploaded, setLoadingUploaded] = useState(true);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const response = await getAllSolvedProblems();
        setSolvedProblems(response.data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      } finally {
        setLoadingSolved(false);
      }
    };

    const fetchUploadedProblems = async () => {
      try {
        const response = await getAllUploadedProblems();
        setUploadedProblems(response.data);
      } catch (error) {
        console.error("Error fetching uploaded problems:", error);
      } finally {
        setLoadingUploaded(false);
      }
    };

    fetchSolvedProblems();
    fetchUploadedProblems();
  }, []);

  const renderScene = SceneMap({
    uploaded: () => (
      <UploadedProblemsRoute
        problems={uploadedProblems}
        loading={loadingUploaded}
      />
    ),
    solved: () => (
      <SolvedProblemsRoute problems={solvedProblems} loading={loadingSolved} />
    ),
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get("window").width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          style={{ backgroundColor: "#fff" }}
          labelStyle={{ color: "#024873" }}
          indicatorStyle={{ backgroundColor: "#024873" }}
        />
      )}
    />
  );
};

export default MyProblems;
