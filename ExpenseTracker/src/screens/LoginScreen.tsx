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
      setError("Please fill in all fields");
      return;
    }
    console.log("Attempting login with:", username); // ユーザー名でログインを試みていることをログに記録
    try {
      const query = `*[_type == "user" && username == $username && password == $password]`;
      const params = { username, password };
      console.log("Fetching user with params:", params); // クエリ実行前にパラメータをログ出力
      const result = await sanityClient.fetch(query, params);
      console.log("Login result:", result); // ログイン結果をログ出力
      if (result.length > 0) {
        await AsyncStorage.setItem("userToken", "yourGeneratedTokenHere");
        await AsyncStorage.setItem("userId", result[0]._id);
        dispatch(setLogin(result[0]));
        console.log("Dispatching navigation reset to DrawerNavigator"); // ナビゲーションリセットのディスパッチをログ出力
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "DrawerNavigator" }],
          })
        );
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("An error occurred during login:", err);
      setError("An error occurred during login.");
    }
  };

  return (
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
            <Ionicons name="person-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#666"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            style={{ marginTop: 20 }}
          >
            <Text style={{ color: "#778899" }}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
    backgroundColor: "#e8e8e8",
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
    backgroundColor: "#778899",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default LoginScreen;
