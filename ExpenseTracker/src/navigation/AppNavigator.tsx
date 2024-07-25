import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { Button, View } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import sanityClient from "../api/sanityClient";
import { RootStackParamList } from "../types";
import DrawerNavigator from "./DrawerNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import VerifyScreen from "../screens/VerifyScreen";
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from "react-native-toast-message";
import Constants from "expo-constants";
import { StackNavigationOptions } from "@react-navigation/stack";
import HeaderBackground from "../components/HeaderBackground";

const Stack = createStackNavigator<RootStackParamList>();

const commonHeaderStyle: Partial<StackNavigationOptions> = {
  headerBackground: () => <HeaderBackground />,
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: 20,
  },
};

const AppNavigatorContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    checkLoginStatus();

    const handleDeepLink = (event: { url: string }) => {
      console.log("Received deep link:", event.url);
      const { path, queryParams } = Linking.parse(event.url);
      console.log("Parsed path:", path);
      console.log("Parsed query params:", queryParams);

      // Expo の URL スキームとカスタムスキームの両方を処理
      const verifyPath = path === "verify" || path === "--/verify";
      if (
        verifyPath &&
        queryParams?.token &&
        typeof queryParams.token === "string"
      ) {
        let token = queryParams.token;
        // トークンから余分な部分を削除
        const tokenStart = token.lastIndexOf("token=");
        if (tokenStart !== -1) {
          token = token.substring(tokenStart + 6);
        }
        console.log("Navigating to Verify screen with token:", token);
        navigation.navigate("Verify", { token: token });
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("Initial URL:", url);
        handleDeepLink({ url });
      } else {
        console.log("No initial URL received");
      }
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);

  const checkLoginStatus = async () => {
    console.log("Checking login status...");
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");
      console.log("User Token and User ID:", userToken, userId);

      if (userToken && userId) {
        console.log("User is apparently logged in, verifying with backend...");
        const query = `*[_type == "user" && _id == $userId][0]`;
        const result = await sanityClient.fetch(query, { userId });
        console.log("Verification result from backend:", result);

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

  const isDevEnvironment = Constants.appOwnership === "expo";
  const testToken =
    "eyJlbWFpbCI6Inl1bWFfc3lva29yYUBpY2xvdWQuY29tIiwiZXhwIjoxNzIxODM0NDc2fQ==.8ea711f13b19dc8f8f64a331ab74389ed3382ba830b3fae33222da9629d0efd8";
  const devTestUrl = `exp://${
    (Constants.manifest as any)?.hostUri
  }/--/verify?token=${testToken}`;
  const prodTestUrl = `expensetracker://verify?token=${testToken}`;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="DrawerNavigator"
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Verify"
              component={VerifyScreen}
              options={{ ...commonHeaderStyle }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ ...commonHeaderStyle, headerBackTitle: "Back" }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ ...commonHeaderStyle, headerBackTitle: "Back" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ ...commonHeaderStyle, headerBackTitle: "Back" }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ ...commonHeaderStyle, headerBackTitle: "Back" }}
            />
            <Stack.Screen
              name="DrawerNavigator"
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Verify"
              component={VerifyScreen}
              options={{ ...commonHeaderStyle }}
            />
          </>
        )}
      </Stack.Navigator>
    </View>
  );
};

const AppNavigator = () => {
  const toastConfig: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "green" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ fontSize: 15, fontWeight: "400" }}
        text2Style={{ fontSize: 13 }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: "red" }}
        text1Style={{ fontSize: 15 }}
        text2Style={{ fontSize: 13 }}
      />
    ),
  };

  return (
    <>
      <NavigationContainer linking={LinkingConfiguration}>
        <AppNavigatorContent />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
};

export default AppNavigator;
