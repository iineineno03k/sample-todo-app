# 🧪 初学者向けテストガイド

このドキュメントでは、Todoアプリのテストについて**初学者にも分かりやすく**説明します。

## 🎯 テストの目的

テストは「コードが正しく動作するか」を自動で確認するためのものです。

### なぜテストが重要？
1. **バグの早期発見** - コードを変更した時に既存機能が壊れていないか確認
2. **仕様の明確化** - テストコードが仕様書の役割を果たす
3. **リファクタリングの安全性** - 安心してコードを改善できる
4. **開発速度の向上** - 手動テストの時間を削減

## 🛠️ 使用技術

### Jest
- **概要**: JavaScript/TypeScript用のテストフレームワーク
- **公式サイト**: https://jestjs.io/
- **役割**: テストの実行、アサーション、モック機能

### Supertest
- **概要**: HTTP APIテスト用ライブラリ
- **GitHub**: https://github.com/ladjs/supertest
- **役割**: Express アプリケーションのAPIエンドポイントをテスト

### Prisma（テスト用）
- **役割**: テスト用データベースでのデータ操作
- **重要**: 本番DBとは分離されたテスト専用DB使用

## 📁 テストファイル構成

```
src/
├── routes/
│   ├── auth.ts          # 認証API
│   ├── auth.test.ts     # 認証APIのテスト
│   ├── todos.ts         # Todo API
│   └── todos.test.ts    # Todo APIのテスト
├── middleware/
│   ├── auth.ts          # 認証ミドルウェア
│   └── auth.test.ts     # 認証ミドルウェアのテスト
└── test-setup.ts        # テスト共通設定
```

## 🔧 テスト環境セットアップ

### 1. テスト用データベース起動
```bash
# テスト用PostgreSQL起動
npm run test:db:setup
```

### 2. テスト実行
```bash
# 全テスト実行
npm test

# ファイル監視モード（開発時推奨）
npm run test:watch

# カバレッジ付きテスト
npm run test:coverage
```

## 📝 テストの書き方

### 基本構造
```typescript
describe('テスト対象の説明', () => {
  
  beforeEach(async () => {
    // 各テストの前に実行される処理
    // DBのクリーンアップ、テストデータ作成など
  });

  it('✅ 成功ケースの説明', async () => {
    // 1. 事前条件の設定
    // 2. テスト実行
    // 3. 結果の検証
  });

  it('❌ 失敗ケースの説明', async () => {
    // エラーケースのテスト
  });
});
```

### 実際の例：認証APIテスト
```typescript
describe('認証API', () => {
  describe('POST /auth/register', () => {
    
    it('✅ 正常なユーザー登録ができる', async () => {
      // 1. テストデータ準備
      const userData = {
        username: 'testuser',
        password: 'testpass123'
      };

      // 2. API実行
      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201); // HTTPステータス201を期待

      // 3. レスポンス検証
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.username).toBe(userData.username);
    });

    it('❌ 既存のDBにユーザーがある場合、同じユーザー名で登録するとエラー', async () => {
      // 1. 事前条件：DBに既存ユーザーを作成
      await prisma.user.create({
        data: {
          username: 'existinguser',
          password: 'existingpass123'
        }
      });

      // 2. テスト実行：同じユーザー名で登録試行
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'existinguser', // 既存と同じ
          password: 'differentpass456'
        })
        .expect(409); // HTTPステータス409（競合）を期待

      // 3. エラーメッセージ検証
      expect(response.body.error).toBe('このユーザー名は既に使用されています');
    });
  });
});
```

## 🎨 テストのベストプラクティス

### 1. AAA パターン
- **Arrange（準備）**: テストデータ、事前条件の設定
- **Act（実行）**: テスト対象の機能を実行
- **Assert（検証）**: 結果が期待通りかチェック

### 2. 事前条件の明確化
❌ **悪い例**:
```typescript
it('ログインできる', async () => {
  // 何の条件でログインできるのか不明
});
```

✅ **良い例**:
```typescript
it('✅ DBに存在するユーザーの正しい認証情報でログインできる', async () => {
  // 事前条件：DBにユーザーが存在する
  // テスト内容：正しい認証情報を使用
  // 期待結果：ログイン成功
});
```

### 3. テストデータの作成方法

❌ **悪い例**（APIを使用）:
```typescript
// テスト対象のAPIを使ってテストデータを作成
await request(app).post('/auth/register').send(userData);
```

✅ **良い例**（Prismaを直接使用）:
```typescript
// Prismaで直接DBにデータ作成
await prisma.user.create({
  data: { username: 'testuser', password: 'testpass' }
});
```

### 4. テストの独立性
- 各テストは他のテストに依存しない
- `beforeEach`でDBをクリーンアップ
- テスト順序に関係なく実行可能

## 🔍 テストケースの考え方

### 成功ケース（Happy Path）
- 正常な入力での期待される動作
- 基本的な機能が動作することを確認

### 失敗ケース（Edge Cases）
- 無効な入力でのエラーハンドリング
- 境界値でのテスト
- 権限がない場合のテスト

### 例：Todo作成API
```typescript
// ✅ 成功ケース
it('認証済みユーザーがTodoを作成できる')
it('説明なしでもTodoを作成できる')

// ❌ 失敗ケース  
it('認証なしではTodoを作成できない')
it('タイトルが空の場合はエラー')
it('他のユーザーのTodoは表示されない')
```

## 🚀 テスト駆動開発（TDD）

### TDDの流れ
1. **Red**: 失敗するテストを書く
2. **Green**: テストを通す最小限のコードを書く
3. **Refactor**: コードを改善する

### 初学者へのアドバイス
1. **小さく始める** - 1つの機能から
2. **テストファーストを試す** - コードより先にテストを書く
3. **失敗を恐れない** - 赤いテストから始めるのが正常
4. **継続的に実行** - `npm run test:watch`を活用

## 🐛 よくあるトラブルと解決法

### 1. テストDBに接続できない
```bash
# テスト用DBが起動していない
npm run test:db:setup
```

### 2. テストが他のテストに影響される
```typescript
// beforeEachでDBクリーンアップを確認
beforeEach(async () => {
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();
});
```

### 3. 非同期処理のテストが不安定
```typescript
// async/awaitを正しく使用
it('非同期処理のテスト', async () => {
  const result = await someAsyncFunction();
  expect(result).toBe('expected');
});
```

## 📊 カバレッジの見方

```bash
npm run test:coverage
```

- **Statements**: 実行された文の割合
- **Branches**: 条件分岐の網羅率
- **Functions**: 実行された関数の割合
- **Lines**: 実行された行の割合

**目標**: 80%以上（ただし100%にこだわりすぎない）

## 🎓 学習の進め方

### Step 1: 既存テストを理解する
1. `auth.test.ts`を読んで理解
2. テストを実行して結果を確認
3. 一部を変更して動作を観察

### Step 2: 新しいテストを追加
1. 既存のテストケースを参考に
2. 新しい失敗ケースを追加
3. エッジケースを考えてテスト

### Step 3: TDDを実践
1. 新機能を追加する際にテストファーストで
2. 小さなサイクルで Red → Green → Refactor

## 📚 参考資料

- [Jest公式ドキュメント](https://jestjs.io/docs/getting-started)
- [Supertest GitHub](https://github.com/ladjs/supertest)
- [テスト駆動開発入門](https://www.amazon.co.jp/dp/4274217884)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)

テストは最初は難しく感じるかもしれませんが、慣れると開発の強力な味方になります。頑張って学習を進めてください！🎉