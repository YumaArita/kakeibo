import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as rawUseDispatch,
  useSelector as rawUseSelector,
} from "react-redux";
import userReducer from "./userSlice";
import transactionReducer from "./transactionSlice";
import groupReducer from "./groupSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    transaction: transactionReducer,
    group: groupReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
export const useDispatch = () => rawUseDispatch<AppDispatch>();
