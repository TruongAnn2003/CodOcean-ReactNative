import React, { useContext } from "react";
import { View, TouchableOpacity, Alert, Text } from "react-native";
import { images as Imgs } from "../../constants";
import { aminations as Aminations } from "../../constants";
import CustomButton from "../../components/CustomButtons";
export default function Home({ navigation }) {
  return (
    <View className="flex-1 items-center justify-center bg-secondary-100">
      <Imgs.LogoBg></Imgs.LogoBg>
      <Imgs.WelcomeFrame></Imgs.WelcomeFrame>
      <CustomButton
        title="Continue"
        style="bg-greenblue"
        textStyle="text-white"
        onPress={() =>  navigation.navigate('Login')}
      />
    </View>
  );
}
