import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "../store/store";
import { addTransaction, setTransactions } from "../store/transactionSlice";
import client from "../api/sanityClient";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NumberPad from "../components/NumberPad";
import moment from "moment";
import Toast from "react-native-toast-message";
import { setSelectedGroup } from "../store/groupSlice";

type Transaction = {
  _id: string;
  title: string;
  amount: number;
  date: string;
};

const HomeScreen: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [itemName, setItemName] = useState("");
  const selectedGroupId = useSelector((state) => state.group.selectedGroupId);
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transaction.transactions);

  useEffect(() => {
    if (selectedGroupId) {
      fetchTransactions(selectedGroupId);
    }
  }, [selectedGroupId]);

  useEffect(() => {
    const fetchSelectedGroupId = async () => {
      let groupId = await AsyncStorage.getItem("selectedGroupId");
      if (!groupId) {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const privateGroup = await client.fetch(
            `*[_type == "group" && userId._ref == $userId && name == "プライベート"][0]`,
            { userId }
          );
          if (privateGroup) {
            groupId = privateGroup._id;
            await AsyncStorage.setItem("selectedGroupId", groupId || "");
          } else {
            Alert.alert("プライベートグループが見つかりませんでした。");
          }
        } else {
          Alert.alert("ユーザーIDが見つかりませんでした。");
        }
      }
      dispatch(setSelectedGroup(groupId));
      if (groupId) {
        fetchTransactions(groupId);
      }
    };

    fetchSelectedGroupId();
  }, []);

  const fetchTransactions = async (groupId: string) => {
    if (groupId) {
      try {
        console.log("Fetching transactions for group ID:", groupId);
        const result = await client.fetch<Transaction[]>(
          `*[_type == "transaction" && groupId._ref == $groupId] | order(date desc)`,
          { groupId }
        );
        console.log("Fetched transactions:", result);
        dispatch(setTransactions(result));
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    }
  };

  useEffect(() => {
    if (selectedGroupId) {
      fetchTransactions(selectedGroupId);
    }
  }, [selectedGroupId]);

  const handleNumberSelect = (item: number | "Clear") => {
    if (item === "Clear") {
      setInputValue("");
    } else {
      setInputValue((prev) => {
        if (prev === "" && item === 0) {
          return prev;
        }
        return `${prev}${item}`;
      });
    }
  };

  const addTransactionHandler = async () => {
    if (inputValue.trim() === "") {
      Alert.alert("金額を入力してください");
      return;
    }
    const nameToSave = itemName.trim() === "" ? "未記入" : itemName;
    const userId = await AsyncStorage.getItem("userId");
    let groupId = await AsyncStorage.getItem("selectedGroupId");

    console.log("User ID:", userId);
    console.log("Group ID:", groupId);

    if (!userId || !groupId) {
      Alert.alert("グループIDまたはユーザーIDが見つかりませんでした。");
      return;
    }

    try {
      console.log("Fetching group with ID:", groupId);
      const group = await client.fetch(
        '*[_type == "group" && _id == $groupId][0]',
        { groupId }
      );
      console.log("Fetched group:", group);

      if (!group) {
        console.log("Group not found. Creating a new group.");
        const newGroup = {
          _type: "group",
          name: "プライベート",
          userId: { _type: "reference", _ref: userId },
        };
        const createdGroup = await client.create(newGroup);
        groupId = createdGroup._id;
        await AsyncStorage.setItem("selectedGroupId", groupId);
      }

      const user = await client.fetch(
        '*[_type == "user" && _id == $userId][0]',
        { userId }
      );
      if (!user) {
        throw new Error("ユーザーが見つかりません");
      }

      const transaction = {
        _type: "transaction",
        title: `${nameToSave}: ${inputValue}円`,
        amount: parseInt(inputValue, 10),
        date: new Date().toISOString(),
        userId: { _type: "reference", _ref: userId },
        groupId: { _type: "reference", _ref: selectedGroupId },
      };

      const createdTransaction = await client.create(transaction);
      dispatch(addTransaction(createdTransaction));
      Toast.show({ type: "success", text1: "追加しました" });
      setInputValue("");
      setItemName("");
    } catch (error) {
      console.error("Error adding transaction:", error);
      Toast.show({
        type: "error",
        text1: "追加に失敗しました",
        text2:
          error instanceof Error ? error.message : "不明なエラーが発生しました",
      });
    }
  };

  return (
    <LinearGradient
      colors={["#EAD9FF", "#6495ED", "#A4C6FF"]}
      start={{ x: 0.01, y: 0.9 }}
      end={{ x: 1, y: 0.06 }}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.date}>{moment().format("MMM DD, YYYY")}</Text>
        <Text style={styles.totalAmount}>
          ¥
          {transactions
            .filter((transaction) =>
              moment(transaction.date).isSame(new Date(), "day")
            )
            .reduce((sum, transaction) => sum + transaction.amount, 0)}
        </Text>
        <Text style={styles.inputDisplay}>
          追加する金額:{" "}
          <Text style={styles.inputValue}>¥{inputValue || 0}</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="追加するもの"
          value={itemName}
          onChangeText={setItemName}
          placeholderTextColor="#D7EEFF"
        />
        <NumberPad onNumberSelect={handleNumberSelect} />
        <TouchableOpacity style={styles.button} onPress={addTransactionHandler}>
          <Text style={styles.buttonText}>追加</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 100,
  },
  totalAmount: {
    fontSize: 45,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "CuteFont",
  },
  inputDisplay: {
    fontSize: 15,
    color: "#ffffff",
    marginBottom: 10,
    fontFamily: "CuteFont",
  },
  inputValue: {
    fontSize: 25,
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
    color: "#ffffff",
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 20,
    fontFamily: "CuteFont",
  },
  button: {
    backgroundColor: "#A4C6FF",
    borderColor: "#BAD3FF",
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: -10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "CuteFont",
  },
  date: {
    marginTop: 5,
    fontSize: 30,
    color: "#BAD3FF",
    marginBottom: 10,
    fontFamily: "CuteFont",
  },
});

export default HomeScreen;
