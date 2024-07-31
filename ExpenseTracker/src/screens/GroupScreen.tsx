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
import client from "../api/sanityClient";
import { getUserId } from "../utils/auth";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setSelectedGroup } from "../store/groupSlice";
import { MaterialIcons } from "@expo/vector-icons"; // Expoアイコンのインポート

type Group = {
  _id: string;
  name: string;
  userId: { _type: string; _ref: string | null };
};

type GroupInvitation = {
  _id: string;
  groupId: string;
  groupName: string;
  invitedBy: string;
};

const GroupScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const getPrivateGroupId = (): string | null => {
    const privateGroup = groups.find((group) => group.name === "プライベート");
    return privateGroup ? privateGroup._id : null;
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
      if (id) {
        fetchGroups(id);
        fetchInvitations(id);
        const storedGroupId = await AsyncStorage.getItem("selectedGroupId");
        setSelectedGroupId(storedGroupId);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      if (userId) {
        const user = await client.fetch(
          `*[_type == "user" && _id == $userId]`,
          { userId }
        );
        if (user.length > 0) {
          setUsername(user[0].username);
        }
      }
    };
    fetchUsername();
  }, [userId]);

  const fetchGroups = async (userId: string) => {
    try {
      const result = await client.fetch<Group[]>(
        `*[_type == "group" && userId._ref == $userId]`,
        { userId }
      );
      setGroups(result);
    } catch (error) {
      console.error("Failed to fetch groups", error);
      Toast.show({ type: "error", text1: "グループの取得に失敗しました" });
    }
  };

  const fetchInvitations = async (userId: string) => {
    try {
      const result = await client.fetch<GroupInvitation[]>(
        `*[_type == "groupInvitation" && invitee._ref == $userId]`,
        { userId }
      );
      setInvitations(result);
    } catch (error) {
      console.error("Failed to fetch invitations", error);
      Toast.show({ type: "error", text1: "招待の取得に失敗しました" });
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("グループ名を入力してください");
      return;
    }
    if (groupName === "プライベート") {
      Alert.alert("この名前のグループは作成できません");
      return;
    }
    try {
      const newGroup = {
        _type: "group",
        name: groupName,
        userId: { _type: "reference", _ref: userId },
      };
      const createdGroup = await client.create(newGroup);
      setGroups([...groups, createdGroup]);
      setGroupName("");
      Toast.show({ type: "success", text1: "グループを作成しました" });
    } catch (error) {
      console.error("Failed to create group", error);
      Toast.show({ type: "error", text1: "グループの作成に失敗しました" });
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert("招待するユーザーのメールアドレスを入力してください");
      return;
    }

    try {
      const existingUsers = await client.fetch(
        `*[_type == "user" && email == $email]`,
        { email: inviteEmail }
      );

      if (existingUsers.length === 0) {
        Alert.alert("指定されたメールアドレスのユーザーが存在しません");
        return;
      }

      const newInvitation = {
        _type: "groupInvitation",
        groupId: groups[0]._id,
        groupName: groups[0].name,
        invitee: { _type: "reference", _ref: existingUsers[0]._id },
        invitedBy: userId,
      };

      await client.create(newInvitation);
      setInviteEmail("");
      Toast.show({ type: "success", text1: "招待を送信しました" });
    } catch (error) {
      console.error("Failed to invite user", error);
      Toast.show({ type: "error", text1: "招待に失敗しました" });
    }
  };

  const handleAcceptInvitation = async (invitation: GroupInvitation) => {
    try {
      const updatedGroup = {
        _type: "group",
        _id: invitation.groupId,
        userId: { _type: "reference", _ref: userId },
      };
      await client.patch(invitation.groupId).set(updatedGroup).commit();
      await client.delete(invitation._id);
      fetchGroups(userId!);
      fetchInvitations(userId!);
      Toast.show({ type: "success", text1: "グループに参加しました" });
    } catch (error) {
      console.error("Failed to accept invitation", error);
      Toast.show({ type: "error", text1: "参加に失敗しました" });
    }
  };

  const handleDeclineInvitation = async (invitation: GroupInvitation) => {
    try {
      await client.delete(invitation._id);
      fetchInvitations(userId!);
      Toast.show({ type: "success", text1: "招待を辞退しました" });
    } catch (error) {
      console.error("Failed to decline invitation", error);
      Toast.show({ type: "error", text1: "辞退に失敗しました" });
    }
  };

  const handleGroupSelect = async (groupId: string | null) => {
    await AsyncStorage.setItem("selectedGroupId", groupId || "");
    dispatch(setSelectedGroup(groupId)); // dispatchを使用
    setSelectedGroupId(groupId); // ステートを更新
    Toast.show({ type: "success", text1: "グループを切り替えました" });
  };

  const handleDeleteGroup = async (groupId: string) => {
    Alert.alert(
      "グループ削除",
      "本当にこのグループを削除しますか？",
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
              // グループに関連付けられたトランザクションを削除
              const transactions = await client.fetch(
                `*[_type == "transaction" && groupId._ref == $groupId]`,
                { groupId }
              );
              for (const transaction of transactions) {
                await client.delete(transaction._id);
              }

              await client.delete(groupId);
              await fetchGroups(userId!);

              if (selectedGroupId === groupId) {
                const privateGroupId = getPrivateGroupId();
                if (privateGroupId) {
                  await handleGroupSelect(privateGroupId);
                } else {
                  await handleGroupSelect(null);
                }
              }
              Toast.show({ type: "success", text1: "グループを削除しました" });
            } catch (error) {
              console.error("Failed to delete group", error);
              Toast.show({
                type: "error",
                text1: "グループの削除に失敗しました",
              });
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderGroupItem = (group: Group) => {
    const isSelected = group._id === selectedGroupId;
    const isPrivate = group.name === "プライベート";

    return (
      <View
        key={group._id}
        style={[styles.groupItem, isSelected && styles.selectedGroupItem]}
      >
        <TouchableOpacity
          style={styles.groupInfo}
          onPress={() => handleGroupSelect(group._id)}
        >
          <Text
            style={[
              styles.groupName,
              isSelected && styles.selectedGroupName,
              isPrivate && styles.privateGroupName,
            ]}
          >
            {isPrivate ? `${username} (プライベート)` : group.name}
          </Text>
        </TouchableOpacity>
        {isSelected && <MaterialIcons name="check" size={24} color="#008BBB" />}
        {!isPrivate && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteGroup(group._id)}
          >
            <MaterialIcons name="delete" size={24} color="#B0C4DE" />
          </TouchableOpacity>
        )}
      </View>
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>グループ管理</Text>
          <View style={styles.groupList}>{groups.map(renderGroupItem)}</View>
          <TextInput
            style={styles.input}
            placeholder="グループ名"
            value={groupName}
            onChangeText={setGroupName}
          />
          <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
            <Text style={styles.buttonText}>グループ作成</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="ユーザーのメールアドレス"
            value={inviteEmail}
            onChangeText={setInviteEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleInviteUser}>
            <Text style={styles.buttonText}>ユーザー招待</Text>
          </TouchableOpacity>
          <View style={styles.invitationList}>
            <Text style={styles.invitationTitle}>招待されたグループ</Text>
            {invitations.map((invitation) => (
              <View key={invitation._id} style={styles.invitationItem}>
                <Text style={styles.invitationText}>
                  {invitation.groupName} に招待されました
                </Text>
                <View style={styles.invitationButtons}>
                  <TouchableOpacity
                    style={[styles.invitationButton, styles.acceptButton]}
                    onPress={() => handleAcceptInvitation(invitation)}
                  >
                    <Text style={styles.invitationButtonText}>参加</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.invitationButton, styles.declineButton]}
                    onPress={() => handleDeclineInvitation(invitation)}
                  >
                    <Text style={styles.invitationButtonText}>辞退</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
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
  title: {
    fontSize: 24,
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
    padding: 10,
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
  groupList: {
    width: "100%",
    marginTop: 20,
  },
  groupItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 25,
    marginBottom: 10,
  },
  groupInfo: {
    flex: 1,
    margin: 10,
  },
  groupName: {
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    padding: 10,
  },
  invitationList: {
    width: "100%",
    marginTop: 20,
  },
  invitationTitle: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 10,
  },
  invitationItem: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
  },
  invitationText: {
    fontSize: 16,
    color: "#333",
  },
  invitationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  invitationButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  acceptButton: {
    borderRadius: 20,
    backgroundColor: "#64F9C1",
  },
  declineButton: {
    borderRadius: 20,
    backgroundColor: "#778899",
  },
  invitationButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedGroupItem: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
    borderWidth: 2,
  },
  selectedGroupName: {
    fontWeight: "bold",
    color: "#2196F3",
  },
  privateGroupName: {
    fontStyle: "italic",
  },
});

export default GroupScreen;
