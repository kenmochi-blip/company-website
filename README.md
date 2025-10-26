# 戦略MGマネジメントゲーム® 1日経営体験研修 LP

## 📋 プロジェクト概要

Smart & Smooth様の「戦略MGマネジメントゲーム® 1日経営体験研修」の個人向けランディングページです。

### 主な機能

- ✅ **Googleスプレッドシート連携** - スケジュールデータを自動取得
- ✅ **レスポンシブデザイン** - PC・タブレット・スマホ対応
- ✅ **フォールバック機能** - 接続エラー時も固定データを表示
- ✅ **Googleフォーム連携** - 申し込みフォームへの導線
- ✅ **美しいアニメーション** - スムーススクロール、フェードイン効果

---

## 🚀 セットアップガイド

### 1. Googleスプレッドシートの作成

#### 1-1. 新しいスプレッドシートを作成

1. [Google Sheets](https://sheets.google.com)にアクセス
2. 「空白」を選択して新しいスプレッドシートを作成
3. シート名を「研修スケジュール」などに変更（任意）

#### 1-2. スプレッドシートのフォーマット

以下の形式でデータを入力してください：

| A列（日付） | B列（場所） | C列（定員） | D列（状態） |
|-------------|------------|------------|-------------|
| 11月29日(金) | 京都 | 5 | 募集中 |
| 12月13日(金) | 東京 | 10 | 募集中 |
| 1月24日(金) | 東京 | 10 | 満員 |
| 2月21日(金) | 京都 | 5 | 募集中 |
| 3月7日(金) | 東京 | 10 | 募集終了 |

**重要な注意事項：**
- **1行目はヘッダー行として使用しません**（データは1行目から入力）
- A列: 日付（例：11月29日(金)）
- B列: 場所（例：京都、東京）
- C列: 定員（数字のみ、例：5、10）
- D列: 状態（「募集中」「満員」「募集終了」のいずれか）

---

### 2. Google Apps Scriptのセットアップ

#### 2-1. Apps Scriptを開く

1. スプレッドシートを開いた状態で、メニューから「拡張機能」→「Apps Script」をクリック
2. 新しいタブでApps Scriptエディタが開きます

#### 2-2. コードを貼り付け

既存のコード（`function myFunction() { ... }`）を**すべて削除**し、以下のコードを貼り付けてください：

```javascript
/**
 * 戦略MGマネジメントゲーム研修 - スケジュール管理API
 * スプレッドシートのデータをJSON形式で返すWeb API
 */

function doGet(e) {
  try {
    // アクティブなスプレッドシートを取得
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // データ範囲を取得（1行目から最終行まで、A列からD列まで）
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // JSON形式に変換
    const schedules = [];
    
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      
      // 空行をスキップ
      if (!row[0] || row[0] === '') {
        continue;
      }
      
      // データオブジェクトを作成
      const schedule = {
        date: row[0] || '',
        location: row[1] || '',
        maxParticipants: parseInt(row[2]) || 0,
        status: row[3] || '募集中'
      };
      
      schedules.push(schedule);
    }
    
    // JSON形式で返す
    return ContentService
      .createTextOutput(JSON.stringify(schedules))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // エラーハンドリング
    const errorResponse = {
      error: true,
      message: error.toString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * テスト用関数
 * このファイルで「実行」→「test」を選択して動作確認できます
 */
function test() {
  const result = doGet();
  Logger.log(result.getContent());
}
```

#### 2-3. プロジェクト名を設定

1. 左上の「無題のプロジェクト」をクリック
2. 「研修スケジュールAPI」などのわかりやすい名前に変更
3. 「保存」アイコン（💾）をクリックして保存

#### 2-4. テスト実行（任意だが推奨）

1. エディタ上部の関数選択で「test」を選択
2. 「実行」ボタン（▶️）をクリック
3. 初回実行時は権限の承認が必要です：
   - 「権限を確認」をクリック
   - Googleアカウントを選択
   - 「詳細」→「（プロジェクト名）に移動」をクリック
   - 「許可」をクリック
4. 「実行ログ」に正しいJSON形式のデータが表示されればOK

#### 2-5. Webアプリとしてデプロイ

1. 右上の「デプロイ」→「新しいデプロイ」をクリック
2. 「種類の選択」で「ウェブアプリ」を選択
3. 設定項目：
   - **説明**: 「研修スケジュールAPI v1」など（任意）
   - **次のユーザーとして実行**: 「自分」を選択
   - **アクセスできるユーザー**: 「全員」を選択 ⚠️ **重要**
4. 「デプロイ」ボタンをクリック
5. 「ウェブアプリのURL」が表示されます（例：`https://script.google.com/macros/s/AKfycby.../exec`）
6. このURLを**必ずコピー**してください（後で使用します）

---

### 3. ランディングページの設定

#### 3-1. Google Apps Script URLの設定

`js/script.js` ファイルを開き、**7行目**を編集してください：

```javascript
// 変更前
const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// 変更後（あなたのURLに置き換える）
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

#### 3-2. Google Form URLの設定

`js/script.js` ファイルの**10行目**を編集してください：

```javascript
// 変更前
const GOOGLE_FORM_URL = 'YOUR_GOOGLE_FORM_URL_HERE';

// 変更後（あなたのフォームURLに置き換える）
const GOOGLE_FORM_URL = 'https://forms.gle/YOUR_FORM_ID';
```

---

### 4. Googleフォームの作成

#### 4-1. 新しいフォームを作成

1. [Google Forms](https://forms.google.com)にアクセス
2. 「空白」を選択して新しいフォームを作成
3. タイトル：「戦略MGマネジメントゲーム® 1日経営体験研修 申し込みフォーム」

#### 4-2. 質問項目を追加

以下の質問を追加してください：

1. **希望日程**（プルダウン、必須）
   - 選択肢: スプレッドシートの開催日程と同じ
   - 例: 11月29日(金) 京都、12月13日(金) 東京、など

2. **氏名**（記述式、必須）

3. **メールアドレス**（記述式、必須）

4. **電話番号**（記述式、必須）

5. **参加回数**（ラジオボタン、必須）
   - 初回参加
   - 2回目以降（リピーター）

6. **領収書の要否**（ラジオボタン、必須）
   - 必要
   - 不要

#### 4-3. フォームURLを取得

1. 右上の「送信」ボタンをクリック
2. リンクマーク（🔗）をタブで選択
3. 「URLを短縮」にチェック（推奨）
4. URLをコピーして、`js/script.js`の`GOOGLE_FORM_URL`に設定

---

## 🔧 運用ガイド

### スケジュールの追加・変更・削除

#### 追加する場合
1. Googleスプレッドシートを開く
2. 新しい行にデータを追加
3. 保存（自動保存されます）
4. LPは**自動的に**新しいスケジュールを表示します

#### 変更する場合
1. 該当する行のデータを編集
2. 保存
3. LPをリロードすると変更が反映されます

#### 削除する場合
1. 該当する行を削除
2. 保存
3. LPから自動的に削除されます

#### 満員にする場合
D列の「状態」を「満員」または「募集終了」に変更してください。LPでは半透明表示され、「満員」バッジが表示されます。

---

## 🎨 カスタマイズ方法

### ブランドカラーの変更

`css/style.css` の **6-16行目** で色を変更できます：

```css
:root {
    --primary-color: #2563eb;      /* メインの青色 */
    --primary-dark: #1e40af;       /* 濃い青色 */
    --primary-light: #3b82f6;      /* 薄い青色 */
    --secondary-color: #0ea5e9;    /* セカンダリー色 */
    --accent-color: #f59e0b;       /* アクセント色（オレンジ） */
}
```

### フォントの変更

`index.html` の **19行目** でGoogle Fontsを変更できます。

---

## 🐛 トラブルシューティング

### Q1. スケジュールが表示されない

**確認事項：**
1. ✅ Google Apps Script URLが正しく設定されているか
2. ✅ Apps Scriptが「全員」にアクセスを許可しているか
3. ✅ スプレッドシートのデータ形式が正しいか
4. ✅ ブラウザのコンソールでエラーが出ていないか（F12キーで確認）

**対処法：**
- URLを再確認して、`js/script.js`に正しく設定する
- Apps Scriptを再デプロイしてみる
- フォールバックデータは表示されるはずなので、まずは動作確認

### Q2. 「満員」バッジが表示されない

**原因：**
スプレッドシートのD列の値が「満員」または「募集終了」になっていない

**対処法：**
D列に正確に「満員」と入力してください（全角カタカナ）

### Q3. 申し込みボタンをクリックしてもフォームが開かない

**原因：**
Google Form URLが設定されていない

**対処法：**
`js/script.js`の`GOOGLE_FORM_URL`を正しいURLに設定してください

### Q4. スプレッドシートを変更してもLPに反映されない

**原因：**
ブラウザのキャッシュが残っている

**対処法：**
- ページをリロード（Ctrl+F5 または Cmd+Shift+R）
- ブラウザのキャッシュをクリア
- シークレットモード/プライベートブラウジングで確認

### Q5. Apps Scriptのデプロイ時にエラーが出る

**原因：**
権限の問題

**対処法：**
1. Apps Scriptエディタで「test」関数を実行
2. 権限の承認を完了する
3. 再度デプロイを試す

---

## 📁 ファイル構成

```
.
├── index.html              # メインHTMLファイル
├── css/
│   └── style.css          # スタイルシート
├── js/
│   └── script.js          # JavaScript（スケジュール取得、UI制御）
└── README.md              # このファイル
```

---

## 🔐 セキュリティに関する注意

### Apps Scriptの公開について

- Apps Scriptを「全員」に公開していますが、**読み取り専用**のAPIなので安全です
- スプレッドシートそのものは公開されていません
- フォームの回答データも保護されています

### 個人情報の取り扱い

- Googleフォームで収集した個人情報は適切に管理してください
- 必要に応じてプライバシーポリシーをLPに追加することを推奨します

---

## 🚀 デプロイ方法

### Publishタブからデプロイ

1. このプロジェクトの「Publish」タブをクリック
2. 「Deploy」ボタンをクリック
3. 自動的にWebサイトが公開されます
4. 公開URLが発行されます

---

## 📊 アクセス解析の追加（オプション）

Google Analyticsを導入する場合は、`index.html`の`</head>`の直前に以下を追加してください：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 📞 サポート

ご不明な点がございましたら、プロジェクトのIssueセクションまたは開発者にお問い合わせください。

---

## 📝 ライセンス

© 合同会社 Smart & Smooth

---

## 🎉 制作完了チェックリスト

- [ ] Googleスプレッドシートを作成
- [ ] スケジュールデータを入力
- [ ] Google Apps Scriptをデプロイ
- [ ] Apps Script URLを`js/script.js`に設定
- [ ] Googleフォームを作成
- [ ] Google Form URLを`js/script.js`に設定
- [ ] ローカルでプレビュー確認
- [ ] スマートフォンでレスポンシブ確認
- [ ] Publishタブからデプロイ
- [ ] 本番環境で動作確認

すべてチェックできたら、あなたのランディングページは完璧です！🎊