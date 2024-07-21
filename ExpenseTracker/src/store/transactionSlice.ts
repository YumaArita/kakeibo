import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";
import moment from "moment";

export type Transaction = {
  _id: string;
  title: string;
  amount: number;
  date: string;
};

interface TransactionState {
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactions: [],
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (transaction) => transaction._id !== action.payload
      );
    },
  },
});

export const selectTransactions = (state: RootState) =>
  state.transaction.transactions;

// selectTodayTransactionsTotal は、selectTransactions の後に定義
export const selectTodayTransactionsTotal = createSelector(
  [selectTransactions],
  (transactions) =>
    transactions.reduce((total, transaction) => {
      if (moment(transaction.date).isSame(new Date(), "day")) {
        return total + transaction.amount;
      }
      return total;
    }, 0)
);

export const { setTransactions, addTransaction, removeTransaction } =
  transactionSlice.actions;

export default transactionSlice.reducer;
