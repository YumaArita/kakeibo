import axios from "axios";
import Constants from "expo-constants";
import { SENDGRID_API_KEY } from "@env";

export const sendVerificationEmail = async (email: string, token: string) => {
  const apiKey = SENDGRID_API_KEY;
  const url = "https://api.sendgrid.com/v3/mail/send";

  let verificationLink: string;
  console.log("Is development environment:", __DEV__);

  if (__DEV__) {
    const devHostUrl =
      (Constants.manifest as any)?.hostUri ?? "192.168.1.5:8081";
    verificationLink = `exp://${devHostUrl}/--/verify?token=${token}`;
  } else {
    // GitHub PagesのURLを使用
    verificationLink = `https://yumaarita.github.io/verify_email/?token=${token}`;
  }

  console.log("Verification link:", verificationLink);

  const data = {
    personalizations: [
      {
        to: [{ email }],
        subject: "メールアドレス確認",
      },
    ],
    from: { email: "kakeibo.simple@gmail.com" },
    content: [
      {
        type: "text/plain",
        value: `こちらのリンクをクリックしてメールアドレスを確認してください: ${verificationLink}`,
      },
    ],
  };

  try {
    await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Verification email sent.");
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("メールの送信に失敗しました");
  }
};
