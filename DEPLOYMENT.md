# 🚀 Smart & Smooth デプロイメントガイド

## 📦 GitHub へのアップロード手順

### ステップ1: リポジトリの作成

1. [GitHub](https://github.com) にログイン
2. 右上の「+」ボタンから「New repository」を選択
3. リポジトリ名を入力（例: `smartandsmooth`）
4. 「Public」を選択（GitHub Pages の無料利用に必要）
5. 「Create repository」をクリック

### ステップ2: ローカルでの準備

プロジェクトフォルダで以下のコマンドを実行：

```bash
# Gitの初期化
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: Smart & Smooth website with trial page"

# リモートリポジトリを追加（YOUR_USERNAMEとYOUR_REPOSITORYを置き換え）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# メインブランチに変更
git branch -M main

# プッシュ
git push -u origin main
```

### ステップ3: GitHub Pages の有効化

1. GitHubリポジトリページで「Settings」タブをクリック
2. 左メニューから「Pages」を選択
3. 「Source」セクションで：
   - Branch: `main`
   - Folder: `/ (root)`
4. 「Save」をクリック
5. 数分後、サイトが公開されます

### ステップ4: 公開URLの確認

- デフォルトURL: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`
- メインLP: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`
- 体験会ページ: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/trial/`

## 🌐 カスタムドメインの設定（オプション）

### DNSレコードの設定

あなたのドメインプロバイダーの管理画面で以下を設定：

#### A レコード
```
@    A    185.199.108.153
@    A    185.199.109.153
@    A    185.199.110.153
@    A    185.199.111.153
```

#### CNAME レコード
```
www    CNAME    YOUR_USERNAME.github.io.
```

### GitHub側の設定

1. リポジトリの「Settings」→「Pages」へ
2. 「Custom domain」に `smartandsmooth.com` を入力
3. 「Save」をクリック
4. 「Enforce HTTPS」にチェック（DNSの設定が反映されたら）

### 反映時間

- DNSの反映: 最大48時間（通常は数時間）
- SSL証明書の発行: DNS反映後、自動的に数分で完了

## 📁 デプロイされるファイル構造

```
GitHub Repository (main branch)
│
├── index.html              ← メインLPのルート
├── css/
│   └── style.css          ← メインLPのスタイル
├── js/
│   └── script.js          ← メインLPのスクリプト
├── trial/                  ← 体験会ページのサブディレクトリ
│   ├── index.html         ← 体験会ページ（/trial/でアクセス）
│   ├── css/
│   │   └── style.css     ← 体験会ページのスタイル
│   └── js/
│       └── script.js      ← 体験会ページのスクリプト
├── README.md              ← プロジェクト説明
└── DEPLOYMENT.md          ← このファイル
```

## 🔄 更新方法

ファイルを変更した後、以下のコマンドで更新をデプロイ：

```bash
# 変更をステージング
git add .

# コミット
git commit -m "Update: 変更内容の説明"

# プッシュ
git push origin main
```

GitHub Pages は自動的に更新を検知し、1〜2分で反映されます。

## ✅ デプロイ後のチェックリスト

### 基本動作確認
- [ ] メインLPが正常に表示される
- [ ] 体験会ページ（/trial/）が正常に表示される
- [ ] メインLPから体験会ページへのリンクが機能する
- [ ] 体験会ページからメインLPへの戻りリンクが機能する
- [ ] モバイルでレイアウトが適切に表示される

### フォームと連携
- [ ] メインLPのコンタクトフォームが動作する（Formspree）
- [ ] 体験会ページでスケジュールが表示される（Google Sheets）
- [ ] 体験会の申し込みボタンがGoogle Formsにリンクしている
- [ ] Google Analyticsが正常にトラッキングしている

### デザインとパフォーマンス
- [ ] ロゴ画像が正しく表示される
- [ ] ブランドカラー（#00D4FF → #0052FF）が統一されている
- [ ] Font AwesomeとGoogle Fontsが読み込まれている
- [ ] スクロールアニメーションが動作する
- [ ] ハンバーガーメニュー（モバイル）が動作する

### SEOとアクセシビリティ
- [ ] ページタイトルとメタディスクリプションが適切
- [ ] 画像にalt属性が設定されている
- [ ] リンクが正しく機能する
- [ ] HTTPSが有効になっている（カスタムドメイン使用時）

## 🛠️ トラブルシューティング

### 404 エラーが表示される

**原因:** GitHub Pagesの設定が正しくない
**解決策:**
1. Settings → Pages で Source が `main` ブランチの `/ (root)` になっているか確認
2. ファイルがリポジトリのルートに正しく配置されているか確認

### 体験会ページが表示されない

**原因:** サブディレクトリの構造が正しくない
**解決策:**
1. `trial/index.html` が正しい場所にあるか確認
2. `/trial/` でアクセスしているか確認（末尾のスラッシュが重要）

### スケジュールが表示されない

**原因:** Google Apps Script URLが正しくない、またはCORSの問題
**解決策:**
1. `trial/js/script.js` の7行目のURLを確認
2. Google Apps Script側でCORSを許可しているか確認
3. ブラウザのコンソールでエラーメッセージを確認

### CSS/JSが反映されない

**原因:** ブラウザのキャッシュ
**解決策:**
1. ハードリフレッシュ（Ctrl+Shift+R / Cmd+Shift+R）
2. ブラウザのキャッシュをクリア
3. シークレットモードで確認

### カスタムドメインが動作しない

**原因:** DNSの設定が完了していない
**解決策:**
1. DNSレコードが正しく設定されているか確認
2. `dig` コマンドや [DNS Checker](https://dnschecker.org/) で反映状況を確認
3. 最大48時間待つ（通常は数時間で反映）

## 📊 アクセス解析

### Google Analytics の確認

1. [Google Analytics](https://analytics.google.com/) にログイン
2. トラッキングID `G-VB7F17M5ZF` のプロパティを選択
3. リアルタイムレポートで訪問者を確認

### 主要指標
- ページビュー
- セッション時間
- コンバージョン（お問い合わせフォーム送信）
- 体験会申し込みボタンのクリック数

## 🔒 セキュリティ

### 推奨設定
- [x] HTTPS の有効化（GitHub Pages 標準）
- [x] Formspree のスパム対策
- [x] 外部リンクに `rel="noopener noreferrer"` 設定済み
- [x] 個人情報保護方針へのリンク設置済み

## 📞 サポート

### GitHub Pages の公式ドキュメント
- [GitHub Pages について](https://docs.github.com/ja/pages)
- [カスタムドメインの設定](https://docs.github.com/ja/pages/configuring-a-custom-domain-for-your-github-pages-site)

### 問題が解決しない場合
1. GitHub リポジトリの Issues を確認
2. このREADME.md のトラブルシューティングセクションを確認
3. ブラウザのデベロッパーツールでエラーを確認

---

**デプロイメント完了後、このチェックリストを確認してください！** ✨
