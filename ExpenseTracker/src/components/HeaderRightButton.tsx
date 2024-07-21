import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackScreenProps } from "../types";
import { CommonActions } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setLogout } from "../store/userSlice";

type HeaderRightButtonProps = {
  navigation: RootStackScreenProps<"DrawerNavigator">["navigation"];
};

const HeaderRightButton: React.FC<HeaderRightButtonProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    AsyncStorage.multiRemove(["userToken", "userId"])
      .then(() => {
        dispatch(setLogout());
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
      })
      .catch((error) => {
        console.error("Failed to remove tokens:", error);
      });
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.button}>
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HeaderRightButton;
