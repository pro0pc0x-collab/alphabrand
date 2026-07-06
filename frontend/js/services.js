// ========================================
// SERVICES.JS - تحميل وعرض الخدمات
// ========================================

// ✅ API URL - الرابط النهائي للخادم
const SERVICES_API = 'https://alphabrand.fly.dev/api/services';

// ========================================
// تحميل الخدمات
// ========================================
async function loadServices() {
    try {
        console.log('📡 جلب الخدمات من الخادم...');
        
        // ✅ استخدام الرابط الجديد
        const response = await fetch(SERVICES_API);
        const data = await response.json();
        
        if (!data.success) {
            console.warn('⚠️ فشل جلب الخدمات:', data.message);
            return;
        }
        
        const grid = document.getElementById('servicesGrid');
        if (!grid) {
            console.warn('⚠️ عنصر servicesGrid غير موجود');
            return;
        }
        
        const services = data.services.filter(s => s.isActive).slice(0, 6);
        
        if (services.length === 0) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">
                    <div style="font-size:3rem;margin-bottom:1rem;">🔧</div>
                    <p>لا توجد خدمات متاحة حالياً</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = services.map(service => `
            <div class="service-card" data-aos="fade-up" data-aos-delay="${services.indexOf(service) * 100}">
                <div class="icon">${service.icon || '🚀'}</div>
                <h3>${service.title?.ar || 'خدمة'}</h3>
                <p>${service.description?.ar || ''}</p>
                <span class="price">${service.basePrice} ${service.currency}</span>
                <a href="request-service.html?service=${service._id}" class="btn btn-primary btn-sm" style="margin-top:1rem;width:100%;justify-content:center;display:inline-flex;align-items:center;gap:0.5rem;">
                    اطلب الخدمة
                </a>
            </div>
        `).join('');
        
        console.log('✅ تم تحميل الخدمات بنجاح');
        
    } catch (error) {
        console.error('❌ خطأ في تحميل الخدمات:', error);
        const grid = document.getElementById('servicesGrid');
        if (grid) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">
                    <div style="font-size:3rem;margin-bottom:1rem;">⚠️</div>
                    <p>حدث خطأ في تحميل الخدمات. تأكد من اتصالك بالإنترنت.</p>
                    <button onclick="loadServices()" class="btn btn-primary" style="margin-top:1rem;">إعادة المحاولة</button>
                </div>
            `;
        }
    }
}

// ========================================
// تحميل معرض الأعمال
// ========================================
function loadPortfolio() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    
    const projects = [
        { icon: '📱', title: 'تطبيق توصيل', category: 'تطبيقات', tags: ['Flutter', 'Firebase'] },
        { icon: '🌐', title: 'موقع شركة عقارية', category: 'مواقع', tags: ['React', 'Node.js'] },
        { icon: '🚁', title: 'تصوير درون - سياحي', category: 'درون', tags: ['4K', 'مونتاج'] },
        { icon: '🎨', title: 'هوية بصرية', category: 'تصميم', tags: ['براندينغ', 'Adobe'] },
    ];
    
    grid.innerHTML = projects.map((project, index) => `
        <div class="portfolio-item" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="image">${project.icon}</div>
            <div class="content">
                <h4>${project.title}</h4>
                <p>${project.category}</p>
                <div class="tags">
                    ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('✅ تم تحميل معرض الأعمال');
}

// ========================================
// التهيئة عند تحميل الصفحة
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ AlphaBrand - services.js تم تحميله');
    loadServices();
    loadPortfolio();
});

console.log('🚀 AlphaBrand - الخدمات جاهزة');