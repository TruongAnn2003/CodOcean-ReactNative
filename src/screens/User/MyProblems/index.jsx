import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import {
  getAllSolvedProblems,
  getAllUploadedProblems,
} from "../../../services/redux-toolkit/reducers/profileSlice";
import ProblemList from "../../../components/ProblemList";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

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

  const { solvedProblems, uploadedProblems, isLoading, error } = useSelector(
    (state) => state.profile
  );

  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const resultAction = await dispatch(getAllSolvedProblems());
        if (getAllSolvedProblems.rejected.match(resultAction))
          await dispatch(
            setError(
              `${t(
                "features.collapsibles.profile.getAllSolvedProblems.failure"
              )}: ${error}`
            )
          );
      } catch (e) {
        dispatch(
          setError(
            `${t(
              "features.collapsibles.profile.getAllSolvedProblems.failure"
            )}: ${e.message}`
          )
        );
      }
    };

    const fetchUploadedProblems = async () => {
      try {
        const resultAction = await dispatch(getAllUploadedProblems());
        if (getAllUploadedProblems.rejected.match(resultAction))
          await dispatch(
            setError(
              `${t(
                "features.collapsibles.profile.getAllUploadedProblems.failure"
              )}: ${error}`
            )
          );
      } catch (e) {
        dispatch(
          setError(
            `${t(
              "features.collapsibles.profile.getAllUploadedProblems.failure"
            )}: ${e.message}`
          )
        );
      }
    };

    fetchSolvedProblems();
    fetchUploadedProblems();
  }, []);

  const renderScene = SceneMap({
    uploaded: () => (
      <UploadedProblemsRoute problems={uploadedProblems} loading={isLoading} />
    ),
    solved: () => (
      <SolvedProblemsRoute problems={solvedProblems} loading={isLoading} />
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
