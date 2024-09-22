import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GlobalProvider from "./src/services/providers/GlobalProvider";
import Home from "./src/screens/Home";
import {
  Login,
  ActiveAccount,
  Register,
  ForgotPassword,
} from "./src/screens/Auth";
import Problems from "./src/screens/Problems";
import Profile from "./src/screens/Profile";
import { useFonts } from "expo-font";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, error] = useFonts({
    "SSC-Black": require("./assets/fonts/SairaSemiCondensed-Black.ttf"),
    "SSC-Bold": require("./assets/fonts/SairaSemiCondensed-Bold.ttf"),
    "SSC-ExtraBold": require("./assets/fonts/SairaSemiCondensed-ExtraBold.ttf"),
    "SSC-ExtraLight": require("./assets/fonts/SairaSemiCondensed-ExtraLight.ttf"),
    "SSC-Light": require("./assets/fonts/SairaSemiCondensed-Light.ttf"),
    "SSC-Medium": require("./assets/fonts/SairaSemiCondensed-Medium.ttf"),
    "SSC-Regular": require("./assets/fonts/SairaSemiCondensed-Regular.ttf"),
    "SSC-SemiBold": require("./assets/fonts/SairaSemiCondensed-SemiBold.ttf"),
    "SSC-Thin": require("./assets/fonts/SairaSemiCondensed-Thin.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ActiveAccount"
            component={ActiveAccount}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Problems" component={Problems} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
}
