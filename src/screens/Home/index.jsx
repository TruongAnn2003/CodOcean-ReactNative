import React, { useEffect } from "react";
import { View, SafeAreaView, StatusBar, Text } from "react-native";
import { images as Imgs, aminations } from "../../constants";
import LottieView from "lottie-react-native";
export default function Home({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Login");
    }, 3000); // 3 seconds

    // Clear timeout if the component is unmounted before the timer ends
    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-secondary-100">
      <StatusBar hidden={true} />
      <Imgs.LogoBgWhite></Imgs.LogoBgWhite>
      <Imgs.WelcomeFrame></Imgs.WelcomeFrame>
      <LottieView
        source={aminations.Loading}
        style={{ width: "25%", height: "25%" }}
        autoPlay
        loop
      />
    </SafeAreaView>
  );
}
