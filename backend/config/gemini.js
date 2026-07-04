const { GoogleGenerativeAI } = require('@google/generative-ai');

// تهيئة Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ استخدم نموذجاً واحداً فقط (الأكثر توافقاً)
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

console.log('✅ استخدام نموذج: gemini-pro');

// ========================================
// دالة الحصول على رد من Gemini
// ========================================
async function getGeminiResponse(prompt) {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('❌ خطأ في Gemini:', error.message);
        return null;
    }
}

// ========================================
// دالة الرد على رسائل الشات بوت
// ========================================
async function getChatbotReply(userMessage) {
    const context = `
    أنت مساعد افتراضي لوكالة رقمية مغربية (Digital Agency MA).
    الوكالة متخصصة في:
    - تطوير تطبيقات الهاتف (Android & iOS)
    - تصميم وتطوير المواقع الإلكترونية
    - التسويق الرقمي وإدارة الحملات الإعلانية
    - التصميم الجرافيكي والهوية البصرية
    - التصوير الجوي بالدرون بدقة 4K
    
    أجب على استفسارات العملاء بلغة عربية فصحى أو عامية مفهومة.
    كن محترفاً، ودوداً، ومفيداً.
    قدم معلومات دقيقة عن الخدمات.
    إذا سُئلت عن الأسعار، قل أن الأسعار تختلف حسب المشروع ويمكن تقديم عرض سعر مجاني.
    
    رسالة العميل: ${userMessage}
    `;
    
    const reply = await getGeminiResponse(context);
    
    // إذا فشل Gemini، استخدم الردود الافتراضية
    if (!reply) {
        return getFallbackReply(userMessage);
    }
    
    return reply;
}

// ========================================
// ردود افتراضية (في حالة فشل Gemini)
// ========================================
function getFallbackReply(message) {
    const lowerMsg = message.toLowerCase();
    
    const responses = [
        {
            keywords: ['مرحبا', 'السلام', 'اهلا', 'صباح', 'مساء', 'hi', 'hello'],
            reply: '👋 مرحباً بك! كيف يمكنني مساعدتك اليوم؟'
        },
        {
            keywords: ['خدمات', 'تطبيقات', 'مواقع', 'تصميم', 'تسويق', 'درون', 'services'],
            reply: '🚀 نقدم خدمات متنوعة:\n• تطبيقات الهاتف (Android & iOS)\n• تصميم وتطوير المواقع\n• التسويق الرقمي\n• التصميم الجرافيكي والهوية البصرية\n• التصوير الجوي بالدرون\n\nهل تريد معرفة المزيد عن خدمة معينة؟'
        },
        {
            keywords: ['سعر', 'تكلفة', 'كم', 'ثمن', 'بكم', 'price', 'cost'],
            reply: '💰 أسعارنا تختلف حسب نوع الخدمة ومتطلبات المشروع.\nنقدم عروض أسعار مجانية حسب احتياجاتك.\nتواصل معنا للحصول على عرض سعر مخصص.'
        },
        {
            keywords: ['تواصل', 'اتصال', 'رقم', 'هاتف', 'واتساب', 'contact', 'phone'],
            reply: '📞 يمكنك التواصل معنا عبر:\n• الهاتف: +212 600 000 000\n• البريد: info@digitalagency.ma\n• واتساب: +212 600 000 000'
        },
        {
            keywords: ['شكر', 'جزاك', 'الله', 'خير', 'thanks'],
            reply: '🙏 العفو! نحن في خدمتك دائماً.\nهل هناك شيء آخر يمكنني مساعدتك به؟'
        }
    ];

    for (const item of responses) {
        if (item.keywords.some(keyword => lowerMsg.includes(keyword))) {
            return item.reply;
        }
    }

    return `🤔 شكراً لسؤالك "${message}".\n\n📌 يمكنني مساعدتك في:\n• التعريف بخدماتنا\n• معرفة الأسعار والتكاليف\n• معلومات عن المشاريع والمدة\n• طرق التواصل معنا\n\nهل لديك سؤال محدد عن أي من هذه النقاط؟`;
}

module.exports = { getGeminiResponse, getChatbotReply };