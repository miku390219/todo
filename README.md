# TODO

依存パッケージなしで動くシンプルな TODO アプリです（HTML / CSS / JavaScript のみ）。

## 使い方

```sh
npm start        # http://localhost:8080 で起動（PORT=3000 npm start でポート変更）
npm test         # ロジックの単体テスト
```

ES Modules を使っているため、`index.html` をファイルとして直接開くのではなくサーバー経由で開いてください。

## 機能

- タスクの追加・完了切替・削除
- ダブルクリックで編集（Enter / フォーカスを外すと保存、Esc でキャンセル、空にすると削除）
- すべて完了 / 完了済みを一括削除
- 「すべて / 未完了 / 完了済み」の絞り込み（URL の `#/active` などで保持）
- `localStorage` に自動保存、別タブでの変更も反映
- ダークモード対応、日本語 IME の変換確定 Enter を誤って確定しない

## 構成

| ファイル | 役割 |
| --- | --- |
| `index.html` / `style.css` | 画面 |
| `src/todos.js` | 状態を操作する純粋関数（テスト対象） |
| `src/storage.js` | `localStorage` への保存と読み込み |
| `src/app.js` | DOM の描画とイベント処理 |
| `server.js` | 依存なしの静的ファイルサーバー |
| `test/` | `node --test` による単体テスト |
