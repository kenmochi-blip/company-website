# Smart & Smooth - 会計研修サービスWebサイト

## 📋 プロジェクト概要

Smart & Smoothは、元・上場企業副社長の公認会計士による法人向け会計研修サービスのWebサイトです。このプロジェクトは2つのページで構成されています：

- **メインLP** (`/`) - 法人向け会計研修サービスの紹介ページ
- **体験会ページ** (`/trial/`) - 個人向け体験会の開催情報と申し込みページ

## 🌐 デプロイURL構造

- メインLP: `https://yourdomain.com/`
- 体験会ページ: `https://yourdomain.com/trial/`

## 📁 プロジェクト構造

```
smartandsmooth/
├── index.html              # メインLP
├── css/
│   └── style.css          # メインLPのスタイル
├── js/
│   └── script.js          # メインLPのJavaScript
├── trial/                 # 体験会ページ（サブディレクトリ）
│   ├── index.html        # 体験会ページ
│   ├── css/
│   │   └── style.css    # 体験会ページのスタイル
│   └── js/
│       └── script.js     # 体験会ページのJavaScript
└── README.md             # このファイル
```

## ✨ 実装済み機能

### メインLP (`/`)

1. **セクション構成**
   - Hero（ヒーロー）セクション
   - About（事業概要）セクション
   - Strengths（強み）セクション
   - Programs（研修プログラム）セクション
   - Profile（講師紹介）セクション
   - Testimonials（実績・お客様の声）セクション
   - Contact（お問い合わせ）セクション

2. **外部連携**
   - Google Analytics (G-VB7F17M5ZF) による訪問者トラッキング
   - Formspree (xrbogwpd) によるコンタクトフォーム
   - 個人情報取り扱いポリシー（Google Drive）へのリンク

