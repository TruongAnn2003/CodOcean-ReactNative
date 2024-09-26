import React from "react";
import { FlatList, View } from "react-native";
import ProblemItem from "./ProblemItem"; 

const ProblemList = ({ problems }) => {
  const renderItem = ({ item }) => <ProblemItem problem={item} />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={problems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default ProblemList;
