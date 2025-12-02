// Google Form送信時に自動メール送信 + スプレッドシート記録するスクリプト（修正版）

// ====================================
// 設定: ここを変更してください
// ====================================
var SPREADSHEET_ID = "1_XIT8fYAmqDxvu6SkJCPxzjimXhu1XLK_LOgh-27lOg"; // スプレッドシートID
var SHEET_NAME = "HPからの申し込み"; // シート名
var ADMIN_EMAIL = "kenmochi@smartandsmooth.com"; // 管理者メールアドレス（通知用）

// ====================================
// メイン関数: フォーム送信時に実行
// ====================================
function onFormSubmit(e) {
  try {
    // イベントオブジェクトの存在確認
    if (!e || !e.response) {
      Logger.log("エラー: イベントオブジェクトが不正です");
      throw new Error("フォーム送信イベントが正しく取得できませんでした");
    }
    
    // フォームの回答を取得
    var itemResponses = e.response.getItemResponses();
    var email = "";
    var name = "";
    var eventDate = "";
    var phone = "";
    var company = "";
    var remarks = "";
    
    Logger.log("フォーム送信を検知しました。回答数: " + itemResponses.length);
    
    // Google Formの「メールアドレスを収集」機能から取得
    try {
      email = e.response.getRespondentEmail();
      if (email) {
        Logger.log("メールアドレス取得（自動収集）: " + email);
      }
    } catch (error) {
      Logger.log("自動収集からのメールアドレス取得失敗: " + error.toString());
    }
    
    // 各フォーム項目から情報を取得
    for (var i = 0; i < itemResponses.length; i++) {
      var itemResponse = itemResponses[i];
      var title = itemResponse.getItem().getTitle();
      var response = itemResponse.getResponse();
      
      Logger.log("質問「" + title + "」の回答: " + response);
      
      // メールアドレス
      if (!email && (title.indexOf("メール") !== -1 || title.indexOf("Email") !== -1 || title.indexOf("email") !== -1 || title.toLowerCase().indexOf("e-mail") !== -1)) {
        email = response;
        Logger.log("メールアドレス取得（質問項目）: " + email);
      }
      // 名前
      if (title.indexOf("お名前") !== -1 || title.indexOf("氏名") !== -1 || title.indexOf("名前") !== -1 || title.indexOf("Name") !== -1) {
        name = response;
        Logger.log("名前取得: " + name);
      }
      // 参加希望日（より広範囲に対応）
      if (title.indexOf("参加希望日") !== -1 || title.indexOf("開催日") !== -1 || title.indexOf("希望日") !== -1 || 
          title.indexOf("日程") !== -1 || title.indexOf("スケジュール") !== -1 || title.indexOf("開催") !== -1 ||
          title.indexOf("ご希望の参加日程") !== -1 || title.indexOf("参加日程") !== -1) {
        eventDate = response;
        Logger.log("参加希望日取得: " + eventDate);
      }
      // 電話番号
      if (title.indexOf("電話") !== -1 || title.indexOf("TEL") !== -1 || title.indexOf("Tel") !== -1 || title.indexOf("tel") !== -1) {
        phone = response;
        Logger.log("電話番号取得: " + phone);
      }
      // 会社名
      if (title.indexOf("会社") !== -1 || title.indexOf("組織") !== -1 || title.indexOf("所属") !== -1 || title.indexOf("勤務先") !== -1) {
        company = response;
        Logger.log("会社名取得: " + company);
      }
      // 備考・その他
      if (title.indexOf("備考") !== -1 || title.indexOf("その他") !== -1 || title.indexOf("質問") !== -1 || title.indexOf("要望") !== -1) {
        remarks = response;
        Logger.log("備考取得: " + remarks);
      }
    }
    
    // メールアドレスが取得できなかった場合
    if (!email) {
      Logger.log("エラー: メールアドレスが取得できませんでした");
      throw new Error("メールアドレスが取得できませんでした");
    }
    
    // 名前が取得できなかった場合のデフォルト値
    if (!name) {
      name = "お客様";
      Logger.log("名前未取得のためデフォルト値を使用: " + name);
    }
    
    // 参加希望日が取得できなかった場合
    if (!eventDate) {
      eventDate = "（未指定）";
      Logger.log("参加希望日未取得");
    }
    
    // スプレッドシートに記録
    var applicationNumber = recordToSpreadsheet(email, name, eventDate, phone, company, remarks);
    
    // 確認メール送信
    sendConfirmationEmail(email, name, eventDate, applicationNumber);
    
    // 開催日別集計を自動更新
    try {
      updateSummaryByDate();
      Logger.log("開催日別集計を自動更新しました");
    } catch (summaryError) {
      Logger.log("集計更新エラー（処理は続行）: " + summaryError.toString());
    }
    
    // 管理者への通知（オプション：有効にする場合はコメントを解除）
    // sendAdminNotification(email, name, eventDate, applicationNumber);
    
    Logger.log("処理完了: " + email + " (申込番号: " + applicationNumber + ")");
    
  } catch (error) {
    Logger.log("エラー発生: " + error.toString());
    Logger.log("スタックトレース: " + error.stack);
    
    // 管理者にエラー通知
    try {
      MailApp.sendEmail(ADMIN_EMAIL, "【エラー】フォーム送信処理失敗", 
        "エラーが発生しました:\n\n" + 
        "エラーメッセージ: " + error.toString() + "\n\n" + 
        "スタックトレース:\n" + error.stack);
    } catch (mailError) {
      Logger.log("エラー通知メール送信失敗: " + mailError.toString());
    }
  }
}

