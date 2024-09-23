// src/navigation/DrawerNavigator.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainStack from "./MainStack";
import Profile from "../screens/Profile";
import Problems from "../screens/Problems";
import CustomDrawerContent from "../components/CustomDrawerContent";

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
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Problems" component={Problems} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
