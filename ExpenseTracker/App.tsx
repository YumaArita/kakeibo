import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { store } from "./src/store/store";
import { Provider } from "react-redux";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

const loadFonts = () => {
  return Font.loadAsync({
    CuteFont: require("./assets/fonts/SignikaNegative-VariableFont_wght.ttf"),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
