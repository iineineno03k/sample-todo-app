# API使用方法（初学者向け）

このドキュメントでは、TodoアプリのAPIの使い方を**初学者にも分かりやすく**説明します。

## 🔐 認証エンドポイント

### ユーザー登録
新しいユーザーアカウントを作成します。

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "mypassword"
  }'
```

**成功レスポンス例:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx...",
    "username": "testuser"
  }
}
```

**エラーレスポンス例:**
```json
{
  "error": "このユーザー名は既に使用されています"
}
```

### ログイン
既存のユーザーでログインします。

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "mypassword"
  }'
```

**💡 重要:** レスポンスで返される`token`は、以降のAPI呼び出しで必要になります！

## Todoエンドポイント

**注意**: 以下のすべてのエンドポイントには認証が必要です。
ヘッダーに `Authorization: Bearer <token>` を含めてください。

### Todo一覧取得
```bash
curl -X GET http://localhost:3000/todos \
  -H "Authorization: Bearer <your-token>"
```

### Todo作成
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "新しいタスク",
    "description": "タスクの詳細説明"
  }'
```

### Todo更新
```bash
curl -X PUT http://localhost:3000/todos/<todo-id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "更新されたタスク",
    "description": "更新された説明"
  }'
```

### Todo状態変更
```bash
curl -X PUT http://localhost:3000/todos/<todo-id>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

**利用可能な状態:**
- `TODO`: 未着手
- `IN_PROGRESS`: 進行中
- `COMPLETED`: 完了

### Todo削除
```bash
curl -X DELETE http://localhost:3000/todos/<todo-id> \
  -H "Authorization: Bearer <your-token>"
```

### 単一Todo取得
```bash
curl -X GET http://localhost:3000/todos/<todo-id> \
  -H "Authorization: Bearer <your-token>"
```

## ヘルスチェック

```bash
curl -X GET http://localhost:3000/health
```

**レスポンス:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## エラーレスポンス

APIは以下の形式でエラーを返します：

```json
{
  "error": "エラーメッセージ"
}
```

**主なHTTPステータスコード:**
- `200`: 成功
- `201`: 作成成功
- `204`: 削除成功（レスポンスボディなし）
- `400`: リクエストエラー
- `401`: 認証が必要
- `403`: 認証トークンが無効
- `404`: リソースが見つからない
- `409`: リソースの競合（ユーザー名重複など）
- `500`: サーバーエラー
