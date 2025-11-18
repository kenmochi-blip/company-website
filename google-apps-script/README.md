# Google Sheetsとの自動連携設定ガイド

## 🎯 目的

Google Sheetsのスケジュールデータを更新すると、Google Formsの日時選択肢が**自動的に更新**されるようにします。

---

## 📋 現在の状態

### ✅ 実装済み
- Google Sheets → ウェブサイト（スケジュール表示）
- ウェブサイト → Google Forms（リンク）

### ⚠️ 未実装
- Google Sheets → Google Forms（選択肢の自動更新）

---

## 🔧 設定手順

### ステップ1: Google Sheetsのデータ形式を確認

スプレッドシートに以下のカラムが必要です：

| 日付 | 開催地 | 定員 | ステータス |
|------|--------|------|-----------|
| 11月29日(金) | 京都 | 5 | 募集中 |
| 12月13日(金) | 東京 | 10 | 募集中 |

**重要:** カラム名は正確に一致させてください。

---

### ステップ2: Apps Scriptを設定

1. **Google Sheetsを開く**
   ```
   https://docs.google.com/spreadsheets/d/1-h_w8u-p1kG1ND9vCk4kf74_MDp7lxVjhm_J4mgP9i8/edit
   ```

2. **Apps Scriptエディタを開く**
   - メニューバー: 「拡張機能」→「Apps Script」

3. **コードを貼り付け**
   - `updateFormChoices.gs` の内容を全てコピー
   - Apps Scriptエディタに貼り付け

4. **設定を変更**
   
   以下の定数を実際の値に変更してください：

   ```javascript
   // Google FormsのID
   const FORM_ID = '1_YgIxqHqt1CLB086O8wZv1JOtzoYJYblzj4OFD_-5PU';
   
   // シート名（実際のシート名を確認してください）
   const SHEET_NAME = 'シート1';
   
   // Google Forms内の質問タイトル
   const QUESTION_TITLE = '参加希望日時';
   ```

   **FORM_IDの確認方法:**
   - Google FormsのURLを確認: 
     ```
     https://docs.google.com/forms/d/1_YgIxqHqt1CLB086O8wZv1JOtzoYJYblzj4OFD_-5PU/edit
     ```
   - `/d/` と `/edit` の間の部分がFORM_ID

5. **保存**
   - Ctrl+S または「保存」ボタンをクリック

---

### ステップ3: 初回実行とトリガー設定

1. **初回テスト実行**
   - 関数選択ドロップダウンで `manualUpdate` を選択
   - 「実行」ボタンをクリック
   - 初回実行時に権限の承認を求められるので、承認してください

2. **トリガーを設定**
   - 関数選択ドロップダウンで `setupTrigger` を選択
   - 「実行」ボタンをクリック
   - これでシート編集時に自動実行されるようになります

3. **動作確認**
   - Google Sheetsでスケジュールデータを追加または変更
   - Google Formsを開いて、選択肢が自動更新されているか確認

---

### ステップ4: Google Formsの質問を確認

Google Formsに以下の質問が存在することを確認してください：

- **質問タイトル**: 「参加希望日時」（または設定した`QUESTION_TITLE`と一致）
- **質問タイプ**: 
  - ラジオボタン（単一選択）
  - チェックボックス（複数選択）
  - プルダウンリスト
  のいずれか

---

## 🎯 動作の流れ

```
1. Google Sheetsでスケジュールを更新
   ↓
2. Apps Scriptが自動実行（onEditトリガー）
   ↓
3. シートからデータを取得
   ↓
4. 過去の日程を除外
   ↓
5. 選択肢用のテキストを生成
   （例: 「11月29日(金) - 京都」）
   ↓
6. Google Formsの選択肢を更新
   ↓
7. 完了！
```

---

## 📊 データ形式の詳細

### Google Sheetsの必須カラム

| カラム名 | 説明 | 例 |
|----------|------|-----|
| 日付 | 開催日（年は省略可） | 「11月29日(金)」または「2025年11月29日（金）」 |
| 開催地 | 開催場所 | 「東京」「京都」 |
| 定員 | 最大参加人数（オプション） | 10 |
| ステータス | 募集状態 | 「募集中」「満席」「中止」 |

### 自動フィルタリング

以下の条件に該当するスケジュールは**自動的に除外**されます：
- ステータスが「募集中」以外
- 日付が過去のもの

---

## 🛠️ トラブルシューティング

### Q1: 選択肢が更新されない

**確認事項:**
1. トリガーが正しく設定されているか
   - Apps Scriptエディタで「トリガー」アイコンをクリック
   - `onEdit` トリガーが存在するか確認

2. シート名が正しいか
   - `SHEET_NAME` の値を確認

3. カラム名が正確に一致しているか
   - 「日付」「開催地」「ステータス」（全角スペースや余分な文字がないか確認）

### Q2: エラーが発生する

**確認方法:**
- Apps Scriptエディタで「実行数」アイコンをクリック
- エラーログを確認

**よくあるエラー:**
- `シート「○○」が見つかりません` → SHEET_NAMEを修正
- `質問「○○」が見つかりません` → QUESTION_TITLEを修正
- `必要なカラムが見つかりません` → カラム名を確認

### Q3: 手動で更新したい

Apps Scriptエディタで：
1. 関数選択ドロップダウンで `manualUpdate` を選択
2. 「実行」ボタンをクリック

---

## 📝 カスタマイズ

### 選択肢の表示形式を変更する

`createChoicesArray` 関数を編集してください：

```javascript
function createChoicesArray(schedules) {
  return schedules.map(schedule => {
    // 現在: 「11月29日(金) - 京都」
    return `${schedule.date} - ${schedule.location}`;
    
    // カスタマイズ例1: 「11月29日(金) 京都会場（定員10名）」
    // return `${schedule.date} ${schedule.location}会場（定員${schedule.maxParticipants}名）`;
    
    // カスタマイズ例2: 「【京都】11月29日(金)」
    // return `【${schedule.location}】${schedule.date}`;
  });
}
```

---

## 🎉 設定完了後の確認

1. ✅ Google Sheetsでスケジュールを追加
2. ✅ Google Formsの選択肢が自動更新される
3. ✅ 過去の日程は自動的に表示されない
4. ✅ ウェブサイトにもスケジュールが表示される

---

## 📞 サポート

問題が解決しない場合は、以下の情報を確認してください：
- Google Sheetsのシート名
- Google Formsの質問タイトル
- Apps Scriptの実行ログ
- エラーメッセージ（あれば）

---

**作成日**: 2025年10月27日  
**対象プロジェクト**: Smart & Smooth - マネジメントゲーム体験会