// ====================================
// スプレッドシートに記録
// ====================================
function recordToSpreadsheet(email, name, eventDate, phone, company, remarks) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error("シート「" + SHEET_NAME + "」が見つかりません");
    }
    
    Logger.log("スプレッドシートへの記録を開始");
    
    // 申込番号を生成
    var applicationNumber = generateApplicationNumber(sheet);
    Logger.log("申込番号生成: " + applicationNumber);
    
    // 重複チェック
    var isDuplicate = checkDuplicate(sheet, email);
    Logger.log("重複チェック結果: " + isDuplicate);
    
    // リピーター判定
    var isRepeater = checkRepeater(sheet, email);
    Logger.log("リピーター判定結果: " + isRepeater);
    
    // タイムスタンプ
    var timestamp = new Date();
    
    // ステータス
    var status = "申込受付";
    
    // 参加費（リピーターは7,000円、初回は10,000円）
    var fee = isRepeater ? "7,000円" : "10,000円";
    
    // 新しい行のデータ
    var newRow = [
      applicationNumber,        // A列: 申込番号
      timestamp,                // B列: 申込日時
      name,                     // C列: お名前
      email,                    // D列: メールアドレス
      phone || "",              // E列: 電話番号
      company || "",            // F列: 会社名・所属
      eventDate,                // G列: 参加希望日
      fee,                      // H列: 参加費
      status,                   // I列: ステータス
      isRepeater ? "リピーター" : "初回",  // J列: リピーター区分
      isDuplicate ? "重複あり" : "",       // K列: 重複フラグ
      remarks || "",            // L列: 備考
      "",                       // M列: 振込確認（空欄）
      ""                        // N列: 管理者メモ（空欄）
    ];
    
    Logger.log("記録データ準備完了");
    
    // 2行目に挿入（ヘッダーの下、最新が上に来る）
    sheet.insertRowBefore(2);
    sheet.getRange(2, 1, 1, newRow.length).setValues([newRow]);
    
    // 重複の場合は行を黄色くハイライト
    if (isDuplicate) {
      sheet.getRange(2, 1, 1, newRow.length).setBackground("#FFF3CD");
      Logger.log("重複のため黄色でハイライト");
    }
    
    // リピーターの場合は薄い緑色
    if (isRepeater && !isDuplicate) {
      sheet.getRange(2, 1, 1, newRow.length).setBackground("#D4EDDA");
      Logger.log("リピーターのため緑色でハイライト");
    }
    
    Logger.log("スプレッドシート記録完了: " + applicationNumber);
    
    return applicationNumber;
    
  } catch (error) {
    Logger.log("スプレッドシート記録エラー: " + error.toString());
    throw error;
  }
}

