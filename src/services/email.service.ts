import nodemailer, { SendMailOptions } from 'nodemailer';
import * as path from 'path';

// Graceful degradation: if SMTP not configured or in test mode, just log/skip
const isTest = process.env.NODE_ENV === 'test';
const smtpConfigured =
  !isTest &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS &&
  !process.env.SMTP_USER.includes('PLACEHOLDER');

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

async function sendMail(opts: SendMailOptions): Promise<void> {
  if (!transporter) {
    console.log(`[EmailService] SMTP skipped/not configured — would send to: ${opts.to} | Subject: ${opts.subject}`);
    return;
  }
  try {
    const info = await transporter.sendMail(opts);
    console.log(`[EmailService] Sent to ${opts.to} | MessageId: ${info.messageId}`);
  } catch (err: any) {
    console.error(`[EmailService] Failed to send to ${opts.to}:`, err.message);
  }
}

/* ─────────────────────────── TEMPLATES ─────────────────────────────── */

export class EmailService {
  /**
   * Welcome email sent after successful registration.
   * Includes QR code as inline image + attachment.
   */
  static async sendWelcomeEmail(data: {
    fullName: string;
    emailAddress: string;
    qrCodeIdentifier: string;
    qrCodeDataURL: string;
    planName: string;
    endDate: Date;
    membershipID: string;
  }) {
    const endDateStr = new Date(data.endDate).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    const qrBase64 = data.qrCodeDataURL.split(';base64,').pop() || '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Arial',sans-serif;background:#0d0d12;color:#ffffff}
  .wrap{max-width:600px;margin:0 auto;background:#13131a;border:1px solid #282836}
  .hdr{background:linear-gradient(135deg,#5B2C86 0%,#7928CA 100%);padding:40px 30px;text-align:center}
  .logo{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:8px}
  .brand{font-size:32px;font-weight:900;letter-spacing:4px;color:#fff}
  .tagline{color:rgba(255,255,255,.8);font-size:11px;letter-spacing:2px;text-transform:uppercase}
  .body{padding:40px 30px}
  .hi{font-size:22px;font-weight:700;margin-bottom:16px}
  .purple{color:#9D4EDD}
  .green{color:#00F5A0}
  p{color:#a0a0b2;line-height:1.7;margin-bottom:16px;font-size:14px}
  .card{background:#1c1c27;border:1px solid #2d2d3f;border-radius:12px;padding:24px;margin:24px 0}
  .card-title{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#9D4EDD;margin-bottom:16px;font-weight:700}
  .row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #282836}
  .row:last-child{border-bottom:none}
  .lbl{color:#7a7a92;font-size:12px}
  .val{color:#fff;font-size:13px;font-weight:600}
  .mono{font-family:monospace;font-size:11px;color:#aaa;word-break:break-all}
  .qr-wrap{text-align:center;padding:32px;background:#0a0a0f;border:1px solid #2d2d3f;border-radius:12px;margin:24px 0}
  .qr-wrap img{width:200px;height:200px;border:3px solid #7928CA;border-radius:8px}
  .qr-caption{margin-top:12px;color:#7a7a92;font-size:12px;letter-spacing:1px}
  .badge{display:inline-block;background:#00F5A0;color:#000;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px}
  .btn-wrap{text-align:center;margin:32px 0}
  .btn{display:inline-block;background:linear-gradient(135deg,#5B2C86,#7928CA);color:#fff;text-decoration:none;padding:16px 48px;border-radius:6px;font-weight:700;letter-spacing:2px;font-size:13px}
  .footer{background:#0a0a0f;padding:24px 30px;text-align:center;color:#555566;font-size:11px;line-height:1.8}
  .divider{height:1px;background:linear-gradient(90deg,transparent,#7928CA,transparent);margin:24px 0}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <div class="brand">ANYTIME FITNESS</div>
    <div class="tagline">24/7 Access • Real Results • Worldwide Network</div>
  </div>

  <div class="body">
    <div class="hi">Welcome to the family, <span class="purple">${data.fullName}</span>!</div>
    <p>Your Anytime Fitness membership is now <span class="badge">ACTIVE</span>. You have 24/7 access to thousands of clubs worldwide, state-of-the-art equipment, and expert coaching.</p>
    <p>Below is your official digital 24/7 entrance pass. Scan this QR code at the reception turnstile or kiosk camera anytime day or night.</p>

    <div class="card">
      <div class="card-title">Membership Details</div>
      <div class="row"><span class="lbl">Plan</span><span class="val">${data.planName}</span></div>
      <div class="row"><span class="lbl">Status</span><span class="val green">Active (24/7 Access)</span></div>
      <div class="row"><span class="lbl">Valid Until</span><span class="val">${endDateStr}</span></div>
      <div class="row"><span class="lbl">Member ID</span><span class="mono">${data.membershipID}</span></div>
    </div>

    <div class="divider"></div>

    <div class="qr-wrap">
      <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9D4EDD;margin-bottom:16px;font-weight:700">Your 24/7 Access Pass</div>
      <img src="cid:af-qr" alt="QR Access Key" />
      <div class="qr-caption">📱 Scan at the turnstile / reception kiosk to enter</div>
      <div class="mono" style="margin-top:10px;font-size:10px">${data.qrCodeIdentifier}</div>
    </div>

    <p style="font-size:13px;text-align:center;color:#7a7a92">Your digital pass is also attached to this email. Save it to your phone photos or digital wallet.</p>

    <div class="btn-wrap">
      <a href="http://localhost:3000" class="btn">OPEN MEMBER PORTAL</a>
    </div>
  </div>

  <div class="footer">
    <strong style="color:#9D4EDD;font-size:13px;letter-spacing:2px">ANYTIME FITNESS</strong><br>
    Let's Make Healthy Happen.<br><br>
    © ${new Date().getFullYear()} Anytime Fitness LLC. All rights reserved.<br>
    Automated notification from club management system.
  </div>
</div>
</body>
</html>`;

    await sendMail({
      from: process.env.SMTP_FROM || '"Anytime Fitness" <dynamitedhruvin@gmail.com>',
      to: data.emailAddress,
      subject: '💜 Welcome to Anytime Fitness — Your 24/7 Digital Pass is Active!',
      html,
      attachments: [
        {
          filename: 'anytime-fitness-access-pass.png',
          content: Buffer.from(qrBase64, 'base64'),
          cid: 'af-qr',
        },
      ],
    });
  }

  /**
   * Invoice / payment confirmation email.
   */
  static async sendInvoiceEmail(data: {
    emailAddress: string;
    fullName: string;
    invoiceNumber: string;
    amount: number | string;
    planName: string;
    paymentMethod: string;
    transactionRef: string;
    paymentDate: Date;
    periodStart?: Date;
    periodEnd?: Date;
  }) {
    const fmt = (d?: Date) =>
      d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
    const amount = Number(data.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Arial',sans-serif;background:#0d0d12;color:#fff}
  .wrap{max-width:600px;margin:0 auto;background:#13131a;border:1px solid #282836}
  .hdr{background:linear-gradient(135deg,#5B2C86,#7928CA);padding:30px;text-align:center}
  .brand{font-size:26px;font-weight:900;letter-spacing:4px;color:#fff}
  .sub{color:rgba(255,255,255,.8);font-size:10px;letter-spacing:3px;margin-top:4px}
  .body{padding:40px 30px}
  .title{font-size:18px;font-weight:700;color:#9D4EDD;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px}
  p{color:#a0a0b2;font-size:13px;line-height:1.7;margin-bottom:20px}
  .card{background:#1c1c27;border:1px solid #2d2d3f;border-radius:12px;padding:24px;margin:20px 0}
  .card-title{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#9D4EDD;margin-bottom:16px;font-weight:700}
  .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #282836;font-size:13px}
  .row:last-child{border-bottom:none}
  .lbl{color:#7a7a92}.val{color:#fff;font-weight:600}
  .total{background:linear-gradient(135deg,#5B2C86,#7928CA);border-radius:8px;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;margin:24px 0}
  .total-lbl{font-weight:700;letter-spacing:2px;font-size:12px}
  .total-amt{font-size:26px;font-weight:900}
  .footer{background:#0a0a0f;padding:24px;text-align:center;color:#555566;font-size:11px;line-height:1.8}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <div class="brand">ANYTIME FITNESS</div>
    <div class="sub">PAYMENT RECEIPT &amp; TAX INVOICE</div>
  </div>
  <div class="body">
    <div class="title">Receipt #${data.invoiceNumber}</div>
    <p>Dear ${data.fullName}, your payment has been received and verified. Thank you for training with Anytime Fitness.</p>
    <div class="card">
      <div class="card-title">Transaction Summary</div>
      <div class="row"><span class="lbl">Invoice Number</span><span class="val">${data.invoiceNumber}</span></div>
      <div class="row"><span class="lbl">Date</span><span class="val">${fmt(data.paymentDate)}</span></div>
      <div class="row"><span class="lbl">Plan Tier</span><span class="val">${data.planName}</span></div>
      <div class="row"><span class="lbl">Validity</span><span class="val">${fmt(data.periodStart)} – ${fmt(data.periodEnd)}</span></div>
      <div class="row"><span class="lbl">Payment Method</span><span class="val">${data.paymentMethod}</span></div>
      <div class="row"><span class="lbl">Transaction Reference</span><span class="val" style="font-family:monospace;font-size:11px">${data.transactionRef}</span></div>
    </div>
    <div class="total">
      <span class="total-lbl">TOTAL PAID</span>
      <span class="total-amt">₹${amount}</span>
    </div>
  </div>
  <div class="footer">
    <strong style="color:#9D4EDD;letter-spacing:2px">ANYTIME FITNESS</strong><br>
    24/7 Access Gym Network<br><br>
    © ${new Date().getFullYear()} Anytime Fitness LLC.
  </div>
</div>
</body>
</html>`;

    await sendMail({
      from: process.env.SMTP_FROM || '"Anytime Fitness" <dynamitedhruvin@gmail.com>',
      to: data.emailAddress,
      subject: `🧾 Anytime Fitness Invoice ${data.invoiceNumber} — Payment Confirmed`,
      html,
    });
  }

  /**
   * Owner check-in alert — fires every time a member checks in.
   */
  static async sendCheckinAlertToOwner(data: {
    memberName: string;
    memberID: string;
    checkInTime: Date;
    method: string;
    linkedClass?: string | null;
  }) {
    const timeStr = new Date(data.checkInTime).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Arial',sans-serif;background:#0d0d12;color:#fff}
  .wrap{max-width:500px;margin:0 auto;background:#13131a;border:1px solid #282836}
  .hdr{background:linear-gradient(135deg,#5B2C86,#7928CA);padding:20px 30px}
  .brand{font-size:20px;font-weight:900;letter-spacing:4px;color:#fff}
  .alert-label{color:rgba(255,255,255,.8);font-size:10px;letter-spacing:3px;margin-top:4px}
  .body{padding:30px}
  p{color:#a0a0b2;font-size:13px;margin-bottom:20px}
  .card{background:#1c1c27;border:1px solid #2d2d3f;border-radius:10px;padding:20px}
  .field{margin-bottom:14px}
  .field-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#7a7a92;margin-bottom:4px}
  .field-val{font-size:16px;font-weight:700}
  .badge{display:inline-block;background:#7928CA;color:#fff;padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px}
  .green{color:#00F5A0}
  .mono{font-family:monospace;font-size:11px;color:#888}
  .footer{background:#0a0a0f;padding:20px;text-align:center;color:#555566;font-size:11px}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <div class="brand">ANYTIME FITNESS</div>
    <div class="alert-label">CLUB ENTRANCE ALERT</div>
  </div>
  <div class="body">
    <p>A member just accessed the club facility.</p>
    <div class="card">
      <div class="field">
        <div class="field-lbl">Member</div>
        <div class="field-val green">${data.memberName}</div>
      </div>
      <div class="field">
        <div class="field-lbl">Member ID</div>
        <div class="mono">${data.memberID}</div>
      </div>
      <div class="field">
        <div class="field-lbl">Time of Entry</div>
        <div class="field-val">${timeStr}</div>
      </div>
      <div class="field">
        <div class="field-lbl">Scan Method</div>
        <span class="badge">${data.method}</span>
      </div>
      ${data.linkedClass ? `<div class="field"><div class="field-lbl">Linked Class</div><div class="field-val" style="color:#00F5A0">${data.linkedClass}</div></div>` : ''}
    </div>
  </div>
  <div class="footer">© ${new Date().getFullYear()} Anytime Fitness — Real-Time Club Kiosk Feed</div>
</div>
</body>
</html>`;

    await sendMail({
      from: process.env.SMTP_FROM || '"Anytime Fitness" <dynamitedhruvin@gmail.com>',
      to: process.env.OWNER_EMAIL || '',
      subject: `🔔 Anytime Fitness Check-In: ${data.memberName} entered club`,
      html,
    });
  }

  /**
   * Class booking confirmation or waitlist notification.
   */
  static async sendBookingEmail(data: {
    emailAddress: string;
    fullName: string;
    className: string;
    schedule: Date;
    bookingID: string;
    status: 'Booked' | 'Waitlisted';
  }) {
    const isWaitlisted = data.status === 'Waitlisted';
    const scheduleStr = new Date(data.schedule).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short',
    });

    await sendMail({
      from: process.env.SMTP_FROM || '"Anytime Fitness" <dynamitedhruvin@gmail.com>',
      to: data.emailAddress,
      subject: isWaitlisted
        ? `⏳ Waitlist: ${data.className} — Anytime Fitness`
        : `✅ Booking Confirmed: ${data.className} — Anytime Fitness`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8">
<style>
  body{font-family:'Arial',sans-serif;background:#0d0d12;color:#fff;margin:0}
  .wrap{max-width:600px;margin:0 auto;background:#13131a;border:1px solid #282836}
  .hdr{background:linear-gradient(135deg,#5B2C86,#7928CA);padding:30px;text-align:center}
  .brand{font-size:26px;font-weight:900;letter-spacing:4px;color:#fff}
  .body{padding:40px 30px}
  .status{font-size:22px;font-weight:700;margin-bottom:16px;color:${isWaitlisted ? '#FFB800' : '#00F5A0'}}
  p{color:#a0a0b2;font-size:13px;line-height:1.7;margin-bottom:16px}
  .card{background:#1c1c27;border:1px solid #2d2d3f;border-radius:12px;padding:24px;margin:20px 0}
  .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #282836;font-size:13px}
  .row:last-child{border-bottom:none}
  .lbl{color:#7a7a92}.val{color:#fff;font-weight:600}
  .footer{background:#0a0a0f;padding:20px;text-align:center;color:#555566;font-size:11px}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr"><div class="brand">ANYTIME FITNESS</div></div>
  <div class="body">
    <div class="status">${isWaitlisted ? '⏳ Placed on Waitlist' : '✅ Class Seat Reserved'}</div>
    <p>Dear ${data.fullName},</p>
    <p>${isWaitlisted
      ? 'This session is currently at full capacity. You are on the priority waitlist — we will notify you immediately if a spot opens up.'
      : 'Your workout session is confirmed! Bring your digital pass and arrive 5 minutes early.'}</p>
    <div class="card">
      <div class="row"><span class="lbl">Class</span><span class="val">${data.className}</span></div>
      <div class="row"><span class="lbl">Schedule</span><span class="val">${scheduleStr}</span></div>
      <div class="row"><span class="lbl">Status</span><span class="val" style="color:${isWaitlisted ? '#FFB800' : '#00F5A0'}">${data.status}</span></div>
      <div class="row"><span class="lbl">Booking ID</span><span class="val" style="font-family:monospace;font-size:11px">${data.bookingID}</span></div>
    </div>
  </div>
  <div class="footer">© ${new Date().getFullYear()} Anytime Fitness — 24/7 Health Clubs</div>
</div>
</body>
</html>`,
    });
  }
}
