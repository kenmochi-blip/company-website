/**
 * Google Sheetsのスケジュールデータを元に、
 * Google Formsの日時選択肢を自動更新するスクリプト
 * 
 * 設定方法:
 * 1. Google Sheetsで「拡張機能」→「Apps Script」を開く
 * 2. このコードを貼り付け
 * 3. 定数（FORM_ID, SHEET_NAME, QUESTION_TITLE）を自分の環境に合わせて変更
 * 4. 「トリガー」を設定して、シート編集時に自動実行
 */

// ================================================
// 設定（各自の環境に合わせて変更してください）
// ================================================

// Google FormsのID（URLから取得）
// 例: https://docs.google.com/forms/d/[この部分]/edit
const FORM_ID = '1_YgIxqHqt1CLB086O8wZv1JOtzoYJYblzj4OFD_-5PU';

// スケジュールが記載されているシート名
const SHEET_NAME = 'シート1'; // 実際のシート名に変更してください

// Google Forms内の質問タイトル（日時を選択する質問）
const QUESTION_TITLE = '参加希望日時'; // 実際の質問タイトルに変更してください

// ================================================
// メイン処理
// ================================================

/**
 * シート編集時に自動実行される関数
 * Google Sheetsのトリガー設定で「編集時」に実行するよう設定してください
 */
function onEdit(e) {
  updateFormChoices();
}

/**
 * Google Formsの選択肢を更新する
 */
function updateFormChoices() {
  try {
    // Google Sheetsからスケジュールデータを取得
    const schedules = getSchedulesFromSheet();
    
    // 過去の日程を除外
    const upcomingSchedules = filterUpcomingSchedules(schedules);
    
    // 選択肢用のテキスト配列を作成
    const choices = createChoicesArray(upcomingSchedules);
    
    // Google Formsの選択肢を更新
    updateFormQuestion(choices);
    
    Logger.log('✅ Google Formsの選択肢を更新しました');
    Logger.log(`更新された選択肢数: ${choices.length}`);
    Logger.log(`選択肢: ${choices.join(', ')}`);
    
  } catch (error) {
    Logger.log('❌ エラーが発生しました: ' + error.message);
    throw error;
  }
}

/**
 * Google Sheetsからスケジュールデータを取得
 */
function getSchedulesFromSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    throw new Error(`シート「${SHEET_NAME}」が見つかりません`);
  }
  
  // データ範囲を取得（ヘッダー行を除く）
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // ヘッダー行を取得してカラムインデックスを特定
  const headers = values[0];
  const dateCol = headers.indexOf('日付');
  const locationCol = headers.indexOf('開催地');
  const maxParticipantsCol = headers.indexOf('定員');
  const statusCol = headers.indexOf('ステータス');
  
  if (dateCol === -1 || locationCol === -1) {
    throw new Error('必要なカラム（日付、開催地）が見つかりません');
  }
  
  // データ行を処理
  const schedules = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    
    // 空行をスキップ
    if (!row[dateCol]) continue;
    
    schedules.push({
      date: row[dateCol],
      location: row[locationCol] || '',
      maxParticipants: row[maxParticipantsCol] || '',
      status: row[statusCol] || '募集中'
    });
  }
  
  return schedules;
}

/**
 * 過去の日程を除外する
 */
function filterUpcomingSchedules(schedules) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return schedules.filter(schedule => {
    // ステータスが「募集中」のもののみ
    if (schedule.status !== '募集中') return false;
    
    // 日付を解析
    const scheduleDate = parseJapaneseDate(schedule.date);
    if (!scheduleDate) return false;
    
    // 今日以降の日程のみ
    return scheduleDate >= today;
  });
}

/**
 * 日本語の日付文字列を解析してDateオブジェクトに変換
 */
function parseJapaneseDate(dateStr) {
  try {
    // 「2025年11月29日（土）」形式
    let match = dateStr.match(/(\d{4})年(\d+)月(\d+)日/);
    if (match) {
      return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
    }
    
    // 「11月29日(金)」形式（年なし）
    match = dateStr.match(/(\d+)月(\d+)日/);
    if (match) {
      const currentYear = new Date().getFullYear();
      const month = parseInt(match[1]) - 1;
      const day = parseInt(match[2]);
      let date = new Date(currentYear, month, day);
      
      // 日付が過去の場合は来年とみなす
      if (date < new Date()) {
        date = new Date(currentYear + 1, month, day);
      }
      
      return date;
    }
    
    return null;
  } catch (error) {
    Logger.log(`日付の解析に失敗: ${dateStr}`);
    return null;
  }
}

/**
 * 選択肢用のテキスト配列を作成
 */
function createChoicesArray(schedules) {
  return schedules.map(schedule => {
    // 「11月29日(金) - 京都」のような形式
    return `${schedule.date} - ${schedule.location}`;
  });
}

/**
 * Google Formsの質問選択肢を更新
 */
function updateFormQuestion(choices) {
  const form = FormApp.openById(FORM_ID);
  const items = form.getItems();
  
  // 指定されたタイトルの質問を検索
  let targetQuestion = null;
  for (let item of items) {
    if (item.getTitle() === QUESTION_TITLE) {
      targetQuestion = item;
      break;
    }
  }
  
  if (!targetQuestion) {
    throw new Error(`質問「${QUESTION_TITLE}」が見つかりません`);
  }
  
  // 質問タイプに応じて選択肢を更新
  const itemType = targetQuestion.getType();
  
  if (itemType === FormApp.ItemType.MULTIPLE_CHOICE) {
    // ラジオボタン（単一選択）
    const mcItem = targetQuestion.asMultipleChoiceItem();
    mcItem.setChoiceValues(choices);
    
  } else if (itemType === FormApp.ItemType.CHECKBOX) {
    // チェックボックス（複数選択）
    const cbItem = targetQuestion.asCheckboxItem();
    cbItem.setChoiceValues(choices);
    
  } else if (itemType === FormApp.ItemType.LIST) {
    // プルダウンリスト
    const listItem = targetQuestion.asListItem();
    listItem.setChoiceValues(choices);
    
  } else {
    throw new Error(`質問タイプ「${itemType}」は対応していません`);
  }
  
  Logger.log('✅ 選択肢を更新しました');
}

// ================================================
// トリガー設定用の関数（初回のみ手動実行）
// ================================================

/**
 * 編集時トリガーを設定する（初回のみ手動実行してください）
 */
function setupTrigger() {
  // 既存のトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onEdit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // 新しいトリガーを作成
  ScriptApp.newTrigger('onEdit')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
  
  Logger.log('✅ 編集時トリガーを設定しました');
}

/**
 * 手動で選択肢を更新する（テスト用）
 */
function manualUpdate() {
  updateFormChoices();
}
