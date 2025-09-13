module.exports = {
  // TypeScript用の設定
  preset: 'ts-jest',
  testEnvironment: 'node',

  // テストファイルの場所（各ディレクトリの.test.tsファイル）
  testMatch: ['**/src/**/*.test.ts'],

  // カバレッジ設定
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts', // テストファイルは除外
  ],

  // セットアップファイル
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  
  // テスト環境変数設定
  setupFiles: ['<rootDir>/jest.setup.js'],

  // モジュールパス設定
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // タイムアウト設定（データベース操作のため）
  testTimeout: 10000,
};
