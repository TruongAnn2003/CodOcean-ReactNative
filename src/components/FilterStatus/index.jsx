import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { setFilters } from "../../services/redux-toolkit/reducers/discussionSlice";

const FilterStatus = () => {
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

  const handleClearFilters = React.useCallback(() => {
    const newFilters = {
      pageNumber: 0,
      limit: 10,
      searchTerm: "",
      category: "",
    };
    dispatch(setFilters({ newFilters }));
    setStatusFilters([]);
  }, [dispatch]);

  const handleRemoveStatusFilter = React.useCallback((status) => {
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
  }, [filters, dispatch]);

  return (
    <View className="mb-4">
      <View className="flex-row flex-wrap">
        {statusFilters.map((status, index) => (
          <View
            key={index}
            className="flex-row items-center bg-blue-50 rounded-full px-3 py-1.5 mr-2 mb-2"
          >
            <Text className="text-secondary font-sscregular mr-2">
              {typeof status === "string" ? status.toLowerCase() : ""}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveStatusFilter(status)}
              className="p-1"
            >
              <FontAwesome name="times" size={16} color="#024873" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {statusFilters.length > 0 && (
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
  );
};

export default React.memo(FilterStatus);
