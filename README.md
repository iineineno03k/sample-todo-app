# Todo App with Express & TypeScript

Express.js、TypeScript、Prisma、PostgreSQLを使用したTodoアプリケーションです。

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

## ドキュメント

- [セットアップコマンド](./doc/setup-commands.md)
- [使用技術概要](./doc/technologies.md)
- [アーキテクチャ設計](./doc/architecture.md)
- [API使用方法](./doc/api-usage.md)

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

### プロジェクト構造

```
src/
├── routes/          # APIルート
├── middleware/      # カスタムミドルウェア
├── types/          # TypeScript型定義
└── app.ts          # メインアプリケーション
```