3. **デザイン特徴**
   - ブランドカラー: グラデーション (#00D4FF → #0052FF)
   - レスポンシブデザイン（PC/タブレット/モバイル対応）
   - スムーズなスクロールアニメーション
   - モバイル用ハンバーガーメニュー

4. **ナビゲーション**
   - 体験会ページへのリンク（`/trial/`）

### 体験会ページ (`/trial/`)

1. **セクション構成**
   - Hero（ヒーロー）セクション - 体験会の概要
   - Overview（体験会について）セクション
   - Program（プログラム詳細）セクション
   - Schedule（開催スケジュール）セクション - Google Sheets連携
   - CTA（お申し込み）セクション

2. **外部連携**
   - Google Analytics (G-VB7F17M5ZF) による訪問者トラッキング
   - Google Sheets APIによる開催日程の動的取得
     - Apps Script URL: `https://script.google.com/macros/s/AKfycby9975bepEECAXCmlMHQIUnt1aT9o46QEADmnrS8H_HD02_AfeeEgQNWm1CISzVPhwxEQ/exec`
   - Google Formsによる申し込み受付
     - Form URL: `https://docs.google.com/forms/d/1_YgIxqHqt1CLB086O8wZv1JOtzoYJYblzj4OFD_-5PU/viewform`

3. **主要機能**
   - 開催日程の自動取得と表示
   - 過去の日程の自動フィルタリング
   - 定員管理と残席表示
   - 満席時の申し込みボタン無効化
   - フォールバックデータによる安定稼働

4. **デザイン特徴**
   - メインLPと統一されたブランドカラー
   - レスポンシブデザイン
   - スクロールアニメーション
   - メインLPへの戻りリンク

## 🎨 デザインシステム

### カラーパレット

```css
/* ブランドグラデーション */
--primary-light: #00D4FF;
--primary-deep: #0052FF;
--primary-gradient: linear-gradient(135deg, #00D4FF 0%, #0052FF 100%);

/* ニュートラルカラー */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-700: #374151;
--gray-900: #111827;
```

### タイポグラフィ

- フォント: Noto Sans JP（Google Fonts）
- ウェイト: 300, 400, 500, 600, 700, 900

### アイコン

- Font Awesome 6.4.0（CDN経由）

## 🔧 カスタマイズガイド

### 1. ロゴの変更

**メインLP:**
```html
<!-- index.html 29行目 -->
<img src="YOUR_LOGO_URL" alt="Smart & Smooth Logo">
```

**体験会ページ:**
```html
<!-- trial/index.html 40行目 -->
<img src="YOUR_LOGO_URL" alt="Smart & Smooth">
```

### 2. Google Analyticsの設定

両ページの`<head>`セクション内のトラッキングIDを変更:
```javascript
gtag('config', 'YOUR_GA_TRACKING_ID');
```

### 3. Formspreeの設定

メインLPのコンタクトフォーム（index.html 569行目）:
```html
<form action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">
```

### 4. 体験会スケジュールのGoogle Sheets設定

体験会ページのJavaScript（trial/js/script.js 7行目）:
```javascript
googleAppsScriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL',
```

**Google Sheets の期待されるデータ形式:**
```json
{
  "success": true,
  "schedules": [
    {
      "date": "2025-02-15",
      "time": "14:00-15:30",
      "capacity": 10,
      "registered": 3
    }
  ]
}
```

### 5. ブランドカラーの変更

両ページのCSS変数を変更:
- `css/style.css`（メインLP）
- `trial/css/style.css`（体験会ページ）

```css
:root {
    --primary-light: #00D4FF;  /* ライトブルー */
    --primary-deep: #0052FF;   /* ディープブルー */
    --primary-gradient: linear-gradient(135deg, #00D4FF 0%, #0052FF 100%);
}
```

## 🚀 GitHub Pagesへのデプロイ手順

### 1. GitHubリポジトリの作成

```bash
# リポジトリを初期化
git init

# すべてのファイルを追加
git add .

# コミット
git commit -m "Initial commit: Smart & Smooth website"

# GitHubリポジトリを追加（リポジトリURLを置き換えてください）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# プッシュ
git branch -M main
git push -u origin main
```

### 2. GitHub Pagesの有効化

1. GitHubリポジトリページにアクセス
2. **Settings** タブをクリック
3. 左サイドバーの **Pages** をクリック
4. **Source** で `main` ブランチを選択
5. **Save** をクリック

### 3. カスタムドメインの設定（オプション）

1. GitHub Pagesの設定画面で **Custom domain** に `smartandsmooth.com` を入力
2. DNSプロバイダーで以下のレコードを設定:
   ```
   A Record:
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   
   CNAME Record:
   www → YOUR_USERNAME.github.io
   ```

### 4. デプロイ完了

- 数分後、`https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/` でサイトが公開されます
- カスタムドメインを設定した場合: `https://smartandsmooth.com/`

## 📱 ブラウザ対応

- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）
- モバイルブラウザ（iOS Safari, Chrome for Android）

## 🔒 セキュリティとプライバシー

- Formspreeによるフォームスパム対策
- Google Analytics によるプライバシー準拠のトラッキング
- 個人情報取り扱いポリシーへのリンク設置
- HTTPSによる暗号化通信（GitHub Pages標準）

## 📊 パフォーマンス最適化

- CSS/JSの最小化
- 画像の遅延読み込み（Lazy Loading）
- フォントの最適化（Google Fonts display=swap）
- CDNの活用（Font Awesome、Google Fonts）

## 🛠️ トラブルシューティング

### スケジュールが表示されない場合

1. Google Apps ScriptのURLが正しく設定されているか確認
2. ブラウザのコンソールでエラーを確認
3. フォールバックデータが表示されているか確認

### フォームが送信できない場合

1. Formspreeのエンドポイントが正しいか確認
2. ブラウザのコンソールでネットワークエラーを確認
3. Formspreeのダッシュボードで設定を確認

### モバイルでレイアウトが崩れる場合

1. ブラウザのキャッシュをクリア
2. デベロッパーツールで該当要素を検証
3. CSSのメディアクエリを確認

## 📞 サポート情報

### 運営者情報
- サービス名: Smart & Smooth
- 代表者: 剱持 健（けんもち けん）
- 資格: 公認会計士
- 経歴: 元・上場企業副社長、IPO実現の当事者

### お問い合わせ
- ウェブサイト: メインLPのコンタクトフォームをご利用ください

## 📝 更新履歴

### 2025年版
- メインLPの作成
- 体験会ページの統合
- Google Sheets連携機能の実装
- レスポンシブデザインの最適化
- GitHub Pages対応の完了

## 📄 ライセンス

© 2025 Smart & Smooth. All rights reserved.

---

**注意:** このプロジェクトは静的HTMLサイトです。サーバーサイド処理が必要な機能（決済処理、データベース連携など）を追加する場合は、別途バックエンドシステムの構築が必要です。
