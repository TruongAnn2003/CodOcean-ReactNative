// src/components/FilterStatus.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

export function FilterStatus ({ onRemoveFilter }) {
  const { filters } = useSelector((state) => state.searchDiscussion);
  const [statusFilters, setStatusFilters] = useState([]);

  useEffect(() => {
    const { category, searchTerm } = filters;
    setStatusFilters(
      [category, searchTerm].filter(
        (i) => i && i !== "all" && i !== "ALL" && i !== ""
      )
    );
  }, [filters]);

  return (
    <View style={styles.container}>
      {statusFilters.map((status, index) => (
        <View style={styles.item} key={index}>
          <Text>{typeof status === "string" ? status.toLowerCase() : ""}</Text>
          <TouchableOpacity onPress={() => onRemoveFilter(status)}>
            <Text style={styles.closeButton}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

FilterStatus.propTypes = {
  onRemoveFilter: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    padding: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  closeButton: {
    marginLeft: 4,
    color: "red",
  },
});


