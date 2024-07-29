import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { store } from "./src/store/store";
import { Provider } from "react-redux";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-get-random-values";
import toastConfig from "./src/utils/toastConfig";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

const loadFonts = () => {
  return Font.loadAsync({
    CuteFont: require("./assets/fonts/SignikaNegative-VariableFont_wght.ttf"),
  });
};

function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <AppNavigator />
      <Toast config={toastConfig} />
    </Provider>
  );
}

export default App;
