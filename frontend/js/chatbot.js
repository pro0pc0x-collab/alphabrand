// ========================================
// CHATBOT.JS - نسخة مبسطة
// ========================================

console.log('✅ chatbot.js تم تحميله');

// ========================================
// فتح/إغلاق الشات بوت
// ========================================
function toggleChatbot() {
    console.log('🔘 toggleChatbot تم استدعاؤها');
    
    const widget = document.getElementById('chatbotWidget');
    const fab = document.getElementById('chatbotFab');
    
    if (!widget) {
        console.error('❌ chatbotWidget غير موجود');
        return;
    }
    
    // تبديل العرض
    if (widget.style.display === 'none' || widget.style.display === '') {
        widget.style.display = 'flex';
        if (fab) fab.style.display = 'none';
        console.log('🤖 الشات بوت: مفتوح');
    } else {
        widget.style.display = 'none';
        if (fab) fab.style.display = 'flex';
        console.log('🤖 الشات بوت: مغلق');
    }
}

// ========================================
// إرسال رسالة
// ========================================
function sendChatMessage() {
    console.log('📤 sendChatMessage تم استدعاؤها');
    
    const input = document.getElementById('chatbotInput');
    if (!input) {
        console.error('❌ chatbotInput غير موجود');
        return;
    }
    
    const message = input.value.trim();
    if (!message) {
        console.log('📝 رسالة فارغة');
        return;
    }
    
    console.log('📝 الرسالة:', message);
    
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) {
        console.error('❌ chatbotMessages غير موجود');
        return;
    }

    // إضافة رسالة المستخدم
    const userMsg = document.createElement('div');
    userMsg.className = 'msg user';
    userMsg.textContent = message;
    messagesContainer.appendChild(userMsg);
    input.value = '';

    // إضافة رسالة انتظار
    const botMsg = document.createElement('div');
    botMsg.className = 'msg bot';
    botMsg.textContent = '⏳ جاري التفكير...';
    messagesContainer.appendChild(botMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // إرسال إلى الخادم
    fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    })
    .then(response => response.json())
    .then(data => {
        console.log('📥 رد الخادم:', data);
        if (data.reply) {
            botMsg.textContent = data.reply;
        } else {
            botMsg.textContent = '⚠️ عذراً، لم أستطع معالجة رسالتك.';
        }
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    })
    .catch(error => {
        console.error('❌ خطأ:', error);
        botMsg.textContent = '❌ عذراً، حدث خطأ في الاتصال بالخادم.';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}

// ========================================
// ربط الأحداث عند تحميل الصفحة
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM جاهز');
    
    // ربط زر الإرسال
    const sendBtn = document.querySelector('.chatbot-input button');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendChatMessage);
        console.log('✅ زر الإرسال تم ربطه');
    }
    
    // ربط Enter
    const input = document.getElementById('chatbotInput');
    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendChatMessage();
            }
        });
        console.log('✅ حقل الإدخال تم ربطه');
    }
    
    // ربط زر الشات بوت (بديل لـ onclick)
    const fab = document.getElementById('chatbotFab');
    if (fab) {
        // إزالة onclick القديم
        fab.removeAttribute('onclick');
        fab.addEventListener('click', toggleChatbot);
        console.log('✅ زر الشات بوت تم ربطه');
    }
});

console.log('✅ chatbot.js تم التحميل بالكامل');