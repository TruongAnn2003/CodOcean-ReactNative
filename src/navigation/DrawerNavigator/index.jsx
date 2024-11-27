// src/navigation/DrawerNavigator.js
import React, { Suspense } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ActivityIndicator } from "react-native";
import MainStack from "../MainStack";
import CustomDrawerContent from "../../components/CustomDrawerContent";

// Lazy load screens
const Problems = React.lazy(() => import("../../screens/Problems"));
const Profile = React.lazy(() => import("../../screens/User/Profile"));
const Statistics = React.lazy(() => import("../../screens/User/Statistics"));
const Discussions = React.lazy(() => import("../../screens/Discussions"));
const Setting = React.lazy(() => import("../../screens/Setting"));


const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Main"
        component={MainStack}
        options={{ headerShown: false }}
      />
      {/* Use children to wrap the lazy loaded components in Suspense */}
      <Drawer.Screen name="Profile">
        {() => (
          <Suspense
            fallback={<ActivityIndicator size="large" color="#0000ff" />}
          >
            <Profile />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Problems">
        {() => (
          <Suspense
            fallback={<ActivityIndicator size="large" color="#0000ff" />}
          >
            <Problems />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Statistics">
        {() => (
          <Suspense
            fallback={<ActivityIndicator size="large" color="#0000ff" />}
          >
            <Statistics />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Discussions">
        {() => (
          <Suspense
            fallback={<ActivityIndicator size="large" color="#0000ff" />}
          >
            <Discussions />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Setting">
        {() => (
          <Suspense
            fallback={<ActivityIndicator size="large" color="#0000ff" />}
          >
            <Setting />
          </Suspense>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
