import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const CustomButton = ({
  title = "Button",
  onPress,
  style = "",
  textStyle = "",
}) => {
  return (
    <TouchableOpacity
      className={`rounded-xl bg-white px-8 pb-3 pt-3 shadow-lg ${style}`}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text
        className={`text-x font-medium uppercase text-white text-center ${textStyle}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
