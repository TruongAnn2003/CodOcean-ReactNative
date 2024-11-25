import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Chip, Button } from "react-native-elements";
import PropTypes from "prop-types";
import { setFilters } from "../../services/redux-toolkit/reducers/discussionSlice";

const FilterStatus = ()=> {
  const { filters } = useSelector((state) => state.discussion);
  const [statusFilters, setStatusFilters] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const { category, searchTerm } = filters;
    setStatusFilters(
      [category, searchTerm].filter(
        (i) => i && i !== "all" && i !== "ALL" && i !== "All" && i !== ""
      )
    );
  }, [filters]);

  const handleClearFilters = () => {
    const newFilters = {
      pageNumber: 0,
      limit: 10,
      searchTerm: "",
      category: "",
    };
    dispatch(setFilters({ newFilters }));
    setStatusFilters([]);
  };

  const handleRemoveStatusFilter = (status) => {
    let removedStatus = {};
    const entry = Object.entries(filters).find(
      ([key, value]) => value === status
    );

    if (entry && entry[0] === "searchTerm") {
      removedStatus = { searchTerm: "" };
    } else {
      removedStatus[entry[0]] = "ALL";
    }
    const newFilters = { ...filters, ...removedStatus };

    dispatch(setFilters({ newFilters }));
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
      {statusFilters.map((status, index) => (
        <Chip
          key={index}
          title={typeof status === "string" ? status.toLowerCase() : ""}
          icon={<Icon name="close" size={18} color="white" />}
          onPress={() => handleRemoveStatusFilter(status)}
          containerStyle={{ marginRight: 8, marginBottom: 8 }}
          buttonStyle={{
            backgroundColor: "#007bff", // Button color
            borderRadius: 20, // Rounded corners
          }}
          iconRight
        />
      ))}

      {statusFilters.length > 0 && (
        <Button
          title="Clear All Filters"
          onPress={handleClearFilters}
          containerStyle={{ marginTop: 8 }}
          buttonStyle={{
            backgroundColor: "#f44336", // Red color
            borderRadius: 20, // Rounded corners
          }}
        />
      )}
    </View>
  );
}
export default React.memo(FilterStatus);
