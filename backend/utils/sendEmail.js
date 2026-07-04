const { createTransporter } = require('../config/mail');
const logger = require('./logger');

const emailTemplates = {
  orderConfirmation: (order, client) => ({
    subject: `تأكيد طلبك رقم ${order.orderNumber} - Digital Agency`,
    html: `
      <div dir="rtl" style="font-family: Arial; padding: 20px; background: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px;">
          <h2 style="color: #006D5B;">مرحباً ${client.name} 👋</h2>
          <p>تم استلام طلبك بنجاح!</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>رقم الطلب:</strong> ${order.orderNumber}</p>
            <p><strong>الخدمة:</strong> ${order.serviceType}</p>
            <p><strong>الحالة:</strong> قيد المراجعة</p>
          </div>
          <p>سنتواصل معك خلال 24 ساعة.</p>
          <p style="color: #006D5B;"><strong>فريق Digital Agency</strong></p>
        </div>
      </div>
    `,
  }),

  contactReply: (contact) => ({
    subject: `شكراً لتواصلك معنا - Digital Agency`,
    html: `
      <div dir="rtl" style="font-family: Arial; padding: 20px;">
        <h2 style="color: #006D5B;">مرحباً ${contact.name}</h2>
        <p>شكراً لتواصلك معنا. سنرد عليك قريباً.</p>
        <p><strong>فريق Digital Agency</strong></p>
      </div>
    `,
  }),

  newOrderAdmin: (order, client) => ({
    subject: `🔔 طلب جديد - ${order.orderNumber}`,
    html: `
      <div dir="rtl" style="font-family: Arial; padding: 20px;">
        <h2>طلب جديد من ${client.name}</h2>
        <p><strong>الخدمة:</strong> ${order.serviceType}</p>
        <p><strong>الوصف:</strong> ${order.description}</p>
        <p><strong>الميزانية:</strong> ${order.budget} ${order.currency}</p>
        <p><strong>واتساب:</strong> ${client.phone}</p>
      </div>
    `,
  }),
};

const sendEmail = async ({ to, templateName, templateData, subject, html }) => {
  try {
    const transporter = createTransporter();
    let mailOptions = { from: process.env.EMAIL_FROM, to };

    if (templateName && emailTemplates[templateName]) {
      const template = emailTemplates[templateName](...templateData);
      mailOptions.subject = template.subject;
      mailOptions.html = template.html;
    } else {
      mailOptions.subject = subject;
      mailOptions.html = html;
    }

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email error: ${error.message}`);
    // Don't throw - email failure shouldn't break the app
  }
};

module.exports = sendEmail;