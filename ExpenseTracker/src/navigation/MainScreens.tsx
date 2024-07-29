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
          backgroundColor: "#FFEEFF", // フッターの背景色を変更
          borderTopLeftRadius: 20, // 左上の角を丸くする
          borderTopRightRadius: 20, // 右上の角を丸くする
          borderTopWidth: 1,
          borderColor: "white",
          position: "absolute", // フッターの位置を絶対位置にする
          left: 0, // 左側のマージンを削除
          right: 0, // 右側のマージンを削除
          bottom: 0, // 下側のマージンを削除
          height: 70, // フッターの高さ
          paddingBottom: 10, // 下側のパディング
          paddingTop: 10, // 上側のパディング
          elevation: 5, // 影の効果
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
