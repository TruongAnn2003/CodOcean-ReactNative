import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Home from "../../screens/Home";
import ProblemDetail from "../../components/ProblemDetail";
import Discussions from "../../screens/Discussions";
import Setting from "../../screens/Setting";

const Stack = createNativeStackNavigator();

// Lazy-loadable screens
const LazyLoadableScreen = (importFunc) => {
  return function LazyScreen({ navigation, route }) {
    const [Component, setComponent] = useState(null);

    useEffect(() => {
      let isMounted = true;
      importFunc().then((module) => {
        if (isMounted) setComponent(() => module.default);
      });
      return () => {
        isMounted = false;
      };
    }, []);

    if (!Component) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return <Component navigation={navigation} route={route} />;
  };
};

const Problems = LazyLoadableScreen(() => import("../../screens/Problems"));
const Profile = LazyLoadableScreen(() => import("../../screens/User/Profile"));
const MyProblems = LazyLoadableScreen(() =>
  import("../../screens/User/MyProblems")
);
const Statistics = LazyLoadableScreen(() =>
  import("../../screens/User/Statistics")
);
const MyDiscuss = LazyLoadableScreen(() =>
  import("../../screens/User/MyDiscuss")
);
const ChangeInfo = LazyLoadableScreen(() =>
  import("../../screens/User/ChangeInfo")
);
const SignIn = LazyLoadableScreen(() =>
  import("../../screens/Auth/SignIn/SignIn")
);
const SignUp = LazyLoadableScreen(() => import("../../screens/Auth/SignUp"));
const ForgotPassword = LazyLoadableScreen(() =>
  import("../../screens/Auth/ForgotPassword")
);
const ActiveAccount = LazyLoadableScreen(() =>
  import("../../screens/Auth/SignIn/ActiveAccount")
);

const MainStack = ({ navigation }) => {
  const commonHeaderOptions = {
    headerShown: true,
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Ionicons
          name="menu"
          size={24}
          color="#0a0c0d"
          style={{ marginRight: 15 }}
        />
      </TouchableOpacity>
    ),
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
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
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Problems"
        component={Problems}
        options={commonHeaderOptions}
      />
      <Stack.Screen
        name="ProblemDetail"
        component={ProblemDetail}
        options={{ title: "Problem Details" }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Profile", ...commonHeaderOptions }}
      />
      <Stack.Screen name="ChangeInfo" component={ChangeInfo} />
      <Stack.Screen
        name="Statistics"
        component={Statistics}
        options={({ navigation }) => ({
          title: "My Statistics",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color="#0a0c0d"
                style={{ marginLeft: 15 }}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="MyProblems"
        component={MyProblems}
        options={{
          title: "My Problems",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color="#0a0c0d"
                style={{ marginLeft: 15 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="MyDiscuss"
        component={MyDiscuss}
        options={{ title: "My Discuss",  headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color="#0a0c0d"
                style={{ marginLeft: 15 }}
              />
            </TouchableOpacity>
          ),}}
      />
      <Stack.Screen name="Discussions" component={Discussions} />
      <Stack.Screen name="Setting" component={Setting} />
    </Stack.Navigator>
  );
};

export default MainStack;
