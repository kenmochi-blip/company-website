# 歴読ウォーク - 公式サイト

歴史と散策を愛する人々のためのコミュニティサイト

## 📁 ディレクトリ構造

```
rekidokuwalk/
├── index.html          # メインHTMLファイル
├── css/
│   └── style.css       # スタイルシート
├── js/
│   └── script.js       # JavaScript
├── images/             # 画像ファイル用ディレクトリ
│   ├── event-placeholder-1.jpg
│   ├── event-placeholder-2.jpg
│   └── event-placeholder-3.jpg
└── README.md           # このファイル
```

## 🎨 デザインコンセプト

### カラーパレット
- **プライマリカラー**: `#8B4513` (サドルブラウン) - 歴史的な温かみ
- **セカンダリカラー**: `#2F4F4F` (ダークスレートグレー) - 落ち着いた雰囲気
- **アクセントカラー**: `#CD853F` (ペルー) - 優しいゴールド
- **背景色**: `#FAF8F3` (和紙のような温かみのある白)

### フォント
- **見出し**: Noto Serif JP (明朝体) - 歴史的・格調高い印象
- **本文**: Noto Sans JP (ゴシック体) - 読みやすさ重視

## ✨ 主な機能

### 実装済み機能
- ✅ レスポンシブデザイン（PC・タブレット・スマホ対応）
- ✅ モバイルメニュー（ハンバーガーメニュー）
- ✅ スムーススクロール
- ✅ ページトップへ戻るボタン
- ✅ スクロールアニメーション
- ✅ SEO対策（noindex, nofollow設定）

### セクション
1. **ヘッダー** - ロゴとナビゲーション
2. **ヒーローセクション** - メインビジュアルとキャッチコピー
3. **歴読ウォークとは** - 活動紹介と3つの特徴
4. **イベント情報** - イベントカード表示（3つのサンプル）
5. **お問い合わせ** - メールアドレス表示
6. **フッター** - リンクとSNSアイコン

## 🖼️ 画像の準備

以下の画像を `images/` ディレクトリに配置してください：

1. **event-placeholder-1.jpg** - 日本橋のイベント画像（推奨サイズ: 800x500px）
2. **event-placeholder-2.jpg** - 鎌倉のイベント画像（推奨サイズ: 800x500px）
3. **event-placeholder-3.jpg** - 京都のイベント画像（推奨サイズ: 800x500px）

※画像がない場合は、グラデーション背景が表示されます

## 🚀 デプロイ方法

### GitHub経由でアップロード

1. **リポジトリの準備**
```bash
cd rekidokuwalk
git init
git add .
git commit -m "Initial commit: 歴読ウォーク公式サイト"
```

2. **GitHubリポジトリにプッシュ**
```bash
git remote add origin [your-repository-url]
git branch -M main
git push -u origin main
```

3. **サーバーへのアップロード**
- FTPまたはサーバーの管理画面を使用
- `https://smartandsmooth.com/rekidokuwalk/` ディレクトリに全ファイルをアップロード

## 📝 カスタマイズガイド

### メールアドレスの変更
`index.html` の line 208 を編集：
```html
<a href="mailto:info@rekidokuwalk.example.com" class="contact-link">
  info@rekidokuwalk.example.com
</a>
```

### イベント情報の追加・変更
`index.html` の Events Section（line 135-199）を編集。
イベントカードをコピー＆ペーストして増やすことができます。

### 色の変更
`css/style.css` の `:root` セクション（line 5-22）でカラー変数を変更：
```css
:root {
    --primary-color: #8B4513;
    --secondary-color: #2F4F4F;
    --accent-color: #CD853F;
    /* ... */
}
```

### SNSリンクの設定
`index.html` の Footer Section（line 247-251）を編集：
```html
<a href="https://twitter.com/your-account" aria-label="Twitter">
    <i class="fab fa-twitter"></i>
</a>
```

## 🔧 今後の拡張案

### 検討中の機能
- [ ] お問い合わせフォームの実装
- [ ] イベントカレンダー機能
- [ ] 過去のイベントレポートページ
- [ ] 会員登録・ログイン機能
- [ ] ブログ・記事投稿機能
- [ ] ギャラリーページ
- [ ] FAQ（よくある質問）ページ

### 技術的な拡張
- [ ] CMS導入（WordPress, microCMS等）
- [ ] イベント予約システム
- [ ] メールマガジン配信機能
- [ ] Google Maps API連携（散策ルート表示）

## 📱 動作確認済み環境

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- iOS Safari (iOS 14+)
- Android Chrome (Android 10+)

## 📄 ライセンス

© 2025 歴読ウォーク All Rights Reserved.

## 📞 サポート

質問や問題がある場合は、プロジェクト管理者にお問い合わせください。