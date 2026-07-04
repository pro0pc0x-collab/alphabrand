const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Client = require('../models/Client');

// ========================================
// تقرير PDF - الطلبات
// ========================================
exports.generateOrderReportPDF = async (req, res, next) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    // بناء الاستعلام
    const query = {};
    if (startDate) query.createdAt = { $gte: new Date(startDate) };
    if (endDate) query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };
    if (status) query.status = status;
    
    const orders = await Order.find(query)
      .populate('client', 'name email')
      .populate('service', 'title')
      .sort({ createdAt: -1 });
    
    // إنشاء PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=orders-report-${Date.now()}.pdf`);
    
    doc.pipe(res);
    
    // العنوان
    doc.fontSize(24)
       .text('📊 تقرير الطلبات', { align: 'center' })
       .moveDown();
    
    doc.fontSize(12)
       .text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`)
       .text(`عدد الطلبات: ${orders.length}`)
       .moveDown();
    
    // الجدول
    const tableTop = doc.y;
    const headers = ['#', 'العميل', 'الخدمة', 'المبلغ', 'الحالة', 'التاريخ'];
    const colWidths = [60, 100, 100, 80, 80, 80];
    
    // رأس الجدول
    let x = 50;
    doc.fontSize(10)
       .font('Helvetica-Bold');
    
    headers.forEach((header, i) => {
      doc.text(header, x, tableTop, { width: colWidths[i], align: 'center' });
      x += colWidths[i];
    });
    
    doc.moveDown();
    doc.y += 10;
    
    // صفوف الجدول
    doc.font('Helvetica');
    let y = doc.y;
    
    orders.forEach((order, index) => {
      const statusMap = {
        'pending': 'قيد الانتظار',
        'in_progress': 'قيد التنفيذ',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
      };
      
      const row = [
        index + 1,
        order.client?.name || 'غير معروف',
        order.title?.ar || 'خدمة',
        `${order.price} MAD`,
        statusMap[order.status] || order.status,
        new Date(order.createdAt).toLocaleDateString('ar-EG'),
      ];
      
      x = 50;
      row.forEach((cell, i) => {
        doc.text(String(cell), x, y, { width: colWidths[i], align: 'center' });
        x += colWidths[i];
      });
      
      y += 25;
      doc.y = y;
      
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
    });
    
    // الإجماليات
    const totalAmount = orders.reduce((sum, o) => sum + (o.price || 0), 0);
    doc.moveDown(2);
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text(`الإجمالي: ${totalAmount} MAD`, { align: 'center' });
    
    doc.end();
  } catch (err) {
    next(err);
  }
};

// ========================================
// تقرير Excel - الإيرادات
// ========================================
exports.generateRevenueReportExcel = async (req, res, next) => {
  try {
    const { year } = req.query;
    const targetYear = parseInt(year) || new Date().getFullYear();
    
    // جلب البيانات
    const orders = await Order.find({
      status: 'completed',
      createdAt: {
        $gte: new Date(`${targetYear}-01-01`),
        $lte: new Date(`${targetYear}-12-31`),
      }
    });
    
    // إحصاءات شهرية
    const monthlyStats = Array(12).fill(0);
    orders.forEach(order => {
      const month = new Date(order.createdAt).getMonth();
      monthlyStats[month] += order.price || 0;
    });
    
    // إنشاء Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('الإيرادات الشهرية');
    
    // عنوان التقرير
    worksheet.addRow(['تقرير الإيرادات السنوي']);
    worksheet.addRow([`العام: ${targetYear}`]);
    worksheet.addRow([]);
    
    // رأس الجدول
    const headers = ['الشهر', 'عدد الطلبات', 'الإيرادات (MAD)'];
    worksheet.addRow(headers);
    
    // البيانات
    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    let totalRevenue = 0;
    let totalOrders = 0;
    
    monthNames.forEach((month, i) => {
      const count = orders.filter(o => new Date(o.createdAt).getMonth() === i).length;
      const revenue = monthlyStats[i];
      totalRevenue += revenue;
      totalOrders += count;
      worksheet.addRow([month, count, revenue]);
    });
    
    worksheet.addRow([]);
    worksheet.addRow(['الإجمالي', totalOrders, totalRevenue]);
    
    // تنسيق
    worksheet.columns.forEach(col => {
      col.width = 20;
    });
    
    // إعداد الرد
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=revenue-report-${targetYear}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};

// ========================================
// إحصائيات متقدمة (للوحة التحكم)
// ========================================
exports.getAdvancedStats = async (req, res, next) => {
  try {
    const { period } = req.query;
    const days = parseInt(period) || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    // إحصائيات الطلبات
    const orders = await Order.find({
      createdAt: { $gte: startDate }
    });
    
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const inProgressOrders = orders.filter(o => o.status === 'in_progress').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    
    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.price || 0), 0);
    
    // إحصائيات العملاء
    const clients = await Client.find({
      createdAt: { $gte: startDate }
    });
    const totalClients = await Client.countDocuments();
    const newClients = clients.length;
    
    // تصنيف الخدمات
    const serviceStats = {};
    orders.forEach(order => {
      const serviceName = order.title?.ar || 'خدمة أخرى';
      serviceStats[serviceName] = (serviceStats[serviceName] || 0) + 1;
    });
    
    const topServices = Object.entries(serviceStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    
    res.status(200).json({
      success: true,
      stats: {
        orders: {
          total: totalOrders,
          completed: completedOrders,
          pending: pendingOrders,
          inProgress: inProgressOrders,
          cancelled: cancelledOrders,
        },
        revenue: totalRevenue,
        clients: {
          total: totalClients,
          new: newClients,
        },
        topServices,
        period: days,
      }
    });
  } catch (err) {
    next(err);
  }
};