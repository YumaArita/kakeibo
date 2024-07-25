import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Text,
  Alert,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import NumberPad from "../components/NumberPad";
import client from "../api/sanityClient";
import { setTransactions, addTransaction } from "../store/transactionSlice";
import { useDispatch, useSelector } from "../store/store";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";

type Transaction = {
  _id: string;
  title: string;
  amount: number;
  date: string;
};

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

function HomeScreen({ navigation }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [itemName, setItemName] = useState("");
  const dispatch = useDispatch();
  const totalToday = useSelector((state) =>
    state.transaction.transactions.reduce(
      (sum: number, current: Transaction) => {
        const isToday = moment(current.date).isSame(new Date(), "day");
        return isToday ? sum + current.amount : sum;
      },
      0
    )
  );

  const scaleValue = useRef(new Animated.Value(1)).current;
  const todayDate = moment().format("MMM DD, YYYY");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const result = await client.fetch(
        `*[_type == "transaction" && userId._ref == $userId] | order(date desc)`,
        { userId }
      );
      dispatch(setTransactions(result));
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

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
    const transaction = {
      _type: "transaction",
      title: `${nameToSave}: ${inputValue}円`,
      amount: parseInt(inputValue, 10),
      date: new Date().toISOString(),
      userId: { _type: "reference", _ref: userId },
    };
    try {
      const createdTransaction = await client.create(transaction);
      dispatch(addTransaction(createdTransaction));
      Toast.show({ type: "success", text1: "追加しました" });
      setInputValue("");
      setItemName("");
    } catch (error) {
      Toast.show({ type: "error", text1: "追加に失敗しました" });
      console.error("Error adding transaction:", error);
    }
  };

  const debouncedAddTransactionHandler = useCallback(
    debounce(addTransactionHandler, 1000, {
      leading: true,
      trailing: false,
    }),
    [inputValue, itemName]
  );

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient
      colors={["#EAD9FF", "#6495ED", "#A4C6FF"]}
      start={{ x: 0.01, y: 0.9 }}
      end={{ x: 1, y: 0.06 }}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.date}>{todayDate}</Text>
        <Text style={styles.totalAmount}>¥{Math.floor(totalToday) || 0}</Text>
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
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableOpacity
            style={styles.button}
            onPress={debouncedAddTransactionHandler}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.buttonText}>追加</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

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
