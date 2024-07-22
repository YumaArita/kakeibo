import AsyncStorage from "@react-native-async-storage/async-storage";

export const setLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem("appLanguage", language);
  } catch (error) {
    console.error("Error setting language:", error);
  }
};

export const getLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem("appLanguage");
    return language || "en";
  } catch (error) {
    console.error("Error getting language:", error);
    return "en";
  }
};
