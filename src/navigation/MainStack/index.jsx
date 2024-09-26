import React, { Suspense } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Home from "../../screens/Home";
import {
  Login,
  ActiveAccount,
  Register,
  ForgotPassword,
} from "../../screens/Auth";
// import Problems from "../../screens/Problems";
import {
  Profile,
  ChangeInfo,
  MyProblems,
  Statistics,
} from "../../screens/User";
import Discuss from "../../screens/Discuss";
import Setting from "../../screens/Setting";
const Stack = createNativeStackNavigator();
const Problems = React.lazy(() => import("../../screens/Problems"));
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
    <Stack.Screen
      name="Problems"
      options={{
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons
              name="menu"
              size={24}
              color="#030BA6"
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
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="ChangeInfo" component={ChangeInfo} />
    <Stack.Screen name="Statistics" component={Statistics} />
    <Stack.Screen name="MyProblems" component={MyProblems} />
    <Stack.Screen name="Discuss" component={Discuss} />
    <Stack.Screen name="Setting" component={Setting} />
  </Stack.Navigator>
);

export default MainStack;
