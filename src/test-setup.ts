import { PrismaClient } from '@prisma/client';

// テスト用のPrismaクライアント
const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://todouser:todopass@localhost:5433/todoapp_test',
    },
  },
});

// 各テストの前にデータベースをクリーンアップ
beforeEach(async () => {
  // テーブルの順序に注意（外部キー制約のため）
  await testPrisma.todo.deleteMany();
  await testPrisma.user.deleteMany();
});

// すべてのテスト終了後にデータベース接続を閉じる
afterAll(async () => {
  await testPrisma.$disconnect();
});

// グローバルにprismaを利用可能にする
declare global {
  var prisma: PrismaClient;
}

global.prisma = testPrisma;
