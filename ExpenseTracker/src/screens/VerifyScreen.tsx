import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import client from "../api/sanityClient";
import { verifyToken } from "../utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SanityDocument } from "@sanity/client";
import { LinearGradient } from "expo-linear-gradient";
import { v4 as uuidv4 } from "uuid";

interface User extends Omit<SanityDocument, "_type"> {
  _type: "user";
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  userId: string;
}

type RootStackParamList = {
  Verify: { token: string };
  Login: undefined;
};

type VerifyScreenRouteProp = RouteProp<RootStackParamList, "Verify">;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const VerifyScreen: React.FC = () => {
  const route = useRoute<VerifyScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { token } = route.params;

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        console.log("Token received:", token);
        try {
          const email = verifyToken(token);
          console.log("Decoded email from token:", email);
          if (email) {
            // AsyncStorageから一時的なユーザー情報を取得
            const tempUserString = await AsyncStorage.getItem("tempUser");
            if (tempUserString) {
              const tempUser = JSON.parse(tempUserString);
              if (tempUser.email === email) {
                // ユーザーをSanityに登録
                const newUser: User = {
                  _type: "user",
                  username: tempUser.username,
                  email: tempUser.email,
                  password: tempUser.hashedPassword,
                  isVerified: true,
                  userId: uuidv4(),
                };

                const result = await client.create<User>(newUser);
                console.log("New user created:", result);

                if (result && result._id) {
                  // 一時的なユーザー情報を削除
                  await AsyncStorage.removeItem("tempUser");

                  console.log("User registered successfully.");
                  Alert.alert(
                    "メールアドレスが確認され、登録が完了しました",
                    "",
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          console.log("Navigating to Login screen...");
                          navigation.reset({
                            index: 0,
                            routes: [{ name: "Login" }],
                          });
                        },
                      },
                    ]
                  );
                } else {
                  console.log("Failed to create user.");
                  Alert.alert("ユーザー登録に失敗しました");
                }
              } else {
                console.log("Email mismatch.");
                Alert.alert("メールアドレスが一致しません");
              }
            } else {
              console.log("No temporary user data found.");
              Alert.alert("ユーザー情報が見つかりません");
            }
          } else {
            console.log("Invalid token: Failed to decode email.");
            Alert.alert("無効なトークンです");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          Alert.alert("トークンの確認中にエラーが発生しました");
        }
      } else {
        console.log("No token provided");
        Alert.alert("エラー", "トークンが提供されていません");
      }
    };
    verifyUser();
  }, [token, navigation]);

  return (
    <LinearGradient
      colors={["#EAD9FF", "#6495ED", "#A4C6FF"]}
      start={{ x: 0.01, y: 0.9 }}
      end={{ x: 1, y: 0.06 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.header}>メールアドレス確認</Text>
        <Text style={styles.text}>メールアドレスの確認中...</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
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
  text: {
    fontSize: 18,
    color: "#ffffff",
  },
});

export default VerifyScreen;
