// ==========================================
// Mobile Navigation Toggle
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    
    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Close mobile menu when clicking menu items
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // ==========================================
    // Header Scroll Effect
    // ==========================================
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // ==========================================
    // Smooth Scroll for Anchor Links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==========================================
    // Page Top Button
    // ==========================================
    const pageTopBtn = document.querySelector('.page-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            pageTopBtn.classList.add('visible');
        } else {
            pageTopBtn.classList.remove('visible');
        }
    });
    
    pageTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ==========================================
    // Fade-in Animation on Scroll
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observerCallback = function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Add fade-in class to elements
    const fadeElements = document.querySelectorAll('.feature-card, .activity-card, .faq-item, .organizer-card, .persona-card');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // ==========================================
    // FAQ Accordion (Optional Enhancement)
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        // Add animation delay
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    // ==========================================
    // Parallax Effect for Hero Section
    // ==========================================
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }
    
    // ==========================================
    // Loading Animation
    // ==========================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // ==========================================
    // Email Link Protection (Simple obfuscation)
    // ==========================================
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // You can add additional tracking or validation here
            console.log('Email link clicked');
        });
    });
    
    // ==========================================
    // Responsive Image Loading
    // ==========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ==========================================
    // Accessibility: Focus Management
    // ==========================================
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // ==========================================
    // Print Styles Support
    // ==========================================
    window.addEventListener('beforeprint', function() {
        // Expand all collapsed content before printing
        const collapsedElements = document.querySelectorAll('.collapsed');
        collapsedElements.forEach(el => {
            el.classList.remove('collapsed');
        });
    });
    
    // ==========================================
    // Performance: Debounce Scroll Events
    // ==========================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debounce to scroll-heavy functions
    const debouncedScroll = debounce(function() {
        // Additional scroll-based functions can be added here
    }, 10);
    
    window.addEventListener('scroll', debouncedScroll);
    
    // ==========================================
    // Console Welcome Message
    // ==========================================
    console.log('%c大人の寺子屋「歴読ウォーク」', 'font-size: 20px; font-weight: bold; color: #1B3D6D;');
    console.log('%c本で学び、現地で感じる。深く繋がり、共に育つ「最高の居場所」', 'font-size: 14px; color: #C8A882;');
    console.log('Website: https://smartandsmooth.com/rekidokuwalk/');
});