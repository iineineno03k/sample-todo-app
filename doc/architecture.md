# アーキテクチャ設計

## プロジェクト構造

```
sample-todo-app/
├── src/
│   ├── routes/          # APIルート定義
│   ├── middleware/      # カスタムミドルウェア
│   ├── types/          # TypeScript型定義
│   └── app.ts          # メインアプリケーション
├── prisma/
│   ├── schema.prisma   # データベーススキーマ
│   └── migrations/     # マイグレーションファイル
├── doc/                # ドキュメント
├── docker-compose.yml  # Docker設定
├── Dockerfile         # アプリケーションコンテナ設定
└── .env              # 環境変数
```

## データベース設計

### User テーブル
- `id`: 主キー（UUID）
- `username`: ユーザー名（ユニーク）
- `password`: パスワード（ハッシュ化）
- `createdAt`: 作成日時
- `updatedAt`: 更新日時

### Todo テーブル
- `id`: 主キー（UUID）
- `title`: タイトル
- `description`: 説明（オプション）
- `status`: ステータス（TODO, IN_PROGRESS, COMPLETED）
- `userId`: ユーザーID（外部キー）
- `createdAt`: 作成日時
- `updatedAt`: 更新日時

## API設計

### 認証エンドポイント
- `POST /auth/register` - ユーザー登録
- `POST /auth/login` - ログイン

### Todoエンドポイント
- `GET /todos` - Todo一覧取得
- `POST /todos` - Todo作成
- `PUT /todos/:id` - Todo更新
- `PUT /todos/:id/status` - ステータス変更
- `DELETE /todos/:id` - Todo削除

## セキュリティ考慮事項

1. **パスワード管理**: bcryptjsによるハッシュ化
2. **認証**: JWT（JSON Web Token）使用
3. **CORS**: 適切なCORS設定
4. **ヘルメット**: セキュリティヘッダー設定
5. **環境変数**: 機密情報の環境変数管理

## 状態遷移

```
TODO → IN_PROGRESS → COMPLETED
  ↓         ↓           ↓
DELETE    DELETE     DELETE
```

Todoの状態は以下の遷移が可能：
- TODO → IN_PROGRESS
- IN_PROGRESS → COMPLETED
- IN_PROGRESS → TODO（戻し）
- 任意の状態 → DELETE