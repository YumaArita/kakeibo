import React from "react";
import {
  BaseToast,
  ErrorToast,
  BaseToastProps,
} from "react-native-toast-message";

const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#A7F1FF" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 20,
        fontWeight: "400",
      }}
    />
  ),
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontWeight: "400",
      }}
    />
  ),
};

export default toastConfig;
