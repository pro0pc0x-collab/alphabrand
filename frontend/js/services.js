// ========================================
// Services Logic
// ========================================
// بيانات الخدمات (مؤقتة)
const services = [
  {
    id: 1,
    icon: '📱',
    title: 'تطبيقات الهاتف',
    description: 'تطبيقات احترافية لنظامي Android و iOS',
    category: 'apps'
  },
  {
    id: 2,
    icon: '🌐',
    title: 'تطوير المواقع',
    description: 'مواقع متجاوبة وعصرية وسريعة',
    category: 'websites'
  },
  {
    id: 3,
    icon: '📈',
    title: 'التسويق الرقمي',
    description: 'استراتيجيات تسويقية فعالة لزيادة المبيعات',
    category: 'marketing'
  },
  {
    id: 4,
    icon: '🎨',
    title: 'التصميم الجرافيكي',
    description: 'تصاميم فريدة تعكس هوية علامتك التجارية',
    category: 'design'
  },
  {
    id: 5,
    icon: '🚁',
    title: 'تصوير بالدرون',
    description: 'تصوير جوي بدقة 4K بزوايا استثنائية',
    category: 'drone'
  },
  {
    id: 6,
    icon: '🏷️',
    title: 'الهوية البصرية',
    description: 'بناء هوية متكاملة لعلامتك التجارية',
    category: 'branding'
  }
];
// ========================================
// جلب الخدمات من الخادم
// ========================================
async function loadServices() {
  try {
    const response = await fetch('/api/services');
    const data = await response.json();
    
    if (data.success) {
      renderServices(data.services);
    }
  } catch (error) {
    console.error('❌ خطأ في تحميل الخدمات:', error);
  }
}

// ========================================
// عرض الخدمات في الصفحة
// ========================================
function renderServices(services) {
  const servicesGrid = document.getElementById('servicesGrid');
  if (!servicesGrid) return;
  
  servicesGrid.innerHTML = services
    .filter(s => s.isActive)
    .map(service => `
      <div class="card hover-lift service-card" data-category="${service.category}">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">${service.icon || '🚀'}</div>
        <h3 style="margin-bottom: 0.5rem;">${service.title.ar}</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">${service.description.ar}</p>
        <div style="margin-top: 0.75rem;">
          <span style="color: var(--primary-light); font-weight: 700;">${service.basePrice} ${service.currency}</span>
          ${service.maxPrice ? ` - <span style="color: var(--text-muted);">${service.maxPrice} ${service.currency}</span>` : ''}
        </div>
        <a href="request-service.html?service=${service._id}" class="btn btn-primary btn-sm" style="margin-top: 1rem; width: 100%; justify-content: center;">
          اطلب الخدمة
        </a>
      </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ services.js تم تحميله');
    loadServices();
    loadPortfolio();
});

// ========================================
// تحميل الخدمات
// ========================================
async function loadServices() {
    try {
        console.log('📡 جلب الخدمات...');
        const response = await fetch('/api/services');
        const data = await response.json();
        
        console.log('📦 بيانات الخدمات:', data);
        
        if (data.success) {
            const servicesGrid = document.getElementById('servicesGrid');
            if (!servicesGrid) {
                console.warn('⚠️ servicesGrid غير موجود');
                return;
            }
            
            const services = data.services.filter(s => s.isActive).slice(0, 6);
            
            if (services.length === 0) {
                servicesGrid.innerHTML = `
                    <div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:2rem;">
                        لا توجد خدمات متاحة حالياً
                    </div>
                `;
                return;
            }
            
            servicesGrid.innerHTML = services.map(service => `
                <div class="card service-card" data-category="${service.category}">
                    <div class="service-icon" style="font-size:2.5rem;margin-bottom:1rem;">${service.icon || '🚀'}</div>
                    <h3 style="margin-bottom:0.5rem;">${service.title?.ar || 'خدمة'}</h3>
                    <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;">${service.description?.ar || ''}</p>
                    <div style="margin-top:0.75rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
                        <span style="display:inline-block;background:var(--bg-secondary);padding:0.15rem 0.8rem;border-radius:50px;font-size:0.8rem;color:var(--primary-light);border:1px solid var(--border-primary);">
                            ${service.basePrice} ${service.currency}
                        </span>
                        <span style="color:var(--text-muted);font-size:0.8rem;">${service.duration || ''}</span>
                    </div>
                    <a href="request-service.html?service=${service._id}" class="btn btn-primary btn-sm" style="margin-top:1rem;width:100%;justify-content:center;">
                        اطلب الخدمة
                    </a>
                </div>
            `).join('');
            
            console.log('✅ تم عرض الخدمات بنجاح');
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل الخدمات:', error);
    }
}

// ========================================
// تحميل معرض الأعمال
// ========================================
function loadPortfolio() {
    const grid = document.getElementById('portfolioPreview');
    if (!grid) {
        console.warn('⚠️ portfolioPreview غير موجود');
        return;
    }
    
    const projects = [
        { icon: '📱', title: 'تطبيق توصيل', category: 'تطبيقات', tags: ['Flutter', 'Firebase'] },
        { icon: '🌐', title: 'موقع شركة عقارية', category: 'مواقع', tags: ['React', 'Node.js'] },
        { icon: '🚁', title: 'تصوير درون - سياحي', category: 'درون', tags: ['4K', 'مونتاج'] },
        { icon: '🎨', title: 'هوية بصرية', category: 'تصميم', tags: ['براندينغ', 'Adobe'] },
    ];
    
    grid.innerHTML = projects.map(project => `
        <div class="card" style="overflow:hidden;padding:0;">
            <div style="background:var(--gradient-primary);height:180px;display:flex;align-items:center;justify-content:center;font-size:4rem;">
                ${project.icon}
            </div>
            <div style="padding:1.5rem;">
                <h4 style="margin-bottom:0.25rem;">${project.title}</h4>
                <p style="color:var(--text-muted);font-size:0.85rem;">${project.category}</p>
                <div style="display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap;">
                    ${project.tags.map(tag => `<span style="background:var(--bg-secondary);padding:0.1rem 0.6rem;border-radius:50px;font-size:0.7rem;color:var(--text-muted);border:1px solid var(--border-secondary);">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('✅ تم عرض معرض الأعمال');
}

console.log('✅ services.js تم التحميل بالكامل');