// ====================================
// 申込番号を生成
// ====================================
function generateApplicationNumber(sheet) {
  var today = new Date();
  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, '0');
  
  // 既存の申込番号を取得
  var lastRow = sheet.getLastRow();
  var sequenceNumber = 1;
  
  if (lastRow > 1) {
    // 2行目（最新の申込）の申込番号を取得
    var lastNumber = sheet.getRange(2, 1).getValue();
    
    if (lastNumber && lastNumber.toString().indexOf("MG-" + year + month) === 0) {
      // 同月の申込がある場合、連番を+1
      var parts = lastNumber.toString().split("-");
      if (parts.length === 3) {
        sequenceNumber = parseInt(parts[2]) + 1;
      }
    }
  }
  
  // MG-YYYYMM-XXX 形式
  return "MG-" + year + month + "-" + String(sequenceNumber).padStart(3, '0');
}

// ====================================
// 重複チェック
// ====================================
function checkDuplicate(sheet, email) {
  var lastRow = sheet.getLastRow();
  
  if (lastRow < 2) return false;
  
  // D列（メールアドレス）を検索
  var emailColumn = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
  
  for (var i = 0; i < emailColumn.length; i++) {
    if (emailColumn[i][0] === email) {
      Logger.log("重複検出: " + email);
      return true;
    }
  }
  
  return false;
}

// ====================================
// リピーター判定
// ====================================
function checkRepeater(sheet, email) {
  var lastRow = sheet.getLastRow();
  
  if (lastRow < 2) return false;
  
  // D列（メールアドレス）を検索
  var emailColumn = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
  var count = 0;
  
  for (var i = 0; i < emailColumn.length; i++) {
    if (emailColumn[i][0] === email) {
      count++;
    }
  }
  
  // 既に1回以上申込がある場合はリピーター
  if (count > 0) {
    Logger.log("リピーター判定: " + email + " (過去の申込: " + count + "回)");
    return true;
  }
  
  return false;
}

// ====================================
// 確認メール送信
// ====================================
function sendConfirmationEmail(email, name, eventDate, applicationNumber) {
  try {
    var subject = "【Smart & Smooth】マネジメントゲーム体験研修 お申し込み受付完了";
    
    var body = name + " 様\n\n" +
               "この度は、マネジメントゲーム 1日経営体験研修にお申し込みいただき、誠にありがとうございます。\n\n" +
               "お申し込みを受け付けいたしました。\n\n" +
               "━━━━━━━━━━━━━━━━━━━━━━\n" +
               "📝 お申し込み内容\n" +
               "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
               "申込番号: " + applicationNumber + "\n";
    
    if (eventDate && eventDate !== "（未指定）") {
      body += "ご希望の開催日: " + eventDate + "\n";
    }
    
    body += "\n━━━━━━━━━━━━━━━━━━━━━━\n" +
            "📋 今後の流れ\n" +
            "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
            "1. 3営業日以内に、担当者より確認のご連絡をさせていただきます\n" +
            "2. 開催日の1週間前に、詳細案内（会場・持ち物など）をメールでお送りします\n" +
            "3. お支払いは、事前銀行振込または当日現金・PayPayをお選びいただけます\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━\n" +
            "📝 詳細情報\n" +
            "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
            "こちらのページで詳細をご確認いただけます：\n" +
            "https://smartandsmooth.com/trial/thank-you.html\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━\n" +
            "💰 参加費用\n" +
            "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
            "【個人向け特別価格】10,000円（税込）\n" +
            "※リピーター（2回目以降）の方：7,000円（税込）\n\n" +
            "費用には研修教材、ゲームボード利用料、講師指導料が含まれます。\n" +
            "領収書の発行も可能です。\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━\n" +
            "📞 お問い合わせ\n" +
            "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
            "ご不明点がございましたら、このメールに返信する形でお気軽にお問い合わせください。\n\n" +
            "合同会社 Smart & Smooth\n" +
            "代表：剱持 健\n" +
            "ウェブサイト：https://smartandsmooth.com\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
            "※このメールは自動送信されています。\n" +
            "※確認メールが届かない場合は、迷惑メールフォルダをご確認ください。\n";
    
    GmailApp.sendEmail(email, subject, body, {
      name: 'Smart & Smooth'
    });
    
    Logger.log("確認メール送信成功: " + email);
    
  } catch (error) {
    Logger.log("確認メール送信エラー: " + error.toString());
    throw error;
  }
}

