# 初学者向け学習ガイド

このプロジェクトは**Web開発初学者**のための学習用Todoアプリです。実際の開発で使われる技術を、理解しやすい形で実装しています。

## 🎯 学習目標

- **Express.js**でのAPI開発
- **TypeScript**での型安全な開発
- **Prisma**でのデータベース操作
- **JWT**での認証システム
- **Docker**でのコンテナ化

## ⚠️ 重要な注意事項

このプロジェクトは**学習用**です。以下の点で本番環境とは異なります：

### セキュリティの簡素化
- **パスワードが平文保存** → 本番では必ずハッシュ化
- **JWTシークレットがハードコード** → 本番では環境変数
- **エラーメッセージが詳細** → 本番では情報を制限

## 📚 段階的学習アプローチ

### Step 1: プロジェクト構造を理解する
```
src/
├── app.ts              # メインアプリケーション
├── routes/
│   ├── auth.ts         # 認証API（登録・ログイン）
│   └── todos.ts        # Todo管理API
├── middleware/
│   └── auth.ts         # JWT認証ミドルウェア
└── types/
    └── index.ts        # TypeScript型定義
```

### Step 2: データベース設計を学ぶ
`prisma/schema.prisma`を見て、以下を理解しましょう：
- **User**と**Todo**の関係（1対多）
- **enum**を使った状態管理
- **外部キー制約**

### Step 3: 認証システムを理解する

#### 🔐 ユーザー登録の流れ
1. ユーザー名・パスワードを受け取る
2. 既存ユーザーをチェック
3. 新しいユーザーを作成
4. JWTトークンを生成
5. トークンをレスポンス

#### 🔑 ログインの流れ
1. ユーザー名・パスワードを受け取る
2. ユーザーを検索
3. パスワードを確認（平文比較）
4. JWTトークンを生成
5. トークンをレスポンス

#### 🔒 認証ミドルウェア
1. Authorizationヘッダーからトークン取得
2. JWTトークンを検証
3. ユーザー情報をリクエストに追加
4. 次の処理に進む

### Step 4: API設計を学ぶ

#### RESTful API設計
- `POST /auth/register` - ユーザー登録
- `POST /auth/login` - ログイン
- `GET /todos` - Todo一覧取得
- `POST /todos` - Todo作成
- `PUT /todos/:id` - Todo更新
- `DELETE /todos/:id` - Todo削除

#### HTTPステータスコード
- `200` - 成功
- `201` - 作成成功
- `400` - リクエストエラー
- `401` - 認証が必要
- `403` - 権限なし
- `404` - 見つからない
- `409` - 競合（重複など）
- `500` - サーバーエラー

## 🛠️ 実際に試してみよう

### 1. アプリケーション起動
```bash
# データベース起動
docker-compose up postgres -d

# マイグレーション実行
npm run db:migrate
npm run db:generate

# アプリケーション起動
npm run dev
```

### 2. APIテスト

#### ユーザー登録
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass"
  }'
```

#### ログイン
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass"
  }'
```

#### Todo作成（要認証）
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "初めてのTodo",
    "description": "学習用のタスクです"
  }'
```

## 🔍 コードリーディングのポイント

### 1. TypeScriptの型定義
`src/types/index.ts`で定義された型を確認：
- インターフェースの使い方
- enumの活用
- 型安全性の恩恵

### 2. 非同期処理
- `async/await`の使い方
- エラーハンドリング
- Promiseの理解

### 3. ミドルウェアパターン
- Express.jsのミドルウェア概念
- 認証ミドルウェアの実装
- リクエスト・レスポンスの流れ

### 4. データベース操作
- Prismaクライアントの使い方
- クエリの書き方
- リレーションの扱い

## 🚀 次のステップ

このプロジェクトを理解したら、以下にチャレンジしてみましょう：

### セキュリティ強化
1. パスワードハッシュ化（bcrypt）
2. 環境変数でのシークレット管理
3. レート制限の実装

### 機能拡張
1. Todo共有機能
2. カテゴリ分類
3. 期限設定
4. 通知機能

### フロントエンド開発
1. React/Vue.jsでのUI作成
2. 認証状態管理
3. API連携

### インフラ・デプロイ
1. Docker本格活用
2. CI/CD設定
3. クラウドデプロイ

## 📖 参考資料

- [Express.js公式ドキュメント](https://expressjs.com/)
- [Prisma公式ドキュメント](https://www.prisma.io/docs)
- [JWT入門](https://jwt.io/introduction)
- [TypeScript入門](https://www.typescriptlang.org/docs/)
- [RESTful API設計](https://restfulapi.net/)

## 💡 学習のコツ

1. **コードを写経する** - 理解しながら手で書く
2. **エラーを恐れない** - エラーメッセージから学ぶ
3. **小さく始める** - 一つずつ機能を理解
4. **実際に動かす** - 動作確認を怠らない
5. **質問する** - 分からないことは積極的に聞く

頑張って学習を進めてください！🎉