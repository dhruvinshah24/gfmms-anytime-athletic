import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log('Testing SMTP connection with user:', process.env.SMTP_USER);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const res = await transporter.sendMail({
    from: process.env.SMTP_FROM || 'dynamitedhruvin@gmail.com',
    to: 'dynamitedhruvin@gmail.com',
    subject: '🔥 IRONPEAK System Connected Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; padding: 30px;">
        <h1 style="color: #E63946; letter-spacing: 2px;">🏔️ IRONPEAK</h1>
        <p style="font-size: 16px;">Gym & Performance Center Management System is now live!</p>
        <p style="color: #aaa;">Your Gmail SMTP is active and ready to deliver real member registration invoices, branded access QR codes, and owner check-in alerts.</p>
        <div style="background: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-top: 20px;">
          <strong style="color: #00F5A0;">Status:</strong> SMTP Connected &amp; Verified
        </div>
      </div>
    `,
  });

  console.log('SUCCESS! Email sent with Message ID:', res.messageId);
}

main().catch((err) => {
  console.error('SMTP Error:', err.message);
});