// ====================================
// 管理者への通知（オプション）
// ====================================
function sendAdminNotification(email, name, eventDate, applicationNumber) {
  try {
    var subject = "【新規申込】マネジメントゲーム体験研修 - " + name;
    
    var body = "新しい申込がありました。\n\n" +
               "申込番号: " + applicationNumber + "\n" +
               "お名前: " + name + "\n" +
               "メールアドレス: " + email + "\n" +
               "参加希望日: " + eventDate + "\n\n" +
               "スプレッドシートで確認:\n" +
               "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/edit";
    
    MailApp.sendEmail(ADMIN_EMAIL, subject, body);
    
    Logger.log("管理者通知送信: " + ADMIN_EMAIL);
    
  } catch (error) {
    Logger.log("管理者通知送信エラー: " + error.toString());
  }
}

// ====================================
// トリガー設定（初回のみ実行）
// ====================================
function createTrigger() {
  try {
    // 既存のトリガーを削除
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
    
    // 新しいトリガーを作成
    var form = FormApp.getActiveForm();
    ScriptApp.newTrigger('onFormSubmit')
      .forForm(form)
      .onFormSubmit()
      .create();
    
    Logger.log("トリガー設定完了");
    
  } catch (error) {
    Logger.log("トリガー設定エラー: " + error.toString());
    throw error;
  }
}

// ====================================
// スプレッドシートのヘッダー初期化（初回のみ実行）
// ====================================
function initializeSpreadsheet() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      // シートが存在しない場合は作成
      sheet = ss.insertSheet(SHEET_NAME);
      Logger.log("新しいシートを作成: " + SHEET_NAME);
    }
    
    // ヘッダー行を設定
    var headers = [
      "申込番号",
      "申込日時",
      "お名前",
      "メールアドレス",
      "電話番号",
      "会社名・所属",
      "参加希望日",
      "参加費",
      "ステータス",
      "リピーター区分",
      "重複フラグ",
      "備考",
      "振込確認",
      "管理者メモ"
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // ヘッダー行を太字・背景色設定
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#4A90E2")
      .setFontColor("#FFFFFF");
    
    // 列幅を自動調整
    for (var i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    // 固定行（ヘッダーを固定）
    sheet.setFrozenRows(1);
    
    Logger.log("スプレッドシート初期化完了");
    
  } catch (error) {
    Logger.log("スプレッドシート初期化エラー: " + error.toString());
    throw error;
  }
}

