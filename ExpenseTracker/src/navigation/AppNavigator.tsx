import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "../screens/LoginScreen";
import sanityClient from "../api/sanityClient";
import { RootStackParamList } from "../types";
import DrawerNavigator from "./DrawerNavigator";
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from "react-native-toast-message";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    console.log("Checking login status...");
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");
      console.log("User Token and User ID:", userToken, userId); // トークンとユーザーIDをログ出力

      if (userToken && userId) {
        console.log("User is apparently logged in, verifying with backend...");
        const query = `*[_type == "user" && _id == $userId][0]`;
        const result = await sanityClient.fetch(query, { userId });
        console.log("Verification result from backend:", result); // バックエンドからの確認結果をログ出力

        if (result) {
          setIsLoggedIn(true);
          console.log("User is verified and logged in.");
        } else {
          setIsLoggedIn(false);
          console.log("User is not logged in.");
        }
      } else {
        setIsLoggedIn(false);
        console.log("No valid token or user ID found.");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
    }
  };

  if (isLoggedIn === null) {
    return null;
  }

  const toastConfig: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "green" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "400",
        }}
        text2Style={{
          fontSize: 13,
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: "red" }}
        text1Style={{
          fontSize: 15,
        }}
        text2Style={{
          fontSize: 13,
        }}
      />
    ),
  };

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen
                name="DrawerNavigator"
                component={DrawerNavigator}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen
                name="DrawerNavigator"
                component={DrawerNavigator}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
};

export default AppNavigator;
