import React, { useState, useEffect } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { getUserProfileByUserId, updateUserProfileByUserId } from "../api/user";
import { setLanguage, getLanguage } from "../utils/language";
import { getUserId } from "../utils/auth";
import { LinearGradient } from "expo-linear-gradient";
import I18n from "../utils/i18n";

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguageState] = useState("en");

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
      Alert.alert((I18n as any).t("enterUsername"));
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
        Alert.alert((I18n as any).t("usernameUpdated"));
      } else {
        Alert.alert((I18n as any).t("usernameUpdateFailed"));
      }
    } else {
      Alert.alert((I18n as any).t("userIdNotFound"));
    }
  };

  const handleUpdateEmail = async () => {
    if (!validateEmail(email)) {
      Alert.alert((I18n as any).t("enterValidEmail"));
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
        Alert.alert((I18n as any).t("emailUpdated"));
      } else {
        Alert.alert((I18n as any).t("emailUpdateFailed"));
      }
    } else {
      Alert.alert((I18n as any).t("userIdNotFound"));
    }
  };

  const handleUpdatePassword = async () => {
    if (!password.trim()) {
      Alert.alert((I18n as any).t("enterPassword"));
      return;
    }
    if (password.length < 8) {
      Alert.alert((I18n as any).t("passwordMinLength"));
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
        Alert.alert((I18n as any).t("passwordUpdated"));
      } else {
        Alert.alert((I18n as any).t("passwordUpdateFailed"));
      }
    } else {
      Alert.alert((I18n as any).t("userIdNotFound"));
    }
  };

  const handleSaveLanguage = async () => {
    await setLanguage(language);
    Alert.alert((I18n as any).t("languageUpdated"));
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
          <Text style={styles.title}>{(I18n as any).t("settings")}</Text>

          <Text style={styles.label}>{(I18n as any).t("currentUsername")}</Text>
          <Text style={styles.currentValue}>{username}</Text>
          <TextInput
            style={styles.input}
            placeholder={(I18n as any).t("newUsername")}
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdateUsername}
          >
            <Text style={styles.buttonText}>
              {(I18n as any).t("changeUsername")}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>{(I18n as any).t("currentEmail")}</Text>
          <Text style={styles.currentValue}>{email}</Text>
          <TextInput
            style={styles.input}
            placeholder={(I18n as any).t("newEmail")}
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdateEmail}>
            <Text style={styles.buttonText}>
              {(I18n as any).t("changeEmail")}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>{(I18n as any).t("newPassword")}</Text>
          <TextInput
            style={styles.input}
            placeholder={(I18n as any).t("newPassword")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdatePassword}
          >
            <Text style={styles.buttonText}>
              {(I18n as any).t("changePassword")}
            </Text>
          </TouchableOpacity>

          <View style={styles.languageSection}>
            <Text style={styles.pickerLabel}>
              {(I18n as any).t("language")}
            </Text>
            <Picker
              selectedValue={language}
              style={styles.picker}
              onValueChange={(itemValue: string) => setLanguageState(itemValue)}
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="日本語" value="ja" />
            </Picker>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSaveLanguage}
            >
              <Text style={styles.buttonText}>
                {(I18n as any).t("updateLanguage")}
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
  languageSection: {
    width: "100%",
    marginTop: 25,
    marginBottom: 0,
  },
  pickerLabel: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: -60,
  },
  picker: {
    width: "100%",
    height: 140,
    color: "#333",
    marginBottom: 40,
    paddingVertical: 0,
  },
});

export default SettingsScreen;
