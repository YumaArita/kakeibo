# シンプルでめんどくさくない家計簿アプリの開発

## 使用技術

- React Native
  - Expo
- Sanity

```
ExpenseTracker/
├── src/                     # ソースコードのルートディレクトリ
│   ├── assets/              # 画像やフォントなどの静的ファイル
│   ├── components/          # 再利用可能なUIコンポーネント
│   ├── screens/             # 各画面のコンポーネント
│   │   ├── LoginScreen.tsx  # ログイン画面
│   │   ├── HomeScreen.tsx   # ホーム画面
│   │   └── ...
│   ├── navigation/          # ナビゲーション関連の設定
│   │   ├── AppNavigator.tsx  # アプリのメインナビゲーター
│   │   └── ...
│   ├── api/                 # API呼び出しを管理する関数
│   ├── store/               # Reduxやその他の状態管理の設定
│   └── utils/               # ユーティリティ関数
├── app.json                 # アプリケーション設定
├── App.tsx              # アプリケーションのエントリーポイント
├── index.ts                 # ルートファイル、Appコンポーネントを登録
└── package.json             # プロジェクトの依存関係やスクリプト

```
