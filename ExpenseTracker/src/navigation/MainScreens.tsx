import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import DailyScreen from "../screens/DailyScreen";
import SettingsScreen from "../screens/SettingsScreen";
import GroupScreen from "../screens/GroupScreen";

const Tab = createBottomTabNavigator();

function MainScreens() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Daily") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Groups") {
            iconName = focused ? "people" : "people-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#D0B0FF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#FFEEFF",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 1,
          borderColor: "white",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 5,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Daily"
        component={DailyScreen}
        options={{
          title: "Monthly",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupScreen}
        options={{
          title: "Groups",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default MainScreens;
