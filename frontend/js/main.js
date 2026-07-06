// ========================================
// MAIN.JS - الوظائف الرئيسية
// ========================================

console.log('✅ main.js تم تحميله');

// ========================================
// تحديث أزرار المصادقة
// ========================================
function updateAuthButtons() {
    const token = localStorage.getItem('token');
    const loginBtn = document.getElementById('loginBtn');
    const dashboardBtn = document.getElementById('dashboardBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    console.log('🔐 تحديث الأزرار، token:', token ? 'موجود' : 'غير موجود');
    
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
    console.log('🚪 محاولة تسجيل الخروج');
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        localStorage.removeItem('token');
        updateAuthButtons();
        alert('✅ تم تسجيل الخروج بنجاح');
        window.location.href = '/index.html';
    }
}

// ========================================
// القائمة الجانبية
// ========================================
function toggleMobileNav() {
    const nav = document.getElementById('mobileNav');
    if (nav) nav.classList.toggle('open');
}

// ========================================
// تبديل الثيم
// ========================================
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// استعادة الثيم
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// ========================================
// التهيئة
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM جاهز');
    updateAuthButtons();
});

// Shared UI helpers used by inline handlers across the static pages.
function closeMobileNav() {
    const nav = document.getElementById('mobileNav');
    if (nav) nav.classList.remove('open');
}

function cycleLang() {
    const langs = ['AR', 'FR', 'EN'];
    const btn = document.querySelector('.nav-lang-btn');
    if (!btn) return;
    const current = langs.indexOf(btn.textContent.trim().toUpperCase());
    btn.textContent = langs[(current + 1) % langs.length];
}

function toggleFaq(button) {
    const item = button.closest('.faq-item, .card, div');
    if (!item) return;
    const answer = item.querySelector('.faq-answer, .answer, p:not(:first-child), div:last-child');
    item.classList.toggle('active');
    if (answer && answer !== button) {
        const isHidden = answer.style.display === 'none' || getComputedStyle(answer).display === 'none';
        answer.style.display = isHidden ? 'block' : 'none';
    }
}

function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    toast.style.cssText = 'background:var(--bg-card,#111);color:var(--text-primary,#fff);border:1px solid var(--border-primary,#333);border-radius:8px;padding:12px 16px;margin-top:8px;box-shadow:0 8px 24px rgba(0,0,0,.25);';
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

window.updateAuthButtons = updateAuthButtons;
window.logout = logout;
window.toggleMobileNav = toggleMobileNav;
window.closeMobileNav = closeMobileNav;
window.cycleLang = cycleLang;
window.toggleFaq = toggleFaq;
window.showToast = showToast;
