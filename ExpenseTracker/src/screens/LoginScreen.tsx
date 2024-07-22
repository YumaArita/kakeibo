import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, CommonActions } from "@react-navigation/native";
import sanityClient from "../api/sanityClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../types";
import { useDispatch } from "react-redux";
import { setLogin } from "../store/userSlice";
import { LinearGradient } from "expo-linear-gradient";
import I18n from "../utils/i18n";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, "Login">;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError((I18n as any).t("enterFields"));
      return;
    }
    console.log("Attempting login with:", username);
    try {
      const query = `*[_type == "user" && username == $username && password == $password]`;
      const params = { username, password };
      console.log("Fetching user with params:", params);
      const result = await sanityClient.fetch(query, params);
      console.log("Login result:", result);
      if (result.length > 0) {
        await AsyncStorage.setItem("userToken", "yourGeneratedTokenHere");
        await AsyncStorage.setItem("userId", result[0]._id);
        dispatch(setLogin(result[0]));
        console.log("Dispatching navigation reset to DrawerNavigator");
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "DrawerNavigator" }],
          })
        );
      } else {
        setError((I18n as any).t("invalidCredentials"));
      }
    } catch (err) {
      console.error("An error occurred during login:", err);
      setError((I18n as any).t("loginError"));
    }
  };

  return (
    <LinearGradient
      colors={["#EAD9FF", "#6495ED", "#A4C6FF"]}
      start={{ x: 0.01, y: 0.9 }}
      end={{ x: 1, y: 0.06 }}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder={(I18n as any).t("username")}
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder={(I18n as any).t("password")}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#666"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>{(I18n as any).t("logIn")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            style={{ marginTop: 20 }}
          >
            <Text style={{ color: "#D7EEFF" }}>
              {(I18n as any).t("noAccount")} {(I18n as any).t("signUp")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginBottom: 10,
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#333",
    paddingLeft: 10,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#A4C6FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#BAD3FF",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LoginScreen;
