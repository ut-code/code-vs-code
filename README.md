# Code vs Code (第73回駒場祭企画)

## 環境構築

- Node.js v16 のインストール
- `$ npm run setup`

## 開発

次のすべてのコマンドを同時に実行

- フロントエンド開発用サーバー起動 (ポート: 8080)
  - `npm run web:dev`
- フロントエンド自動型チェック
  - `npm run web:type-check:watch`
- バックエンド開発用サーバー起動 (ポート: 8081)
  - `npm run server:dev`
