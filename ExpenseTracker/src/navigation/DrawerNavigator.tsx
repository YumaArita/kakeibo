import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainScreens from "./MainScreens";
import CustomDrawerContent from "../components/CustomDrawerContent";
import HeaderRightButton from "../components/HeaderRightButton";
import { DrawerParamList, RootStackScreenProps } from "../types";
import { LinearGradient } from "expo-linear-gradient";

const Drawer = createDrawerNavigator<DrawerParamList>();

type DrawerNavigatorProps = RootStackScreenProps<"DrawerNavigator">;

function DrawerNavigator({ navigation }: DrawerNavigatorProps) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerBackground: () => (
          <LinearGradient
            colors={["#EAD9FF", "#6495ED", "#A4C6FF"]}
            start={{ x: 0.01, y: 0.9 }}
            end={{ x: 1, y: 0.06 }}
            style={{ flex: 1 }}
          />
        ),
        headerRight: () => <HeaderRightButton navigation={navigation} />,
        headerTitleStyle: {
          color: "#FFFFFF",
          fontWeight: "bold",
          fontSize: 20,
        },
        headerStyle: {
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerBackgroundContainerStyle: {
          flex: 1,
          marginBottom: -1,
        },
        drawerLabelStyle: {
          display: "none",
        },
        sceneContainerStyle: {
          backgroundColor: "transparent",
        },
        drawerStyle: {
          backgroundColor: "transparent",
          width: "80%",
        },
        drawerType: "front",
        overlayColor: "rgba(0,0,0,0.7)",
      }}
    >
      <Drawer.Screen
        name="MainScreens"
        component={MainScreens}
        options={{
          title: "ExpenseTracker",
          headerTitle: "ExpenseTracker",
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
