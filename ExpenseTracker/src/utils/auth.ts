import AsyncStorage from "@react-native-async-storage/async-storage";

export const setUserId = async (userId: string) => {
  try {
    await AsyncStorage.setItem("userId", userId);
  } catch (error) {
    console.error("Error setting userId:", error);
  }
};

export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    return userId;
  } catch (error) {
    console.error("Error getting userId:", error);
    return null;
  }
};
