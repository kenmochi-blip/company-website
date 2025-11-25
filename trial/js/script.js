// ================================================
// Configuration
// ================================================
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9975bepEECAXCmlMHQIUnt1aT9o46QEADmnrS8H_HD02_AfeeEgQNWm1CISzVPhwxEQ/exec';
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/1_YgIxqHqt1CLB086O8wZv1JOtzoYJYblzj4OFD_-5PU/viewform';

// Fallback schedule data (used when Google Sheets is unavailable)
const FALLBACK_SCHEDULE = [
    { date: '11月29日(金)', location: '京都', maxParticipants: 5, status: '募集中' },
    { date: '12月13日(金)', location: '東京', maxParticipants: 10, status: '募集中' },
    { date: '1月24日(金)', location: '東京', maxParticipants: 10, status: '募集中' },
    { date: '2月21日(金)', location: '京都', maxParticipants: 5, status: '募集中' },
    { date: '3月7日(金)', location: '東京', maxParticipants: 10, status: '募集中' }
];

// ================================================
// Date Parsing and Filtering
// ================================================

/**
 * 日本語の日付文字列を解析してDateオブジェクトを返す
 * 対応形式: 「2025年11月29日（土）」「11月29日(金)」
 * @param {string} dateStr - 日付文字列
 * @returns {Date|null} - Dateオブジェクト、または解析失敗時はnull
 */
function parseJapaneseDate(dateStr) {
    try {
        // 「2025年11月29日（土）」のような形式（年付き）
        let match = dateStr.match(/(\d{4})年(\d+)月(\d+)日/);
        if (match) {
            const year = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const day = parseInt(match[3], 10);
            
            const date = new Date(year, month - 1, day);
            if (isNaN(date.getTime())) return null;
            
            console.log(`日付解析成功（年付き）: ${dateStr} → ${date.toLocaleDateString('ja-JP')}`);
            return date;
        }
        
        // 「11月29日(金)」のような形式（年なし）
        match = dateStr.match(/(\d+)月(\d+)日/);
        if (!match) {
            console.warn(`日付形式が認識できません: ${dateStr}`);
            return null;
        }
        
        const month = parseInt(match[1], 10);
        const day = parseInt(match[2], 10);
        
        // 現在の年を取得
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // 0-indexed to 1-indexed
        
        // 月が現在より前の場合は来年と判断
        let year = currentYear;
        if (month < currentMonth) {
            year = currentYear + 1;
        }
        
        // Dateオブジェクトを作成（月は0-indexedなので-1）
        const date = new Date(year, month - 1, day);
        
        // 有効な日付かチェック
        if (isNaN(date.getTime())) return null;
        
        console.log(`日付解析成功（年なし）: ${dateStr} → ${date.toLocaleDateString('ja-JP')}`);
        return date;
    } catch (error) {
        console.error('日付の解析に失敗しました:', dateStr, error);
        return null;
    }
}

/**
 * 開催日が今日以降かどうかをチェック
 * @param {string} dateStr - 日付文字列
 * @returns {boolean} - 今日以降の場合true
 */
function isFutureOrToday(dateStr) {
    const eventDate = parseJapaneseDate(dateStr);
    if (!eventDate) {
        console.warn(`  ⚠️ 日付解析失敗。安全のため表示します: ${dateStr}`);
        return true; // 解析失敗時は安全のため表示する
    }
    
    // 今日の日付（時刻を00:00:00にリセット）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // イベント日（時刻を00:00:00にリセット）
    eventDate.setHours(0, 0, 0, 0);
    
    // 今日以降かチェック
    const isFuture = eventDate >= today;
    
    console.log(`  📅 イベント日: ${eventDate.toLocaleDateString('ja-JP')}`);
    console.log(`  📅 今日: ${today.toLocaleDateString('ja-JP')}`);
    console.log(`  ✓ 判定: ${isFuture ? '未来または今日' : '過去'}`);
    
    return isFuture;
}

/**
 * スケジュールデータをフィルタリング（開催済みを除外）
 * @param {Array} schedules - スケジュールデータの配列
 * @returns {Array} - フィルタリング後のスケジュール配列
 */
function filterUpcomingSchedules(schedules) {
    console.log('=== フィルタリング開始 ===');
    console.log(`対象スケジュール数: ${schedules.length}`);
    
    const filtered = schedules.filter((schedule, index) => {
        console.log(`\n[${index + 1}] ${schedule.date} @${schedule.location}`);
        
        // 状態が「開催済み」の場合は除外
        if (schedule.status && schedule.status === '開催済み') {
            console.log('→ 除外: 状態が「開催済み」');
            return false;
        }
        
        // 日付が過去の場合は除外
        const isFuture = isFutureOrToday(schedule.date);
        if (!isFuture) {
            console.log('→ 除外: 日付が過去');
            return false;
        }
        
        console.log('→ 表示対象');
        return true;
    });
    
    console.log(`\n=== フィルタリング完了 ===`);
    console.log(`表示対象: ${filtered.length}件`);
    
    return filtered;
}

// ================================================
// Schedule Management
// ================================================

/**
 * Fetch schedule data from Google Sheets via Apps Script
 * @returns {Promise<Array>} - Schedule data array
 */
