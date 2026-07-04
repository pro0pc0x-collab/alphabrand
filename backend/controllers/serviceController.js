const Service = require('../models/Service');

exports.getServices = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;

    const services = await Service.find(query).sort('order');
    res.status(200).json({ success: true, count: services.length, services });
  } catch (err) { next(err); }
};

exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' });
    res.status(200).json({ success: true, service });
  } catch (err) { next(err); }
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