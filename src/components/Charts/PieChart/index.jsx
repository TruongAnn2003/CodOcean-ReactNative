import React from "react";
import { View, Text } from "react-native";
import { PieChart as PieChartKit } from "react-native-chart-kit";

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 1, 
  color: (opacity = 1) => `rgba(2, 72, 115, ${opacity})`, 
  labelColor: (opacity = 1) => `rgba(2, 72, 115, ${opacity})`, 
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  propsForLabels: {
    fontFamily: "SairaSemiCondensed-Regular", 
    fontSize: 12, 
  },
  propsForBackgroundLines: {
    strokeDasharray: "",
  },
};

const PieChart = ({ data, title }) => {
  return (
    <View>
      <Text style={{ textAlign: "center", fontSize: 20, marginBottom: 10 }}>
        {title}
      </Text>
      <PieChartKit
        data={data}
        width={320}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

export default PieChart;
