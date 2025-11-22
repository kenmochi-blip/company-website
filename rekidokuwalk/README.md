# 大人の寺子屋「歴読ウォーク」- 公式サイト

完全紹介制・歴史探訪コミュニティの公式ウェブサイト

## 📁 ディレクトリ構造

```
rekidokuwalk/
├── index.html          # メインHTMLファイル
├── css/
│   └── style.css       # スタイルシート（30KB）
├── js/
│   └── script.js       # JavaScript（9.7KB）
├── images/             # 画像ファイル用ディレクトリ
│   └── .gitkeep
└── README.md           # このファイル
```

## 🚀 デプロイ方法

### GitHub経由でアップロード（推奨）

1. **ZIPファイルを解凍**
```bash
unzip rekidokuwalk.zip
cd rekidokuwalk
```

2. **既存リポジトリにアップロード**
```bash
# 既存のリポジトリをクローン
git clone https://github.com/[your-username]/company-website.git
cd company-website

# rekidokuwalフォルダをコピー
cp -r ../rekidokuwalk ./

# Gitにコミット
git add rekidokuwalk/
git commit -m "Add 大人の寺子屋「歴読ウォーク」community site"
git push origin main
```

3. **アクセスURL**
```
https://smartandsmooth.com/rekidokuwalk/
```

### 完成後のサーバー構造

```
smartandsmooth.com/
├── index.html              # メインLP（既存）
├── trial/                  # 既存フォルダ
└── rekidokuwalk/           # 【NEW】今回追加
    ├── index.html
    ├── css/
    ├── js/
    └── images/
```

## 🎨 デザインコンセプト

### ブランドカラー - ジャパンブルー × モダン和風

- **プライマリカラー**: `#1B3D6D` (ジャパンブルー - 深い藍色)
- **セカンダリカラー**: `#5D7C9A` (優しいグレイッシュブルー)
- **アクセントカラー**: `#C8A882` (金茶 - 上品なゴールド)
- **背景色**: `#FFFFFF` (白) / `#FAF8F5` (クリーム色)

### フォント
- **見出し**: Noto Serif JP (明朝体) - 格調高く歴史的
- **本文**: Noto Sans JP (ゴシック体) - 読みやすさ重視
- **モダン**: Zen Kaku Gothic New - 現代的な印象

## ✨ 主な機能

- ✅ 完全レスポンシブデザイン（PC・タブレット・スマホ対応）
- ✅ モバイルメニュー（ハンバーガーメニュー）
- ✅ スムーススクロール
- ✅ ページトップへ戻るボタン
- ✅ スクロールアニメーション（フェードイン効果）
- ✅ パララックス効果（ヒーローセクション）
- ✅ SEO対策（noindex, nofollow設定）

## 📝 カスタマイズガイド

### 1. メールアドレスの変更
`index.html` の2箇所を編集：

```html
<!-- Contact Section: line 520付近 -->
<a href="mailto:info@rekidokuwalk.example.com" class="contact-link">
  info@rekidokuwalk.example.com
</a>
```

### 2. 共同代表の情報追加
`index.html` のOrganizer Section（line 486-501付近）を編集：

```html
<div class="organizer-role">共同代表</div>
<h3 class="organizer-name">〇〇 〇〇</h3>
<div class="organizer-bio">
    <p>プロフィール文...</p>
</div>
```

### 3. 会員規約PDFのリンク設定
規約PDFを作成後、`index.html` のFooterセクションを編集：

```html
<a href="pdf/membership-rules.pdf" class="footer-doc-link" target="_blank">
    <i class="fas fa-file-alt"></i>
    会員規約（PDF）
</a>
```

### 4. 色の変更
`css/style.css` の `:root` セクションでカラー変数を変更：

```css
:root {
    --primary-color: #1B3D6D;      /* メインカラー */
    --accent-color: #C8A882;       /* アクセントカラー */
}
```

## 🖼️ 画像の準備（今後）

以下の画像を `images/` ディレクトリに配置することを推奨：

1. **hero-bg.jpg** - ヒーロー背景（推奨: 1920×1080px）
2. **organizer-ken.jpg** - 剱持さんのプロフィール写真（推奨: 500×500px）
3. **co-organizer.jpg** - 共同代表のプロフィール写真（推奨: 500×500px）

※画像がない場合は、プレースホルダー（グラデーション）で対応

## 🔧 今後の拡張案

### Phase 1（短期 - 1ヶ月以内）
- [ ] プロフィール写真追加
- [ ] 会員規約PDF作成・リンク設定
- [ ] プライバシーポリシーページ
- [ ] 正式メールアドレス設定

### Phase 2（中期 - 3ヶ月以内）
- [ ] 過去の開催実績ページ
- [ ] 推奨図書リストページ
- [ ] お問い合わせフォーム実装
- [ ] ブログ・活動レポート

### Phase 3（長期 - 6ヶ月以内）
- [ ] 会員専用ページ
- [ ] イベント予約システム
- [ ] オンライン決済機能
- [ ] CMS導入検討

## 📱 動作確認済み環境

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- iOS Safari (iOS 14+)
- Android Chrome (Android 10+)

## 📞 サポート

サイトの更新やカスタマイズについてご質問がある場合は、お気軽にお問い合わせください。

---

**運営**: 合同会社Smart & Smooth  
**代表**: 剱持 健  
**© 2025 大人の寺子屋「歴読ウォーク」 All Rights Reserved.**
