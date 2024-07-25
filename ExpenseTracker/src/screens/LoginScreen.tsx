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
import SHA256 from "crypto-js/sha256";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("すべてのフィールドに入力してください");
      return;
    }
    console.log("Attempting login with:", email);
    try {
      const hashedPassword = SHA256(password).toString();
      const query = `*[_type == "user" && email == $email && password == $password][0]`;
      const params = { email, password: hashedPassword };
      console.log("Fetching user with params:", {
        email,
        password: "********",
      });
      const result = await sanityClient.fetch(query, params);
      console.log("Login result:", result);
      if (result) {
        await AsyncStorage.setItem("userToken", "yourGeneratedTokenHere");
        await AsyncStorage.setItem("userId", result._id);
        dispatch(setLogin(result));
        console.log("Dispatching navigation reset to DrawerNavigator");
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "DrawerNavigator" }],
          })
        );
      } else {
        setError("無効なメールアドレスまたはパスワード");
      }
    } catch (err) {
      console.error("An error occurred during login:", err);
      setError("ログイン中にエラーが発生しました。");
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
            <Ionicons name="mail-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="メールアドレス"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="パスワード"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#666"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>ログイン</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            style={{ marginTop: 20 }}
          >
            <Text style={{ color: "#D7EEFF" }}>
              アカウントを持っていませんか サインアップ
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
  header: {
    fontSize: 32,
    color: "#ffffff",
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  logo: {
    width: 200,
    height: 200,
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
