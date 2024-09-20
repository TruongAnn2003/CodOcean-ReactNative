import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const CustomButton = ({ title='Button', onPress, style = "", textStyle = "" }) => {
  return (
    <TouchableOpacity
      className={`rounded-full bg-success px-6 pb-2 pt-2.5 shadow-lg ${style}`}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text
        className={`text-xs font-medium uppercase text-white text-center ${textStyle}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
