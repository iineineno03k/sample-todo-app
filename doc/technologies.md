# 使用技術概要

## Express.js
- **概要**: Node.js用の軽量で柔軟なWebアプリケーションフレームワーク
- **公式サイト**: https://expressjs.com/
- **使用理由**: シンプルなAPI作成、豊富なミドルウェア、TypeScriptサポート
- **主な機能**: ルーティング、ミドルウェア、テンプレートエンジン統合

## Prisma
- **概要**: 次世代のTypeScript/JavaScript用ORM（Object-Relational Mapping）
- **公式サイト**: https://www.prisma.io/
- **使用理由**: 型安全なデータベースアクセス、自動マイグレーション、直感的なAPI
- **主な機能**: 
  - スキーマファーストのアプローチ
  - 自動生成されるタイプセーフなクライアント
  - データベースマイグレーション管理

## PostgreSQL
- **概要**: オープンソースのリレーショナルデータベース管理システム
- **公式サイト**: https://www.postgresql.org/
- **使用理由**: 高い信頼性、豊富な機能、JSON型サポート、スケーラビリティ
- **主な機能**: ACID準拠、複雑なクエリサポート、拡張性

## Docker & Docker Compose
- **概要**: コンテナ化技術とマルチコンテナアプリケーション管理ツール
- **公式サイト**: https://www.docker.com/
- **使用理由**: 環境の一貫性、簡単なデプロイ、開発環境の統一
- **主な機能**: 
  - アプリケーションのコンテナ化
  - 複数サービスの統合管理
  - 環境変数管理

## TypeScript
- **概要**: JavaScriptに静的型付けを追加したプログラミング言語
- **公式サイト**: https://www.typescriptlang.org/
- **使用理由**: 型安全性、開発時のエラー検出、IDEサポート向上
- **主な機能**: 静的型チェック、最新のECMAScript機能サポート

## 認証関連ライブラリ

### bcryptjs
- **概要**: パスワードハッシュ化ライブラリ
- **GitHub**: https://github.com/dcodeIO/bcrypt.js
- **使用理由**: セキュアなパスワード保存、ソルト自動生成

### jsonwebtoken
- **概要**: JSON Web Token（JWT）の実装
- **GitHub**: https://github.com/auth0/node-jsonwebtoken
- **使用理由**: ステートレス認証、トークンベース認証の実装

## 開発ツール

### tsx
- **概要**: TypeScriptファイルを直接実行するツール
- **GitHub**: https://github.com/esbuild-kit/tsx
- **使用理由**: 高速なTypeScript実行、開発効率向上

### nodemon
- **概要**: ファイル変更を監視してアプリケーションを自動再起動
- **公式サイト**: https://nodemon.io/
- **使用理由**: 開発時の生産性向上、自動リロード機能