// ========================================
// CONTACT.JS - نموذج الاتصال
// ========================================

// ✅ API URL - الرابط النهائي للخادم
const CONTACT_API = 'https://alphabrand.fly.dev/api/contact';

// ========================================
// إرسال رسالة الاتصال
// ========================================
async function sendContactMessage(event) {
    if (event) event.preventDefault();
    
    // جلب البيانات من النموذج
    const name = document.getElementById('contactName')?.value || '';
    const email = document.getElementById('contactEmail')?.value || '';
    const phone = document.getElementById('contactPhone')?.value || '';
    const subject = document.getElementById('contactSubject')?.value || '';
    const message = document.getElementById('contactMessage')?.value || '';
    
    // التحقق من الحقول المطلوبة
    if (!name || !email || !message) {
        showContactMessage('❌ الرجاء ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // ✅ استخدام الرابط الجديد
    try {
        const response = await fetch(CONTACT_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, subject, message })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showContactMessage('✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
            // إعادة تعيين النموذج
            document.getElementById('contactForm')?.reset();
        } else {
            showContactMessage('❌ فشل إرسال الرسالة: ' + (data.message || 'خطأ غير معروف'), 'error');
        }
    } catch (error) {
        console.error('❌ خطأ في الاتصال:', error);
        showContactMessage('❌ حدث خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت.', 'error');
    }
}

// ========================================
// عرض رسالة حالة النموذج
// ========================================
function showContactMessage(text, type = 'success') {
    const container = document.getElementById('formMessage');
    if (!container) return;
    
    container.style.display = 'block';
    container.style.padding = '12px 16px';
    container.style.borderRadius = '8px';
    container.style.marginTop = '1rem';
    container.style.fontWeight = '500';
    
    if (type === 'success') {
        container.style.background = 'rgba(0, 184, 148, 0.1)';
        container.style.color = '#00B894';
        container.style.border = '1px solid rgba(0, 184, 148, 0.3)';
    } else {
        container.style.background = 'rgba(225, 112, 85, 0.1)';
        container.style.color = '#E17055';
        container.style.border = '1px solid rgba(225, 112, 85, 0.3)';
    }
    
    container.textContent = text;
    
    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        container.style.opacity = '0';
        setTimeout(() => {
            container.style.display = 'none';
            container.style.opacity = '1';
        }, 300);
    }, 5000);
}

// ========================================
// التهيئة عند تحميل الصفحة
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ AlphaBrand - contact.js تم تحميله');
    
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', sendContactMessage);
    }
});

console.log('🚀 AlphaBrand - نموذج الاتصال جاهز');