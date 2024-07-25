import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { useSelector, useDispatch } from "../store/store";
import {
  selectTransactions,
  removeTransaction,
  setTransactions,
} from "../store/transactionSlice";
import { Ionicons } from "@expo/vector-icons";
import client from "../api/sanityClient";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const [userId, setUserId] = useState<string | null>(null);
  const transactions = useSelector(selectTransactions);
  const dispatch = useDispatch();

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
      if (id) {
        fetchTransactions(id);
      }
    };
    fetchUserId();
  }, []);

  const fetchTransactions = async (userId: string) => {
    try {
      const result = await client.fetch(
        `*[_type == "transaction" && userId._ref == $userId] | order(date desc)`,
        { userId }
      );
      dispatch(setTransactions(result));
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await client.delete(id);
      dispatch(removeTransaction(id));
      Toast.show({
        type: "success",
        text1: "削除しました",
      });
    } catch (error) {
      console.error("Failed to delete transaction", error);
      Toast.show({
        type: "error",
        text1: "エラー",
      });
    }
  };

  const debouncedHandleDelete = useCallback(debounce(handleDelete, 1000), []);

  return (
    <LinearGradient
      colors={["#EAD9FF", "#6495ED", "#A4C6FF"]}
      start={{ x: 0.01, y: 0.9 }}
      end={{ x: 1, y: 0.06 }}
      style={styles.gradient}
    >
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
      >
        <View style={styles.transactionContainer}>
          <Text style={styles.transactionTitle}>本日追加したもの</Text>
          <ScrollView>
            {transactions
              .filter((transaction) => transaction.date.split("T")[0] === today)
              .slice(0, 10)
              .map((transaction) => (
                <View key={transaction._id} style={styles.transactionRow}>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionItemName}>
                      {transaction.title.split(":")[0]}
                    </Text>
                    <Text style={styles.transactionAmount}>
                      {transaction.title.split(":")[1]}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => debouncedHandleDelete(transaction._id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#A4C6FF" />
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>
      </DrawerContentScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  transactionContainer: {
    paddingTop: 40,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionDetails: {
    flexDirection: "column",
  },
  transactionItemName: {
    fontSize: 16,
    color: "#778899",
    marginBottom: 4,
    fontWeight: "bold",
  },
  transactionAmount: {
    fontSize: 18,
    color: "#FF69A3",
  },
  deleteButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: "#f8f9fa",
  },
});

export default CustomDrawerContent;
