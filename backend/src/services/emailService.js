const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOrderConfirmation(toEmail, order) {
  const itemsList = order.items
    .map((i) => `- ${i.product.name} x${i.quantity} ($${i.price.toFixed(2)} each)`)
    .join('\n');

  const info = await transporter.sendMail({
    from: '"E-Commerce Shop" <shop@example.com>',
    to: toEmail,
    subject: `Order #${order.id} confirmed`,
    text: `Thanks for your order!\n\n${itemsList}\n\nTotal: $${order.total.toFixed(2)}`,
  });

  // Ethereal gives you a preview link instead of actually delivering mail
  console.log('order email preview:', nodemailer.getTestMessageUrl(info));
  return info;
}

module.exports = { sendOrderConfirmation };
