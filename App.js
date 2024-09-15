import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import GlobalProvider from "./src/context/GlobalProvider";
export default function App() {
  return (
    <GlobalProvider>
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Wellcom to CodOcean!</Text>
      </View>
    </GlobalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
