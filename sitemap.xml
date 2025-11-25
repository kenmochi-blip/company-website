# GitHub アップロードチェックリスト

## ✅ アップロード前の確認事項

### 1. 機密情報の確認
- [x] Google Analytics ID (G-VB7F17M5ZF) - 公開OK
- [x] Formspree ID (xrbogwpd) - 公開OK
- [x] Google Apps Script URL - 公開OK
- [x] パスワードやAPIキーなし - OK

### 2. ファイル構成の確認
- [x] index.html - 最新版
- [x] trial/index.html - 最新版
- [x] css/style.css - レスポンシブ対応済み
- [x] images/favicon.png - ロゴファビコン
- [x] images/ogp-image.jpg - SNS共有用画像
- [x] robots.txt - 新規作成
- [x] sitemap.xml - 新規作成
- [x] .gitignore - 新規作成

### 3. SEO対策の確認
- [x] meta description - 最適化済み
- [x] OGPタグ - 設定済み
- [x] 構造化データ (JSON-LD) - 完備
- [x] ファビコン - 絶対パス設定
- [x] BreadcrumbList - 追加済み

## 📦 アップロードするファイル

### ルートディレクトリ
- index.html
- robots.txt
- sitemap.xml
- .gitignore
- README.md
- DEPLOYMENT.md
- SEO_IMPROVEMENT_REPORT.md
- GITHUB_UPLOAD_CHECKLIST.md

### ディレクトリ
- css/ (style.css)
- js/ (script.js)
- images/ (favicon.png, ogp-image.jpg)
- trial/ (index.html, css/, js/)
- google-apps-script/ (updateFormChoices.gs)

## 🚀 アップロード手順

### 方法1: GitHubウェブ経由（簡単）

1. GitHubのリポジトリページに移動
2. 「Add file」→「Upload files」をクリック
3. すべてのファイルとフォルダをドラッグ＆ドロップ
4. コミットメッセージを入力（例: "Complete website update with SEO improvements"）
5. 「Commit changes」をクリック

### 方法2: Git コマンド（推奨）

```bash
# 既存のGitリポジトリがある場合
cd /path/to/smartandsmooth
git add .
git commit -m "Complete website update with SEO improvements"
git push origin main

# 新規リポジトリの場合
cd /path/to/smartandsmooth
git init
git add .
git commit -m "Initial commit: Complete Smart & Smooth website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smartandsmooth.git
git push -u origin main
```

## 📋 アップロード後の確認

### GitHubで確認
- [ ] すべてのファイルがアップロードされているか
- [ ] ディレクトリ構造が正しいか
- [ ] README.mdが正しく表示されるか

### 本番サイトで確認
- [ ] ファビコンが表示されるか
- [ ] robots.txtが読めるか (`https://smartandsmooth.com/robots.txt`)
- [ ] sitemap.xmlが読めるか (`https://smartandsmooth.com/sitemap.xml`)
- [ ] スマホ表示が正しいか
- [ ] すべてのリンクが動作するか

## 🎯 GitHub Pages でホスティングする場合

もしGitHub Pagesを使う場合：

1. リポジトリの Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / (root)
4. Save

**注意**: カスタムドメイン (smartandsmooth.com) を使用する場合：
- CNAMEファイルを作成
- DNSレコードを設定
- SSL証明書を有効化

## ⚠️ 注意事項

### アップロードしてはいけないファイル
- .DS_Store（macOS）
- Thumbs.db（Windows）
- .env（環境変数ファイル）
- node_modules/（今回は存在しない）

### 既に.gitignoreで除外されているもの
- エディタ設定ファイル (.vscode/, .idea/)
- 一時ファイル (*.tmp, *.log)

## 💡 Tips

### リポジトリを公開(public)にするか、非公開(private)にするか

**公開リポジトリ (public) のメリット**:
- 無料でGitHub Pagesが使える
- ポートフォリオとして使える
- オープンソースコミュニティに貢献

**公開リポジトリのデメリット**:
- コードが誰でも見られる（今回は問題なし）

**非公開リポジトリ (private) のメリット**:
- コードを非公開にできる
- クライアント案件に適している

**非公開リポジトリのデメリット**:
- GitHub Pages が有料プランでのみ使用可能

### おすすめ
今回のプロジェクトは**公開リポジトリでOK**です。機密情報は含まれていません。

## 📞 問題が発生した場合

### よくある問題

**Q: ファイルが大きすぎてアップロードできない**
A: images/favicon.png (1.4MB) が原因の可能性。最適化されたバージョンを使用してください。

**Q: .gitignoreが効かない**
A: 既にGitでトラッキングされているファイルは除外されません。以下を実行：
```bash
git rm -r --cached .
git add .
git commit -m "Apply .gitignore"
```

**Q: リポジトリの履歴を全削除したい**
A: 新しいリポジトリとして作り直すのが簡単です。

## ✅ 完了確認

- [ ] GitHubにアップロード完了
- [ ] 本番サイトで動作確認完了
- [ ] Google Search Consoleでサイトマップ送信完了（任意）
- [ ] ファビコンがブラウザタブに表示される

おめでとうございます！🎉