// ====================================
// 開催日ごとの集計（手動実行用）
// ====================================
function generateSummaryByDate() {
  try {
    Logger.log("=== 開催日別集計を開始 ===");
    
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log("スプレッドシート取得成功: " + SPREADSHEET_ID);
    
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      Logger.log("エラー: シート「" + SHEET_NAME + "」が見つかりません");
      Logger.log("利用可能なシート一覧:");
      var sheets = ss.getSheets();
      for (var i = 0; i < sheets.length; i++) {
        Logger.log("  - " + sheets[i].getName());
      }
      return;
    }
    
    Logger.log("シート取得成功: " + SHEET_NAME);
    
    // データ取得
    var lastRow = sheet.getLastRow();
    Logger.log("最終行: " + lastRow);
    
    if (lastRow < 2) {
      Logger.log("エラー: データがありません（ヘッダー行のみ）");
      return;
    }
    
    Logger.log("データ行数: " + (lastRow - 1) + "行");
    
    // 集計シートを作成または取得
    var summarySheetName = "開催日別集計";
    var summarySheet = ss.getSheetByName(summarySheetName);
    
    if (!summarySheet) {
      summarySheet = ss.insertSheet(summarySheetName);
      Logger.log("新しい集計シートを作成: " + summarySheetName);
    } else {
      summarySheet.clear();
      Logger.log("既存の集計シートをクリア: " + summarySheetName);
    }
    
    // ヘッダー設定
    summarySheet.getRange(1, 1, 1, 4).setValues([["開催日", "参加者数", "初回", "リピーター"]]);
    summarySheet.getRange(1, 1, 1, 4)
      .setFontWeight("bold")
      .setBackground("#4A90E2")
      .setFontColor("#FFFFFF");
    
    Logger.log("ヘッダー行を設定");
    
    // G列〜J列のデータを取得（参加希望日、参加費、ステータス、リピーター区分）
    var data = sheet.getRange(2, 7, lastRow - 1, 4).getValues();
    Logger.log("取得したデータ数: " + data.length + "行");
    
    // 開催日ごとに集計
    var summary = {};
    
    for (var i = 0; i < data.length; i++) {
      var eventDate = data[i][0]; // G列: 参加希望日
      var fee = data[i][1];        // H列: 参加費
      var status = data[i][2];     // I列: ステータス
      var repeaterType = data[i][3]; // J列: リピーター区分
      
      Logger.log((i + 1) + "行目: 参加希望日=" + eventDate + ", リピーター区分=" + repeaterType);
      
      // 空欄または未指定の場合はスキップ
      if (!eventDate || eventDate === "" || eventDate === "（未指定）") {
        Logger.log("  → スキップ（参加希望日が空欄または未指定）");
        continue;
      }
      
      // 集計データの初期化
      if (!summary[eventDate]) {
        summary[eventDate] = { total: 0, first: 0, repeater: 0 };
        Logger.log("  → 新しい開催日を追加: " + eventDate);
      }
      
      summary[eventDate].total++;
      
      if (repeaterType === "リピーター") {
        summary[eventDate].repeater++;
        Logger.log("  → リピーターとしてカウント");
      } else {
        summary[eventDate].first++;
        Logger.log("  → 初回としてカウント");
      }
    }
    
    Logger.log("集計結果:");
    for (var date in summary) {
      Logger.log("  " + date + ": 合計=" + summary[date].total + ", 初回=" + summary[date].first + ", リピーター=" + summary[date].repeater);
    }
    
    // 集計結果をシートに書き込み
    var row = 2;
    for (var date in summary) {
      summarySheet.getRange(row, 1, 1, 4).setValues([[
        date,
        summary[date].total,
        summary[date].first,
        summary[date].repeater
      ]]);
      Logger.log(row + "行目に書き込み: " + date);
      row++;
    }
    
    // 列幅を自動調整
    for (var i = 1; i <= 4; i++) {
      summarySheet.autoResizeColumn(i);
    }
    
    var summaryCount = row - 2;
    Logger.log("=== 集計完了: " + summaryCount + "件の開催日 ===");
    
    if (summaryCount === 0) {
      Logger.log("警告: 集計結果が0件です。参加希望日が正しく記録されているか確認してください。");
    }
    
    // 完了メッセージを表示
    Browser.msgBox("集計完了", summaryCount + "件の開催日を集計しました。\n「開催日別集計」シートをご確認ください。", Browser.Buttons.OK);
    
  } catch (error) {
    Logger.log("集計エラー: " + error.toString());
    Logger.log("スタックトレース: " + error.stack);
    Browser.msgBox("エラー", "集計中にエラーが発生しました:\n" + error.toString(), Browser.Buttons.OK);
    throw error;
  }
}

