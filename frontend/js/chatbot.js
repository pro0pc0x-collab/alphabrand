// ========================================
// CHATBOT.JS - النسخة الاحترافية
// ========================================

// ✅ API URL - الرابط النهائي للخادم
const CHATBOT_API = 'https://alphabrand.fly.dev/api/chatbot';

let isChatOpen = false;

// ========================================
// فتح/إغلاق الشات بوت
// ========================================
function toggleChatbot() {
    const widget = document.getElementById('chatbotWidget');
    const fab = document.getElementById('chatbotFab');
    
    if (!widget || !fab) return;
    
    isChatOpen = !isChatOpen;
    widget.classList.toggle('active', isChatOpen);
    fab.style.display = isChatOpen ? 'none' : 'flex';
    
    if (isChatOpen) {
        const input = document.getElementById('chatbotInput');
        if (input) setTimeout(() => input.focus(), 100);
    }
}

// ========================================
// إرسال رسالة إلى الشات بوت
// ========================================
async function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
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
    
    try {
        // ✅ استخدام الرابط الجديد
        const response = await fetch(CHATBOT_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        if (data.reply) {
            botMsg.textContent = data.reply;
        } else {
            botMsg.textContent = '⚠️ عذراً، لم أستطع معالجة رسالتك. حاول مرة أخرى.';
        }
    } catch (error) {
        console.error('❌ خطأ في الشات بوت:', error);
        botMsg.textContent = '❌ عذراً، حدث خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت.';
    }
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ========================================
// إرسال بالضغط على Enter
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ AlphaBrand - chatbot.js تم تحميله');
    
    const input = document.getElementById('chatbotInput');
    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }
    
    // ربط زر الإرسال
    const sendBtn = document.querySelector('.chatbot-input button');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendChatMessage);
    }
});

console.log('🚀 AlphaBrand - الشات بوت جاهز');