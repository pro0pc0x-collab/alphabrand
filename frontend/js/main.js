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