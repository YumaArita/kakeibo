import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import moment from "moment";

type Transaction = {
  _id: string;
  title: string;
  amount: number;
  date: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  transactions: Transaction[];
  date: string;
};

const TransactionDetailModal: React.FC<Props> = ({
  visible,
  onClose,
  transactions,
  date,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {moment(date).format("YYYY-MM-DD")}
            の詳細
          </Text>
          <ScrollView>
            {transactions.map((transaction) => (
              <View key={transaction._id} style={styles.transactionRow}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionAmount}>
                  ¥{transaction.amount}
                </Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  transactionTitle: {
    fontSize: 16,
    color: "#333",
  },
  transactionAmount: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#6495ED",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TransactionDetailModal;
