import React, { useEffect } from "react";
import { View, SafeAreaView, StatusBar, Image } from "react-native";
import { LogoBgWhite, WelcomeFrame } from "../../constants/images";
import { aminations } from "../../constants";
import LottieView from "lottie-react-native";
export default function Home({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("SignIn");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-secondary">
      <StatusBar hidden={true} />
      <LogoBgWhite />
      <WelcomeFrame  />
      <LottieView
        source={aminations.Loading}
        style={{ width: "25%", height: "25%" }}
        autoPlay
        loop
      />
    </SafeAreaView>
  );
}
