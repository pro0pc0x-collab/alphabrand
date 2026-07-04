const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// ========================================
// إعداد الناقل (Transporter)
// ========================================
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// ========================================
// تحميل قالب بريد إلكتروني
// ========================================
const loadTemplate = (templateName, data) => {
  const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
  
  if (!fs.existsSync(templatePath)) {
    // إذا لم يكن القالب موجوداً، استخدم قالباً بسيطاً
    return `<html><body><h1>${data.subject || 'رسالة من Digital Agency'}</h1><p>${data.message || ''}</p></body></html>`;
  }
  
  const source = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(source);
  return template(data);
};

// ========================================
// إرسال بريد إلكتروني
// ========================================
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'Digital Agency'} <${process.env.FROM_EMAIL || 'no-reply@digitalagency.ma'}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || options.message,
      html: options.html || loadTemplate(options.template || 'default', options),
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ بريد إلكتروني مرسل إلى: ${options.to}`);
    return info;
  } catch (error) {
    console.error('❌ فشل إرسال البريد:', error.message);
    throw error;
  }
};

// ========================================
// قوالب مخصصة
// ========================================
const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'مرحباً بك في Digital Agency! 🚀',
    template: 'welcome',
    name: user.name,
    email: user.email,
    link: `${process.env.FRONTEND_URL}/login`,
    message: `مرحباً ${user.name}،
    
شكراً لتسجيلك في Digital Agency. نحن سعداء بانضمامك إلينا.

يمكنك الآن تصفح خدماتنا والاستفادة من عروضنا المميزة.
`,
  });
};

const sendOrderConfirmation = async (order, client) => {
  return sendEmail({
    to: client.email,
    subject: `تأكيد الطلب #${order.orderNumber}`,
    template: 'order',
    orderNumber: order.orderNumber,
    clientName: client.name,
    service: order.title.ar,
    price: order.price,
    dueDate: new Date(order.dueDate).toLocaleDateString('ar-EG'),
    link: `${process.env.FRONTEND_URL}/dashboard/client/orders`,
  });
};

const sendInvoiceEmail = async (invoice, client) => {
  return sendEmail({
    to: client.email,
    subject: `الفاتورة #${invoice.invoiceNumber}`,
    template: 'invoice',
    invoiceNumber: invoice.invoiceNumber,
    clientName: client.name,
    amount: invoice.total,
    dueDate: new Date(invoice.dueDate).toLocaleDateString('ar-EG'),
    link: `${process.env.FRONTEND_URL}/dashboard/client/invoices`,
  });
};

const sendPaymentConfirmation = async (invoice, client) => {
  return sendEmail({
    to: client.email,
    subject: `تأكيد الدفع - الفاتورة #${invoice.invoiceNumber}`,
    template: 'payment-confirmation',
    invoiceNumber: invoice.invoiceNumber,
    clientName: client.name,
    amount: invoice.total,
    paidDate: new Date(invoice.paidDate).toLocaleDateString('ar-EG'),
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendInvoiceEmail,
  sendPaymentConfirmation,
};