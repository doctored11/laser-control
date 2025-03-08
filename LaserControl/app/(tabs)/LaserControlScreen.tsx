import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SlidersScreen from "../SlidersControlScreen";
import ColorWheelScreen from "../ColorWheelScreen";

const Tab = createMaterialTopTabNavigator();

export default function LaserControlScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#6200ea" },
        tabBarLabelStyle: { fontSize: 16, color: "white" },
        tabBarIndicatorStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen name="Ползунки" component={SlidersScreen} />
      <Tab.Screen name="Световой круг" component={ColorWheelScreen} />
    </Tab.Navigator>
  );
}
