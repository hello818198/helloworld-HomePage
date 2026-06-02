# helloworld-HomePage

このリポジトリは、Node.js と Express、EJS を使ったシンプルなホームページです。

## 機能

- ホームページ表示
- `Klee One` フォントを使ったデモページ
- ローカルストレージに保存するメモ帳ページ
- ポップアップウィンドウで編集できるメモ機能
- `Nodemailer` を使ったお問い合わせフォーム

## インストールと実行

1. 依存関係をインストール

```bash
npm install
```

2. サーバーを起動

```bash
npm start
```

3. ブラウザでアクセス

```
http://localhost:3000
```

## 環境変数

アプリでは `.env` ファイルにメール設定を入力できます。リポジトリに用意した `.env.example` をコピーして、以下の項目を設定してください。

- `SMTP_HOST` - SMTP サーバーのホスト
- `SMTP_PORT` - SMTP ポート（通常 587 など）
- `SMTP_SECURE` - `true` / `false` / `starttls` / `tls`
- `SMTP_USER` - SMTP 認証ユーザー
- `SMTP_PASS` または `SMTP_PASSWORD` - SMTP 認証パスワード
- `CONTACT_EMAIL` - 受信先メールアドレス

もし `.env` を使わない場合、これらの環境変数を直接指定しても動作します。

環境変数が未設定の場合、Nodemailer のテストアカウントを使って動作確認できます。

## ルート

- `/` - ホーム
- `/klee-one` - Klee One フォントページ
- `/memo` - メモ帳
- `/contact` - お問い合わせフォーム
