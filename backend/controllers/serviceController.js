const Service = require('../models/Service');

const fallbackServices = [
  {
    _id: 'apps',
    icon: '📱',
    title: { ar: 'تطبيقات الهاتف' },
    description: { ar: 'تطبيقات Android و iOS سريعة، آمنة، ومصممة لتجربة استخدام احترافية.' },
    category: 'apps',
    basePrice: 3500,
    maxPrice: 25000,
    currency: 'MAD',
    duration: '2 - 8 أسابيع',
    isActive: true,
    isFeatured: true,
  },
  {
    _id: 'websites',
    icon: '🌐',
    title: { ar: 'تطوير المواقع' },
    description: { ar: 'مواقع تعريفية، متاجر إلكترونية، وصفحات هبوط متجاوبة ومهيأة لمحركات البحث.' },
    category: 'websites',
    basePrice: 1800,
    maxPrice: 15000,
    currency: 'MAD',
    duration: '1 - 5 أسابيع',
    isActive: true,
    isFeatured: true,
  },
  {
    _id: 'marketing',
    icon: '📈',
    title: { ar: 'التسويق الرقمي' },
    description: { ar: 'إدارة الحملات، المحتوى، وتحسين الحضور الرقمي لرفع المبيعات وجلب العملاء.' },
    category: 'marketing',
    basePrice: 1200,
    maxPrice: 8000,
    currency: 'MAD',
    duration: 'شهرياً',
    isActive: true,
    isFeatured: true,
  },
  {
    _id: 'design',
    icon: '🎨',
    title: { ar: 'التصميم الجرافيكي' },
    description: { ar: 'تصاميم سوشيال ميديا، مطبوعات، وعناصر بصرية متناسقة مع هوية مشروعك.' },
    category: 'design',
    basePrice: 500,
    maxPrice: 6000,
    currency: 'MAD',
    duration: '3 - 10 أيام',
    isActive: true,
    isFeatured: true,
  },
  {
    _id: 'drone',
    icon: '🚁',
    title: { ar: 'تصوير بالدرون' },
    description: { ar: 'تصوير جوي احترافي بدقة عالية للفنادق، العقارات، المناسبات، والمشاريع السياحية.' },
    category: 'drone',
    basePrice: 1500,
    maxPrice: 10000,
    currency: 'MAD',
    duration: 'يوم - 5 أيام',
    isActive: true,
    isFeatured: false,
  },
  {
    _id: 'branding',
    icon: '🏷️',
    title: { ar: 'الهوية البصرية' },
    description: { ar: 'شعار، ألوان، خطوط، ودليل استعمال يعطي علامتك حضوراً واضحاً وموحداً.' },
    category: 'branding',
    basePrice: 2500,
    maxPrice: 12000,
    currency: 'MAD',
    duration: '1 - 3 أسابيع',
    isActive: true,
    isFeatured: true,
  },
];

const getFallbackServices = ({ category, featured } = {}) => {
  return fallbackServices.filter(service => {
    if (category && service.category !== category) return false;
    if (featured === 'true' && !service.isFeatured) return false;
    return true;
  });
};

exports.getServices = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;

    const services = await Service.find(query).sort('order');
    const result = services.length ? services : getFallbackServices(req.query);
    res.status(200).json({ success: true, count: result.length, services: result });
  } catch (err) {
    const services = getFallbackServices(req.query);
    res.status(200).json({ success: true, count: services.length, services, fallback: true });
  }
};

exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' });
    res.status(200).json({ success: true, service });
  } catch (err) {
    const service = fallbackServices.find(item => item._id === req.params.id || item.category === req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' });
    res.status(200).json({ success: true, service, fallback: true });
  }
};

exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (err) { next(err); }
};

exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' });
    res.status(200).json({ success: true, service });
  } catch (err) { next(err); }
};

exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' });
    res.status(200).json({ success: true, message: 'تم حذف الخدمة' });
  } catch (err) { next(err); }
};
