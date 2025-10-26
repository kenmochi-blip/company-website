// ===================================
// Configuration
// ===================================

// Google Apps Script Web App URL (要設定)
// README.mdの手順に従ってGoogle Apps ScriptをデプロイしてURLを取得してください
const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// Google Form URL (要設定)
const GOOGLE_FORM_URL = 'YOUR_GOOGLE_FORM_URL_HERE';

// フォールバック用のスケジュールデータ
const FALLBACK_SCHEDULE = [
    { date: '11月29日(金)', location: '京都', maxParticipants: 5, status: '募集中' },
    { date: '12月13日(金)', location: '東京', maxParticipants: 10, status: '募集中' },
    { date: '1月24日(金)', location: '東京', maxParticipants: 10, status: '募集中' },
    { date: '2月21日(金)', location: '京都', maxParticipants: 5, status: '募集中' },
    { date: '3月7日(金)', location: '東京', maxParticipants: 10, status: '募集中' }
];

// ===================================
// Schedule Management
// ===================================

/**
 * Googleスプレッドシートからスケジュールを取得
 */
async function fetchScheduleFromGoogle() {
    try {
        // URLが設定されていない場合はフォールバックを使用
        if (GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            console.log('Google Apps Script URLが設定されていません。フォールバックデータを使用します。');
            return { success: false, data: FALLBACK_SCHEDULE, useFallback: true };
        }

        const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // データの検証
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid data format');
        }
        
        return { success: true, data: data, useFallback: false };
    } catch (error) {
        console.error('スケジュールの取得に失敗しました:', error);
        return { success: false, data: FALLBACK_SCHEDULE, useFallback: true };
    }
}

/**
 * スケジュールカードを生成
 */
function createScheduleCard(schedule) {
    const card = document.createElement('div');
    card.className = 'schedule-card fade-in';
    
    // 満員の場合はクラスを追加
    if (schedule.status === '満員' || schedule.status === '募集終了') {
        card.classList.add('status-full');
    }
    
    card.innerHTML = `
        <div class="schedule-date">${schedule.date}</div>
        <div class="schedule-location">📍 ${schedule.location}</div>
        <div class="schedule-capacity">定員: ${schedule.maxParticipants}名</div>
    `;
    
    return card;
}

/**
 * スケジュールを画面に表示
 */
async function displaySchedule() {
    const loadingElement = document.getElementById('schedule-loading');
    const gridElement = document.getElementById('schedule-grid');
    const errorElement = document.getElementById('schedule-error');
    
    // ローディング表示
    loadingElement.style.display = 'block';
    gridElement.style.display = 'none';
    errorElement.style.display = 'none';
    
    // スケジュールを取得
    const result = await fetchScheduleFromGoogle();
    
    // ローディングを非表示
    loadingElement.style.display = 'none';
    
    // エラーメッセージの表示（フォールバック使用時）
    if (result.useFallback) {
        errorElement.style.display = 'block';
    }
    
    // スケジュールカードを生成
    gridElement.innerHTML = '';
    result.data.forEach((schedule, index) => {
        const card = createScheduleCard(schedule);
        gridElement.appendChild(card);
        
        // フェードインアニメーション用の遅延
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });
    
    // グリッドを表示
    gridElement.style.display = 'grid';
}

// ===================================
// Application Button Handler
// ===================================

/**
 * 申し込みボタンのクリックイベント
 */
function handleApplicationClick() {
    if (GOOGLE_FORM_URL === 'YOUR_GOOGLE_FORM_URL_HERE') {
        alert('GoogleフォームのURLが設定されていません。\n\njs/script.js の GOOGLE_FORM_URL を設定してください。');
    } else {
        window.open(GOOGLE_FORM_URL, '_blank');
    }
}

// ===================================
// Smooth Scroll
// ===================================

/**
 * スムーススクロール
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Back to Top Button
// ===================================

/**
 * ページトップへ戻るボタンの表示/非表示
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Intersection Observer (Fade-in Animation)
// ===================================

/**
 * 要素が画面に入ったときのフェードインアニメーション
 */
function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // fade-inクラスを持つ全ての要素を監視
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// Header Scroll Effect
// ===================================

/**
 * スクロール時のヘッダーエフェクト
 */
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
        
        lastScroll = currentScroll;
    });
}

// ===================================
// Initialize on DOM Load
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // スケジュール表示
    displaySchedule();
    
    // 申し込みボタンのイベントリスナー
    const applyButton = document.getElementById('apply-button');
    if (applyButton) {
        applyButton.addEventListener('click', handleApplicationClick);
    }
    
    // スムーススクロール
    initSmoothScroll();
    
    // ページトップへ戻るボタン
    initBackToTop();
    
    // フェードインアニメーション
    initIntersectionObserver();
    
    // ヘッダースクロールエフェクト
    initHeaderScrollEffect();
    
    console.log('戦略MGマネジメントゲーム LP - 初期化完了');
    console.log('Google Apps Script URL:', GOOGLE_APPS_SCRIPT_URL);
    console.log('Google Form URL:', GOOGLE_FORM_URL);
});

// ===================================
// Export for Testing (Optional)
// ===================================

// テスト環境用のエクスポート（本番では使用しない）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchScheduleFromGoogle,
        createScheduleCard,
        displaySchedule,
        FALLBACK_SCHEDULE
    };
}