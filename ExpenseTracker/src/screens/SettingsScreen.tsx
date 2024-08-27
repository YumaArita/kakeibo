import React, { useState, useEffect } from "react";
import {
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
import { getUserProfileByUserId, updateUserProfileByUserId } from "../api/user";
import { setLanguage, getLanguage } from "../utils/language";
import { getUserId } from "../utils/auth";
import { LinearGradient } from "expo-linear-gradient";
import SHA256 from "crypto-js/sha256";
import { debounce } from "lodash";
import client from "../api/sanityClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

type Group = {
  _id: string;
  name: string;
  owner: { _type: string; _ref: string | null };
  members: { _type: string; _ref: string | null }[];
};

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguageState] = useState("en");
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const id = await getUserId();
      console.log("User ID from AsyncStorage:", id);
      if (id) {
        setUserId(id);
        const userProfile = await getUserProfileByUserId(id);
        console.log("User Profile from Sanity:", userProfile);
        if (userProfile) {
          setUsername(userProfile.username || "");
          setEmail(userProfile.email || "");
        }
      }
      const savedLanguage = await getLanguage();
      console.log("Saved Language:", savedLanguage);
      setLanguageState(savedLanguage);
    };
    fetchUserData();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      Alert.alert("ユーザー名を入力してください");
      return;
    }
    if (userId) {
      const result = await updateUserProfileByUserId(
        userId,
        username,
        email,
        password
      );
      if (result.success) {
        Alert.alert("ユーザー名が更新されました");
      } else {
        Alert.alert("ユーザー名の更新に失敗しました");
      }
    } else {
      Alert.alert("ユーザーIDが見つかりません");
    }
  };

  const debouncedUpdateUsername = debounce(handleUpdateUsername, 1000, {
    leading: true,
    trailing: false,
  });

  const handleUpdateEmail = async () => {
    if (!validateEmail(email)) {
      Alert.alert("有効なメールアドレスを入力してください");
      return;
    }
    if (userId) {
      const result = await updateUserProfileByUserId(
        userId,
        username,
        email,
        password
      );
      if (result.success) {
        Alert.alert("メールアドレスが更新されました");
      } else {
        Alert.alert("メールアドレスの更新に失敗しました");
      }
    } else {
      Alert.alert("ユーザーIDが見つかりません");
    }
  };

  const debouncedUpdateEmail = debounce(handleUpdateEmail, 1000, {
    leading: true,
    trailing: false,
  });

  const handleUpdatePassword = async () => {
    if (!password.trim()) {
      Alert.alert("パスワードを入力してください");
      return;
    }
    if (password.length < 8) {
      Alert.alert("パスワードは8文字以上である必要があります");
      return;
    }
    if (userId) {
      const hashedPassword = SHA256(password).toString();
      const result = await updateUserProfileByUserId(
        userId,
        username,
        email,
        hashedPassword
      );
      if (result.success) {
        Alert.alert("パスワードが更新されました");
      } else {
        Alert.alert("パスワードの更新に失敗しました");
      }
    } else {
      Alert.alert("ユーザーIDが見つかりません");
    }
  };

  const debouncedUpdatePassword = debounce(handleUpdatePassword, 1000, {
    leading: true,
    trailing: false,
  });

  const handleSaveLanguage = async () => {
    await setLanguage(language);
    Alert.alert("言語が更新されました");
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      Alert.alert("エラー", "ユーザーIDが見つかりません");
      return;
    }

    Alert.alert(
      "アカウント削除",
      "本当にアカウントを削除しますか？この操作は取り消せません。",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            try {
              const groups = await client.fetch<Group[]>(
                `*[_type == "group" && references($userId)]`,
                { userId }
              );

              for (const group of groups) {
                if (group.owner._ref === userId) {
                  if (group.name === "プライベート") {
                    const transactions = await client.fetch(
                      `*[_type == "transaction" && groupId._ref == $groupId]`,
                      { groupId: group._id }
                    );
                    for (const transaction of transactions) {
                      await client.delete(transaction._id);
                    }
                    await client.delete(group._id);
                  } else {
                    if (group.members.length > 1) {
                      const newOwner = group.members.find(
                        (member) => member._ref !== userId
                      );
                      if (newOwner) {
                        await client
                          .patch(group._id)
                          .set({
                            owner: { _type: "reference", _ref: newOwner._ref },
                          })
                          .unset([`members[_ref == "${userId}"]`])
                          .commit();
                      }
                    } else {
                      await client.delete(group._id);
                    }
                  }
                } else {
                  await client
                    .patch(group._id)
                    .unset([`members[_ref == "${userId}"]`])
                    .commit();
                }
              }
              await client.delete(userId);
              await AsyncStorage.clear();

              Alert.alert(
                "アカウントが削除されました",
                "ご利用ありがとうございました。",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "Login" }],
                      });
                    },
                  },
                ]
              );
            } catch (error) {
              console.error("Failed to delete account:", error);
              Alert.alert("アカウントの削除に失敗しました");
            }
          },
        },
      ]
    );
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
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>設定</Text>

          <Text style={styles.label}>現在のユーザー名</Text>
          <Text style={styles.currentValue}>{username}</Text>
          <TextInput
            style={styles.input}
            placeholder="新しいユーザー名"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={debouncedUpdateUsername}
          >
            <Text style={styles.buttonText}>ユーザー名変更</Text>
          </TouchableOpacity>

          <Text style={styles.label}>現在のメールアドレス</Text>
          <Text style={styles.currentValue}>{email}</Text>
          <TextInput
            style={styles.input}
            placeholder="新しいメールアドレス"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={debouncedUpdateEmail}
          >
            <Text style={styles.buttonText}>メールアドレスの変更</Text>
          </TouchableOpacity>

          <Text style={styles.label}>パスワード</Text>
          <TextInput
            style={styles.input}
            placeholder="新しいパスワード"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={debouncedUpdatePassword}
          >
            <Text style={styles.buttonText}>パスワードを更新</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF97C2" }]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.buttonText}>アカウントを削除</Text>
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
  title: {
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#ffffff",
    marginTop: 10,
  },
  currentValue: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#D7EEFF",
    marginBottom: 5,
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
});

export default SettingsScreen;
