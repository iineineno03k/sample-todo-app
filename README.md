# 📝 初学者向けTodoアプリ（Express + TypeScript）

**Web開発初学者のための学習用プロジェクト**

Express.js、TypeScript、Prisma、PostgreSQLを使用したTodoアプリケーションです。
実際の開発で使われる技術を、**理解しやすい形**で実装しています。

## ⚠️ 学習用プロジェクトについて

このプロジェクトは**教育目的**で作成されており、以下の点で本番環境とは異なります：
- パスワードが平文で保存される（学習の簡素化のため）
- JWTシークレットがハードコードされている
- エラーメッセージが詳細に表示される

**本番環境では絶対に使用しないでください。**

## 機能

- **認証機能**
  - ユーザー登録
  - ログイン
  - JWT認証

- **Todo管理**
  - Todo作成・更新・削除
  - 状態管理（TODO → IN_PROGRESS → COMPLETED）
  - ユーザー別Todo管理

## 技術スタック

- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + bcryptjs
- **Container**: Docker + Docker Compose

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env`ファイルを確認し、必要に応じて調整してください。

### 3. データベースの起動
```bash
docker-compose up postgres -d
```

### 4. データベースマイグレーション
```bash
npm run db:migrate
npm run db:generate
```

### 5. アプリケーションの起動
```bash
# 開発モード
npm run dev

# 本番モード
npm start
```

## Docker での実行

```bash
# 全サービス起動
docker-compose up

# バックグラウンド実行
docker-compose up -d

# 停止
docker-compose down
```

## API仕様

詳細なAPI仕様は [doc/api-usage.md](./doc/api-usage.md) を参照してください。

## 📚 学習ドキュメント

### 初学者向け
- **[🎯 学習ガイド](./doc/learning-guide.md)** ← まずはここから！
- [API使用方法](./doc/api-usage.md) - 実際にAPIを試してみよう

### 技術詳細
- [セットアップコマンド](./doc/setup-commands.md)
- [使用技術概要](./doc/technologies.md)
- [アーキテクチャ設計](./doc/architecture.md)
- [リンター設定](./doc/linting.md)

## 開発

### データベース管理

```bash
# Prisma Studio起動
npm run db:studio

# マイグレーション作成
npm run db:migrate

# Prismaクライアント再生成
npm run db:generate
```

### コード品質管理

```bash
# リンティング
npm run lint

# 自動修正
npm run lint:fix

# フォーマット
npm run format
```

### プロジェクト構造

```
src/
├── routes/          # APIルート
├── middleware/      # カスタムミドルウェア
├── types/          # TypeScript型定義
└── app.ts          # メインアプリケーション
```
