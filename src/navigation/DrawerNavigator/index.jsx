// src/navigation/DrawerNavigator.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainStack from "../MainStack";
import { Profile, Statistics } from "../../screens/User";
import Setting from "../../screens/Setting";
import Discuss from "../../screens/Discuss";
import Problems from "../../screens/Problems";
import CustomDrawerContent from "../../components/CustomDrawerContent";
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
      <Drawer.Screen name="Statistics" component={Statistics} />
      <Drawer.Screen name="Discuss" component={Discuss} />
      <Drawer.Screen name="Setting" component={Setting} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;