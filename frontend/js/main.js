// ========================================
// MAIN.JS - النسخة الاحترافية
// ========================================

// ✅ API URL - الرابط النهائي للخادم
const API_URL = 'https://alphabrand.fly.dev/api';

// ========================================
// تحديث أزرار المصادقة
// ========================================
function updateAuthButtons() {
    const token = localStorage.getItem('token');
    const loginBtn = document.getElementById('loginBtn');
    const dashboardBtn = document.getElementById('dashboardBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (token) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (dashboardBtn) dashboardBtn.style.display = 'inline-flex';
        if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-flex';
        if (dashboardBtn) dashboardBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// ========================================
// تسجيل الخروج
// ========================================
function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        localStorage.removeItem('token');
        updateAuthButtons();
        showToast('✅ تم تسجيل الخروج بنجاح', 'success');
        setTimeout(() => window.location.reload(), 500);
    }
}

// ========================================
// عرض رسائل Toast
// ========================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        background: ${type === 'success' ? '#00B894' : type === 'error' ? '#E17055' : '#FDCB6E'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        margin-bottom: 10px;
        animation: fadeInUp 0.3s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// تبديل الثيم (Dark/Light)
// ========================================
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
}

// ========================================
// تبديل اللغة
// ========================================
let currentLang = 'ar';

function cycleLang() {
    const langs = ['ar', 'fr', 'en'];
    const currentIndex = langs.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % langs.length;
    currentLang = langs[nextIndex];
    const btn = document.querySelector('.nav-lang-btn');
    if (btn) btn.textContent = currentLang.toUpperCase();
    localStorage.setItem('lang', currentLang);
}

// ========================================
// القائمة الجانبية (Mobile)
// ========================================
function toggleMobileNav() {
    const nav = document.getElementById('mobileNav');
    const hamburger = document.getElementById('hamburger');
    if (nav) nav.classList.toggle('open');
    if (hamburger) hamburger.classList.toggle('active');
}

function closeMobileNav() {
    const nav = document.getElementById('mobileNav');
    if (nav) nav.classList.remove('open');
}

// ========================================
// التهيئة عند تحميل الصفحة
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ AlphaBrand - main.js تم تحميله');
    
    // تحديث أزرار المصادقة
    updateAuthButtons();
    
    // استعادة الثيم
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = document.getElementById('themeIcon');
        if (icon) icon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    }
    
    // استعادة اللغة
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
        currentLang = savedLang;
        const btn = document.querySelector('.nav-lang-btn');
        if (btn) btn.textContent = currentLang.toUpperCase();
    }
    
    // ربط أزرار الثيم
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(e) {
        const nav = document.getElementById('mobileNav');
        const hamburger = document.getElementById('hamburger');
        if (nav && nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
            nav.classList.remove('open');
            if (hamburger) hamburger.classList.remove('active');
        }
    });
});

console.log('🚀 AlphaBrand - جميع الوظائف جاهزة');