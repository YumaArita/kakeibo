import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "8kbdyotb", // SanityのプロジェクトID
  dataset: "production", // 使用するデータセット
  useCdn: false, // 高速な読み取りアクセスのためにCDNを使用しない
  token:
    "skCtZ4fu9bZUP0Venaz0pbk8x7ICh1zRofwzXWt1Xzps8e5mbqtaf7dQ3l1YEeeqb0zaHOYdNSIDekGwtk5N2kmyJnWs4tk7wApnp75mW4SzwdSIYlBPoEL66KuDILwe2dLDv1B802TgJndRLFuGWNs4a6PBittLU7XSrykzk9bZQvY0Lqrn",
  apiVersion: "2023-07-15", // 使用するSanity APIのバージョン
});

export default client;
