import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as rawUseDispatch,
  useSelector as rawUseSelector,
} from "react-redux";
import userReducer from "./userSlice";
import transactionReducer from "./transactionSlice";
import groupReducer from "./groupSlice"; // 新しく追加

export const store = configureStore({
  reducer: {
    user: userReducer,
    transaction: transactionReducer,
    group: groupReducer, // 新しく追加
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== "production",
});

// ストアのルートステートの型
export type RootState = ReturnType<typeof store.getState>;

// ディスパッチ関数の型
export type AppDispatch = typeof store.dispatch;

// カスタムフック
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
export const useDispatch = () => rawUseDispatch<AppDispatch>();
