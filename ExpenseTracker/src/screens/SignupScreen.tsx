import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import client from "../api/sanityClient";
import { sendVerificationEmail } from "../utils/email";
import { LinearGradient } from "expo-linear-gradient";
import SHA256 from "crypto-js/sha256";
import { enc } from "crypto-js";
import { generateVerificationToken } from "../utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const hashedPassword = SHA256(password).toString(enc.Hex);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    if (!username || !password || !email) {
      setError("すべてのフィールドに入力してください");
      return;
    }

    if (!validateEmail(email)) {
      setError("有効なメールアドレスを入力してください");
      return;
    }

    try {
      const existingUsers = await client.fetch(
        `*[_type == "user" && email == $email]`,
        { email }
      );
      if (existingUsers.length > 0) {
        setError("このメールアドレスは既に使用されています");
        return;
      }

      const verificationToken = await generateVerificationToken(email);
      await AsyncStorage.setItem(
        "tempUser",
        JSON.stringify({
          username,
          email,
          hashedPassword,
        })
      );
      console.log("Sending verification email...");
      await sendVerificationEmail(email, verificationToken);
      console.log("Verification email sent.");

      setError("");
      Alert.alert("確認メールを送信しました。メールを確認してください。");

      navigation.navigate("Login");
    } catch (err) {
      console.error("Error during signup:", err);
      setError("サインアップ中にエラーが発生しました");
    }
  };

  const debouncedHandleSignup = useCallback(
    debounce(handleSignup, 1000, {
      leading: true,
      trailing: false,
    }),
    [username, password, email]
  );

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
      >
        <ScrollView contentContainerStyle={styles.container}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="ユーザー名"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setError("");
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="メールアドレス"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="パスワード"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={debouncedHandleSignup}
          >
            <Text style={styles.buttonText}>サインアップ</Text>
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
    paddingBottom: 150,
  },
  header: {
    fontSize: 32,
    color: "#ffffff",
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    color: "#333",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#A4C6FF",
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: "#BAD3FF",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default SignupScreen;
