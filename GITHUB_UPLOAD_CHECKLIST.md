/* ===================================
   歴読ウォーク - スタイルシート
   =================================== */

/* === Reset & Base === */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* カラーテーマ（歴史・和風テーマの例） */
    --primary-color: #8B4513;      /* 茶色（歴史的なイメージ） */
    --secondary-color: #2E8B57;    /* 緑（自然・散策） */
    --accent-color: #DAA520;       /* ゴールド（アクセント） */
    --text-color: #333;
    --bg-color: #F5F5DC;           /* ベージュ */
    --white: #FFFFFF;
    
    /* スペーシング */
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 2rem;
    --spacing-lg: 3rem;
    --spacing-xl: 4rem;
}

body {
    font-family: 'Noto Sans JP', sans-serif;
    color: var(--text-color);
    line-height: 1.6;
    background-color: var(--bg-color);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: var(--spacing-lg);
    color: var(--primary-color);
}

/* === Header === */
.header {
    background-color: var(--white);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: var(--spacing-sm) 0;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.8rem;
    font-weight: 900;
    color: var(--primary-color);
}

.nav {
    display: flex;
    gap: var(--spacing-md);
}

.nav a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: color 0.3s;
}

.nav a:hover {
    color: var(--primary-color);
}

/* === Hero Section === */
.hero {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: var(--white);
    padding: var(--spacing-xl) 0;
    text-align: center;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-title {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: var(--spacing-sm);
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: var(--spacing-md);
    opacity: 0.9;
}

.btn-primary {
    display: inline-block;
    padding: 1rem 2rem;
    background-color: var(--accent-color);
    color: var(--white);
    text-decoration: none;
    border-radius: 50px;
    font-weight: 700;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* === About Section === */
.about {
    padding: var(--spacing-xl) 0;
    background-color: var(--white);
}

.about-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.about-content p {
    font-size: 1.125rem;
    margin-bottom: var(--spacing-sm);
}

/* === Events Section === */
.events {
    padding: var(--spacing-xl) 0;
    background-color: var(--bg-color);
}

.events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-md);
}

.event-card {
    background-color: var(--white);
    border-radius: 10px;
    padding: var(--spacing-md);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: var(--spacing-sm);
    transition: transform 0.3s;
}

.event-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.event-date {
    background-color: var(--primary-color);
    color: var(--white);
    padding: var(--spacing-sm);
    border-radius: 8px;
    text-align: center;
    min-width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.date-day {
    font-size: 2rem;
    font-weight: 900;
    line-height: 1;
}

.date-month {
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.event-info {
    flex: 1;
}

.event-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: var(--spacing-xs);
    color: var(--primary-color);
}

.event-location {
    font-size: 0.9rem;
    color: var(--secondary-color);
    margin-bottom: var(--spacing-xs);
}

.event-location i {
    margin-right: 0.25rem;
}

.event-description {
    font-size: 0.95rem;
    color: #666;
}

/* === Contact Section === */
.contact {
    padding: var(--spacing-xl) 0;
    background-color: var(--white);
}

.contact-content {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
}

/* === Footer === */
.footer {
    background-color: var(--primary-color);
    color: var(--white);
    text-align: center;
    padding: var(--spacing-md) 0;
}

/* === Responsive === */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .nav {
        flex-direction: column;
        gap: var(--spacing-sm);
        text-align: center;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .section-title {
        font-size: 2rem;
    }

    .events-grid {
        grid-template-columns: 1fr;
    }

    .event-card {
        flex-direction: column;
    }

    .event-date {
        width: 100%;
    }
}
