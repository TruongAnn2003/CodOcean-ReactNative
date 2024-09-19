import React from "react";
import { View, TouchableOpacity, Alert, Text } from "react-native";
import { images as Imgs } from "../../constants";
import CustomButton from "../../components/CustomButtons";
export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <Imgs.LogoBg></Imgs.LogoBg>
      <Imgs.WelcomeFrame></Imgs.WelcomeFrame>
      <CustomButton
        title="Continue"
        style="bg-greenblue"
        textStyle="text-white"
        onPress={() => Alert.alert("Continue Pressed!")}
      />
    </View>
  );
}
