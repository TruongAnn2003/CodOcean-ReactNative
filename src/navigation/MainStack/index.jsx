import React, { Suspense } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Home from "../../screens/Home";
import ProblemDetail from "../../components/ProblemDetail";
// import {
//   SignIn,
//   ActiveAccount,
//   SignUp,
//   ForgotPassword,
// } from "../../screens/Auth";
// import {
//   Profile,
//   ChangeInfo,
//   MyProblems,
//   Statistics,
//   MyDiscuss,
// } from "../../screens/User";
import Discuss from "../../screens/Discuss";
import Setting from "../../screens/Setting";
const Stack = createNativeStackNavigator();
const Problems = React.lazy(() => import("../../screens/Problems"));
const Profile = React.lazy(() => import("../../screens/User/Profile"));
const MyProblems = React.lazy(() => import("../../screens/User/MyProblems"));
const Statistics = React.lazy(() => import("../../screens/User/Statistics"));
const MyDiscuss = React.lazy(() => import("../../screens/User/MyDiscuss"));
const ChangeInfo = React.lazy(() => import("../../screens/User/ChangeInfo"));
const SignIn = React.lazy(() => import("../../screens/Auth/SignIn/SignIn"));
const SignUp = React.lazy(() => import("../../screens/Auth/SignUp"));
const ForgotPassword = React.lazy(() =>
  import("../../screens/Auth/ForgotPassword")
);
const ActiveAccount = React.lazy(() =>
  import("../../screens/Auth/SignIn/ActiveAccount")
);
const MainStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={Home}
      options={{
        headerShown: false,
      }}
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
      options={{
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
      }}
    >
      {() => (
        <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
          <Problems />
        </Suspense>
      )}
    </Stack.Screen>
    <Stack.Screen
      name="ProblemDetail"
      component={ProblemDetail}
      options={{ title: "Problem Details" }}
    />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="ChangeInfo" component={ChangeInfo} />
    <Stack.Screen
      name="Statistics"
      component={Statistics}
      options={{
        title: "My Statistics",
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
      }}
    />
    <Stack.Screen
      name="MyProblems"
      component={MyProblems}
      options={{
        title: "My Problems",
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
      }}
    />
    <Stack.Screen
      name="MyDiscuss"
      component={MyDiscuss}
      options={{
        title: "My Discuss",
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
      }}
    />
    <Stack.Screen name="Discuss" component={Discuss} />
    <Stack.Screen name="Setting" component={Setting} />
  </Stack.Navigator>
);

export default MainStack;
