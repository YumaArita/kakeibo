import AsyncStorage from "@react-native-async-storage/async-storage";
import HmacSHA256 from "crypto-js/hmac-sha256";
import { enc } from "crypto-js";

const SECRET_KEY = process.env.SECRET_KEY;

export const generateVerificationToken = (email: string): string => {
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined");
  }

  const tokenPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };
  const stringifiedData = JSON.stringify(tokenPayload);
  const base64data = enc.Base64.stringify(enc.Utf8.parse(stringifiedData));
  const signature = HmacSHA256(base64data, SECRET_KEY).toString(enc.Hex);

  return `${base64data}.${signature}`;
};

export const verifyToken = (token: string): string | null => {
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined");
  }

  const [base64data, receivedSignature] = token.split(".");
  if (!base64data || !receivedSignature) {
    return null;
  }

  const expectedSignature = HmacSHA256(base64data, SECRET_KEY).toString(
    enc.Hex
  );
  if (expectedSignature !== receivedSignature) {
    return null;
  }

  const decodedData = JSON.parse(
    enc.Utf8.stringify(enc.Base64.parse(base64data))
  );

  if (decodedData.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return decodedData.email;
};

export const getUserId = async (): Promise<string | null> => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    return userId;
  } catch (error) {
    console.error("Failed to get userId from AsyncStorage", error);
    return null;
  }
};
