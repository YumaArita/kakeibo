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

  const handleSignup = async () => {
    if (username && password && email) {
      try {
        await client.create({
          _type: "user",
          username,
          password, // 実際にはパスワードをハッシュ化して保存する
          email,
        });
        setError("");
        navigation.navigate("Login");
      } catch (err) {
        setError("An error occurred during signup.");
        console.error(err);
      }
    } else {
      setError("Please fill in all fields");
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
            <Ionicons name="mail-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#666"
            />
          </View>
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
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={{ marginTop: 20 }}
          >
            <Text style={{ color: "#778899" }}>
              Already have an account? Log In
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

export default SignupScreen;