// ====================================
// テスト用関数
// ====================================
function testEmailSend() {
  var testEmail = "kenmochi@smartandsmooth.com";
  var testName = "テストユーザー";
  var testEventDate = "12月13日(金) 東京";
  var testApplicationNumber = "MG-202501-999";
  
  try {
    sendConfirmationEmail(testEmail, testName, testEventDate, testApplicationNumber);
    Logger.log("テストメール送信成功");
  } catch (error) {
    Logger.log("テストメール送信エラー: " + error.toString());
  }
}

// ====================================
// 開催日別集計を自動更新（フォーム送信時に実行）
// ====================================
function updateSummaryByDate() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      Logger.log("集計更新: シートが見つかりません");
      return;
    }
    
    // 集計シートを作成または取得
    var summarySheetName = "開催日別集計";
    var summarySheet = ss.getSheetByName(summarySheetName);
    
    if (!summarySheet) {
      summarySheet = ss.insertSheet(summarySheetName);
      // ヘッダー設定
      summarySheet.getRange(1, 1, 1, 4).setValues([["開催日", "参加者数", "初回", "リピーター"]]);
      summarySheet.getRange(1, 1, 1, 4)
        .setFontWeight("bold")
        .setBackground("#4A90E2")
        .setFontColor("#FFFFFF");
      summarySheet.setFrozenRows(1);
    } else {
      // 既存のデータをクリア（ヘッダー以外）
      var lastRow = summarySheet.getLastRow();
      if (lastRow > 1) {
        summarySheet.getRange(2, 1, lastRow - 1, 4).clear();
      }
    }
    
    // データ取得
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      Logger.log("集計更新: データがありません");
      return;
    }
    
    var data = sheet.getRange(2, 7, lastRow - 1, 4).getValues(); // G列〜J列
    
    // 開催日ごとに集計
    var summary = {};
    
    for (var i = 0; i < data.length; i++) {
      var eventDate = data[i][0]; // 参加希望日
      var repeaterType = data[i][3]; // リピーター区分
      
      if (!eventDate || eventDate === "" || eventDate === "（未指定）") continue;
      
      if (!summary[eventDate]) {
        summary[eventDate] = { total: 0, first: 0, repeater: 0 };
      }
      
      summary[eventDate].total++;
      
      if (repeaterType === "リピーター") {
        summary[eventDate].repeater++;
      } else {
        summary[eventDate].first++;
      }
    }
    
    // 集計結果をシートに書き込み
    var row = 2;
    for (var date in summary) {
      summarySheet.getRange(row, 1, 1, 4).setValues([[
        date,
        summary[date].total,
        summary[date].first,
        summary[date].repeater
      ]]);
      row++;
    }
    
    // 列幅を自動調整
    for (var i = 1; i <= 4; i++) {
      summarySheet.autoResizeColumn(i);
    }
    
    Logger.log("集計更新完了: " + (row - 2) + "件の開催日");
    
  } catch (error) {
    Logger.log("集計更新エラー: " + error.toString());
    throw error;
  }
}

// ====================================
// Google Formの質問項目をログ出力（デバッグ用）
// ====================================
function listFormQuestions() {
  try {
    var form = FormApp.getActiveForm();
    var items = form.getItems();
    
    Logger.log("=== Google Form 質問項目一覧 ===");
    Logger.log("フォーム名: " + form.getTitle());
    Logger.log("質問数: " + items.length);
    Logger.log("");
    
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      Logger.log((i + 1) + ". " + item.getTitle() + " (" + item.getType() + ")");
    }
    
    Logger.log("================================");
    
  } catch (error) {
    Logger.log("質問項目取得エラー: " + error.toString());
  }
}
