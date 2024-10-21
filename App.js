import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GlobalProvider from "./src/services/providers/GlobalProvider";
import { useFonts } from "expo-font";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, error] = useFonts({
    "SairaSemiCondensed-Black": require("./assets/fonts/SairaSemiCondensed-Black.ttf"),
    "SairaSemiCondensed-Bold": require("./assets/fonts/SairaSemiCondensed-Bold.ttf"),
    "SairaSemiCondensed-ExtraBold": require("./assets/fonts/SairaSemiCondensed-ExtraBold.ttf"),
    "SairaSemiCondensed-ExtraLight": require("./assets/fonts/SairaSemiCondensed-ExtraLight.ttf"),
    "SairaSemiCondensed-Light": require("./assets/fonts/SairaSemiCondensed-Light.ttf"),
    "SairaSemiCondensed-Medium": require("./assets/fonts/SairaSemiCondensed-Medium.ttf"),
    "SairaSemiCondensed-Regular": require("./assets/fonts/SairaSemiCondensed-Regular.ttf"),
    "SairaSemiCondensed-SemiBold": require("./assets/fonts/SairaSemiCondensed-SemiBold.ttf"),
    "SairaSemiCondensed-Thin": require("./assets/fonts/SairaSemiCondensed-Thin.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    console.error(error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading fonts.</Text>
      </View>
    );
  }

  return (
    <GlobalProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </GlobalProvider>
  );
}
