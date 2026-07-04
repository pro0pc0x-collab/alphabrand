// ========================================
// التحقق من المصادقة (لجميع صفحات الداشبورد)
// ========================================
(function checkAuth() {
    const token = localStorage.getItem('token');
    const loginUrl = '../../frontend/login.html';
    
    if (!token) {
        window.location.href = loginUrl;
        return;
    }
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
            localStorage.removeItem('token');
            window.location.href = loginUrl;
            return;
        }
    } catch (error) {
        localStorage.removeItem('token');
        window.location.href = loginUrl;
    }
})();