async function fetchScheduleFromSheets() {
    try {
        // Check if Google Apps Script URL is configured
        if (GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            console.log('Google Apps Script URLが設定されていません。フォールバックデータを使用します。');
            return FALLBACK_SCHEDULE;
        }

        console.log('スプレッドシートからデータを取得中...', GOOGLE_APPS_SCRIPT_URL);
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('取得したデータ:', data);
        
        // Validate data structure
        if (!Array.isArray(data) || data.length === 0) {
            console.warn('スプレッドシートからのデータが空です。フォールバックデータを使用します。');
            return FALLBACK_SCHEDULE;
        }
        
        console.log(`✅ ${data.length}件のスケジュールを取得しました`);
        return data;
    } catch (error) {
        console.error('スケジュールデータの取得に失敗しました:', error);
        console.log('フォールバックデータを使用します。');
        return FALLBACK_SCHEDULE;
    }
}

/**
 * Render schedule items to the DOM
 * @param {Array} schedules - Schedule data array
 */
function renderSchedule(schedules) {
    const scheduleList = document.getElementById('schedule-list');
    const scheduleLoading = document.getElementById('schedule-loading');
    
    // Filter upcoming schedules (exclude past events)
    const upcomingSchedules = filterUpcomingSchedules(schedules);
    
    // Hide loading, show schedule list
    scheduleLoading.style.display = 'none';
    scheduleList.style.display = 'grid';
    
    // Clear existing content
    scheduleList.innerHTML = '';
    
    // Check if there are any upcoming schedules
    if (upcomingSchedules.length === 0) {
        scheduleList.innerHTML = `
            <div class="schedule-item" style="grid-column: 1 / -1; text-align: center;">
                <p style="font-size: 1.2rem; color: var(--text-gray);">現在、募集中の開催予定はありません。</p>
            </div>
        `;
        return;
    }
    
    // Render each upcoming schedule item
    upcomingSchedules.forEach(schedule => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item fade-in';
        
        scheduleItem.innerHTML = `
            <div class="schedule-date">${schedule.date}</div>
            <div class="schedule-location">📍 ${schedule.location}</div>
            <div class="schedule-capacity">定員: ${schedule.maxParticipants}名</div>
            ${schedule.status ? `<div class="schedule-status">${schedule.status}</div>` : ''}
            <div class="schedule-apply-hint">クリックして申し込む →</div>
        `;
        
        // Add click event to open Google Form
        scheduleItem.style.cursor = 'pointer';
        scheduleItem.addEventListener('click', () => {
            handleApplyClick();
        });
        
        scheduleList.appendChild(scheduleItem);
    });
    
    // Trigger fade-in animation
    setTimeout(() => {
        document.querySelectorAll('.schedule-item').forEach(item => {
            item.classList.add('visible');
        });
    }, 100);
}

/**
 * Initialize schedule display
 */
async function initSchedule() {
    const schedules = await fetchScheduleFromSheets();
    renderSchedule(schedules);
}

// ================================================
// Apply Button Handler
// ================================================

/**
 * Handle apply button click
 */
function handleApplyClick() {
    if (GOOGLE_FORM_URL === 'YOUR_GOOGLE_FORM_URL_HERE') {
        alert('申し込みフォームのURLが設定されていません。\n管理者にお問い合わせください。');
        return;
    }
    
    // Google Analyticsにイベント送信
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click_apply_button', {
            'event_category': 'Application',
            'event_label': 'Management Game Trial - Apply Button Click',
            'value': 10000
        });
        
        // Google広告コンバージョンイベント送信
        // ★★★ Google広告でキャンペーン作成後、以下のコメントを外して設定してください ★★★
        /*
        gtag('event', 'conversion', {
            'send_to': 'AW-XXXXXXXXXX/xxxxx',  // ← Google広告から取得したコンバージョンIDに置き換え
            'value': 10000,
            'currency': 'JPY'
        });
        */
    }
    
    // Meta Pixelにイベント送信
    if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
            value: 10000,
            currency: 'JPY',
            content_name: 'マネジメントゲーム体験研修',
            content_category: '研修・セミナー'
        });
    }
    
    // Google Formを新しいタブで開く
    window.open(GOOGLE_FORM_URL, '_blank');
}

// ================================================
// Smooth Scroll
// ================================================

/**
 * Initialize smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ================================================
// Back to Top Button
// ================================================

/**
 * Initialize back to top button
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

// ================================================
// Intersection Observer for Fade-in Animation
// ================================================

/**
 * Initialize fade-in animation on scroll
 */
function initFadeInAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements that should fade in
    document.querySelectorAll('.target-item, .point, .testimonial-item, .detail-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ================================================
// Mobile Menu
// ================================================

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu nav a');
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    
    // Open mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close mobile menu
    const closeMobileMenu = () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // Close when clicking overlay
    overlay.addEventListener('click', closeMobileMenu);
    
    // Close when clicking menu links
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// ================================================
// Initialization
// ================================================

/**
 * Initialize all functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initSchedule();
    initSmoothScroll();
    initBackToTop();
    initFadeInAnimation();
    initMobileMenu();
    
    // Add event listener to apply button
    const applyButton = document.getElementById('apply-button');
    if (applyButton) {
        applyButton.addEventListener('click', handleApplyClick);
    }
    
    // Add event listeners to all CTA buttons
    document.querySelectorAll('.cta-button, .cta-button-small').forEach(button => {
        if (button.getAttribute('href') === '#apply') {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                handleApplyClick();
            });
        }
    });
});
