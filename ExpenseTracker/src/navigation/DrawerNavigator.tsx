import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import MainScreens from "./MainScreens";
import CustomDrawerContent from "../components/CustomDrawerContent";
import HeaderRightButton from "../components/HeaderRightButton";
import { DrawerParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNavigator() {
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerBackground: () => (
          <LinearGradient
            colors={["#EAD9FF", "#6495ED", "#A4C6FF"]}
            start={{ x: 0.2, y: 1.5 }}
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
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            <Ionicons
              name="menu"
              size={28}
              color="white"
              style={{ marginLeft: 15 }}
            />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="MainScreens"
        component={MainScreens}
        options={{
          title: "ExpenseTracker",
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
