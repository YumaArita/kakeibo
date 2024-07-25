import axios from "axios";
import { generateVerificationToken } from "./auth";
import Constants from "expo-constants";
import { SENDGRID_API_KEY, BITLY_ACCESS_TOKEN } from "@env";

export const sendVerificationEmail = async (email: string, token: string) => {
  const apiKey = SENDGRID_API_KEY;
  const bitlyToken = BITLY_ACCESS_TOKEN;
  const bitlyUrl = "https://api-ssl.bitly.com/v4/shorten";
  const url = "https://api.sendgrid.com/v3/mail/send";

  let verificationLink: string;
  console.log("Is development environment:", __DEV__);

  if (__DEV__) {
    // 開発環境
    const devHostUrl = Constants.manifest?.hostUri ?? "192.168.1.5:8081";
    verificationLink = `exp://${devHostUrl}/--/verify?token=${token}`;
  } else {
    // 本番環境
    const longUrl = `expensetracker://verify?token=${token}`;

    try {
      const bitlyResponse = await axios.post(
        bitlyUrl,
        {
          long_url: longUrl,
          domain: "bit.ly",
          title: "Email Verification Link",
        },
        {
          headers: {
            Authorization: `Bearer ${bitlyToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      verificationLink = bitlyResponse.data.link;
    } catch (error) {
      console.error("Failed to create Bitly link:", error);
      // Bitly作成に失敗した場合は元のURLを使用
      verificationLink = longUrl;
    }
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
