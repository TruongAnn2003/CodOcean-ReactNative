// src/navigation/BottomTabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Problems from "../../screens/Problems"; 
import Discuss from "../../screens/Discuss"; 
import { Statistics, Profile } from "../../screens/User"; 
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e5e5e5"
        },
      }}
    >
      <Tab.Screen
        name="Problems"
        component={Problems}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="assignment" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Discuss"
        component={Discuss}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="chat" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={Statistics}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
