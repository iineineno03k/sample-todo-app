# Biome リンター設定

## Biomeについて

**Biome**は、JavaScript/TypeScript用の高速なリンター・フォーマッターです。ESLintとPrettierの代替として設計されており、設定が簡単で高速に動作します。

- **公式サイト**: https://biomejs.dev/
- **GitHub**: https://github.com/biomejs/biome

## インストール

```bash
npm install --save-dev @biomejs/biome
```

## 設定ファイル

`biome.json`でプロジェクト固有の設定を管理：

```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "warn"
      },
      "style": {
        "useConst": "error",
        "useTemplate": "error"
      },
      "correctness": {
        "noUnusedVariables": "error"
      }
    }
  }
}
```

## 利用可能なコマンド

### リンティング
```bash
# コードをチェック
npm run lint

# 自動修正可能な問題を修正
npm run lint:fix

# 危険な修正も含めて実行
biome check --write --unsafe .
```

### フォーマッティング
```bash
# コードをフォーマット
npm run format

# 特定のファイルをフォーマット
biome format --write src/app.ts
```

### 個別実行
```bash
# リンティングのみ
biome lint .

# フォーマットのみ
biome format .

# チェック（リント + フォーマット）
biome check .
```

## 主要なルール設定

### 推奨設定
- `recommended: true` - Biome推奨ルールを有効化

### カスタムルール
- `noExplicitAny: "warn"` - `any`型の使用を警告
- `useConst: "error"` - `let`の代わりに`const`を強制
- `useTemplate: "error"` - 文字列連結の代わりにテンプレートリテラルを強制
- `noUnusedVariables: "error"` - 未使用変数をエラー

### フォーマット設定
- `indentStyle: "space"` - インデントにスペースを使用
- `indentWidth: 2` - インデント幅2スペース
- `lineWidth: 100` - 行の最大幅100文字
- `quoteStyle: "single"` - シングルクォートを使用
- `semicolons: "always"` - セミコロンを常に付与
- `trailingCommas: "es5"` - ES5互換のトレイリングカンマ

## エディタ統合

### VS Code
1. Biome拡張機能をインストール
2. 設定で自動フォーマットを有効化：
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true
}
```

### その他のエディタ
- **Neovim**: `nvim-lspconfig`でBiome LSPを設定
- **Sublime Text**: Biomeパッケージを使用
- **WebStorm**: Biomeプラグインを使用

## CI/CDでの使用

```yaml
# GitHub Actions例
- name: Run Biome
  run: |
    npm ci
    npm run lint
    npm run format -- --check
```

## 移行について

### ESLint/Prettierからの移行
```bash
# ESLint設定を移行
biome migrate eslint

# Prettier設定を移行  
biome migrate prettier
```

## トラブルシューティング

### よくある問題
1. **設定ファイルエラー**: `biome.json`の構文を確認
2. **パフォーマンス**: 大きなファイルは`--max-diagnostics`で制限
3. **型エラー**: TypeScript設定との競合を確認

### デバッグ
```bash
# 詳細ログ出力
biome check --verbose .

# 設定確認
biome explain .
```