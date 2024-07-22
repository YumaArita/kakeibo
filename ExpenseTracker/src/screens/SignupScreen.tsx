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
import { RouteProp } from "@react-navigation/native";
import client from "../api/sanityClient";
import { LinearGradient } from "expo-linear-gradient";
import I18n from "../utils/i18n";

type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
};

type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Signup"
>;
type SignupScreenRouteProp = RouteProp<RootStackParamList, "Signup">;

type Props = {
  navigation: SignupScreenNavigationProp;
  route: SignupScreenRouteProp;
};

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSignup = async () => {
    if (!username || !password || !email) {
      setError((I18n as any).t("enterFields"));
      return;
    }

    if (!validateEmail(email)) {
      setError((I18n as any).t("invalidEmail"));
      return;
    }

    if (!validatePassword(password)) {
      setError((I18n as any).t("shortPassword"));
      return;
    }

    try {
      await client.create({
        _type: "user",
        username,
        password,
        email,
      });
      setError("");
      navigation.navigate("Login");
    } catch (err) {
      setError((I18n as any).t("signupError"));
      console.error(err);
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder={(I18n as any).t("email")}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#666"
              />
            </View>
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
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>{(I18n as any).t("signUp")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={{ marginTop: 20 }}
            >
              <Text style={{ color: "#D7EEFF" }}>
                {(I18n as any).t("alreadyHaveAccount")}{" "}
                {(I18n as any).t("logIn")}
              </Text>
            </TouchableOpacity>
          </View>
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

export default SignupScreen;
