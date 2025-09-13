# セットアップコマンド一覧

## プロジェクト初期化

```bash
# プロジェクトディレクトリ作成
mkdir sample-todo-app
cd sample-todo-app

# package.json初期化
npm init -y
```

## 基本依存関係のインストール

```bash
# Express本体
npm install express

# TypeScript関連
npm install --save-dev typescript @types/node @types/express

# 開発ツール
npm install --save-dev tsx nodemon

# セキュリティ・ミドルウェア
npm install cors helmet morgan dotenv

# 型定義
npm install --save-dev @types/cors @types/morgan
```

## Prisma・認証関連

```bash
# Prisma ORM
npm install prisma @prisma/client

# 認証関連
npm install bcryptjs jsonwebtoken

# 型定義
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

## Prismaセットアップ

```bash
# Prisma初期化
npx prisma init

# データベースマイグレーション
npx prisma migrate dev --name init

# Prismaクライアント生成
npx prisma generate
```

## Docker関連

```bash
# PostgreSQLコンテナ起動
docker-compose up postgres -d

# アプリケーション全体起動
docker-compose up

# コンテナ停止
docker-compose down
```

## 開発サーバー起動

```bash
# 開発モード
npm run dev

# 本番モード
npm start
```