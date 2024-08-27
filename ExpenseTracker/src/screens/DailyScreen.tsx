import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "../store/store";
import { setTransactions } from "../store/transactionSlice";
import client from "../api/sanityClient";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import TransactionDetailModal from "../components/TransactionDetailModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Transaction = {
  _id: string;
  title: string;
  amount: number;
  date: string;
};

type DailySummaries = {
  [key: string]: number;
};

type MonthlySummaries = {
  [key: string]: number;
};

const DailyScreen = () => {
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const transactions: Transaction[] = useSelector(
    (state) => state.transaction.transactions
  );

  const dailySummaries: DailySummaries = transactions.reduce(
    (acc: DailySummaries, transaction: Transaction) => {
      const date = moment(transaction.date).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.amount;
      return acc;
    },
    {}
  );

  const monthlySummaries: MonthlySummaries = transactions.reduce(
    (acc: MonthlySummaries, transaction: Transaction) => {
      const month = moment(transaction.date).format("YYYY-MM");
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += transaction.amount;
      return acc;
    },
    {}
  );

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
      if (id) {
        fetchTransactions(id);
      } else {
        setError("ユーザーIDが見つかりません");
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
      setError("支出の取得に失敗しました");
    }
  };

  const handleDatePress = (date: string) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  const transactionsForSelectedDate = transactions.filter(
    (transaction) =>
      moment(transaction.date).format("YYYY-MM-DD") === selectedDate
  );

  return (
    <LinearGradient
      colors={["#EAD9FF", "#6495ED", "#A4C6FF"]}
      start={{ x: 0.01, y: 0.9 }}
      end={{ x: 1, y: 0.06 }}
      style={styles.gradient}
    >
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          onPress={() => setViewMode("daily")}
          style={
            viewMode === "daily" ? styles.activeButton : styles.inactiveButton
          }
        >
          <Text style={styles.buttonText}>日別</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewMode("monthly")}
          style={
            viewMode === "monthly" ? styles.activeButton : styles.inactiveButton
          }
        >
          <Text style={styles.buttonText}>月別</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {viewMode === "daily" && (
          <>
            <Text style={styles.title}>日別合計</Text>
            {Object.entries(dailySummaries)
              .sort((a, b) => moment(b[0]).diff(moment(a[0])))
              .slice(0, 31)
              .map(([date, total]) => (
                <TouchableOpacity
                  key={date}
                  onPress={() => handleDatePress(date)}
                  style={styles.summaryRow}
                >
                  <Text style={styles.date}>{date}</Text>
                  <Text style={styles.amount}>¥{total}</Text>
                </TouchableOpacity>
              ))}
          </>
        )}

        {viewMode === "monthly" && (
          <>
            <Text style={styles.title}>月別合計</Text>
            {Object.entries(monthlySummaries)
              .sort((a, b) => moment(b[0]).diff(moment(a[0])))
              .map(([month, total]) => (
                <View key={month} style={styles.summaryRow}>
                  <Text style={styles.date}>{month}</Text>
                  <Text style={styles.amount}>¥{total}</Text>
                </View>
              ))}
          </>
        )}
      </ScrollView>
      {selectedDate && (
        <TransactionDetailModal
          visible={showModal}
          onClose={closeModal}
          transactions={transactionsForSelectedDate}
          date={selectedDate}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  activeButton: {
    backgroundColor: "#6495ED",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  inactiveButton: {
    backgroundColor: "#A4C6FF",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ffffff",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  date: {
    fontSize: 16,
    color: "#333",
  },
  amount: {
    fontSize: 16,
    color: "#FF69A3",
  },
});

export default DailyScreen;
