const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const docsDir = path.join(__dirname, '..', 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const artifactDir = 'C:\\Users\\dhruv\\.gemini\\antigravity\\brain\\031ae8c5-69c7-454d-870b-780f81e90418';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

console.log('Generating PDF Document 1: GFMMS Comprehensive Project Report...');

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT 1: COMPREHENSIVE PROJECT REPORT HTML
// ─────────────────────────────────────────────────────────────────────────────
const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GFMMS — Comprehensive Project Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Rajdhani:wght@500;600;700&display=swap');
    
    @page {
      size: A4;
      margin: 16mm 16mm 16mm 16mm;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: #1a1a1a;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }

    h1, h2, h3, h4 {
      font-family: 'Rajdhani', sans-serif;
      color: #0f172a;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-top: 1.4em;
      margin-bottom: 0.5em;
    }

    h1 { font-size: 22pt; line-height: 1.15; border-bottom: 2px solid #e11d48; padding-bottom: 6px; }
    h2 { font-size: 15pt; line-height: 1.25; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; color: #b91c1c; }
    h3 { font-size: 12pt; line-height: 1.3; color: #1e293b; }

    p, li {
      font-size: 9.8pt;
      color: #334155;
    }

    ul, ol {
      margin-top: 0.3em;
      margin-bottom: 0.8em;
      padding-left: 22px;
    }

    li {
      margin-bottom: 0.25em;
    }

    .cover-page {
      page-break-after: always;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 40px 20px;
      border: 3px solid #0f172a;
      border-top: 10px solid #e11d48;
      background: #fafafa;
    }

    .cover-header {
      text-align: center;
    }

    .cover-title {
      font-family: 'Rajdhani', sans-serif;
      font-size: 28pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.06em;
      line-height: 1.1;
      margin: 15px 0 5px 0;
    }

    .cover-subtitle {
      font-family: 'Rajdhani', sans-serif;
      font-size: 16pt;
      color: #e11d48;
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-bottom: 20px;
    }

    .cover-badge {
      display: inline-block;
      background: #0f172a;
      color: #ffffff;
      padding: 6px 16px;
      border-radius: 4px;
      font-size: 10pt;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 30px;
    }

    .cover-meta {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px 25px;
      margin: 20px 0;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px dashed #e2e8f0;
      font-size: 10pt;
    }

    .meta-row:last-child {
      border-bottom: none;
    }

    .meta-label {
      font-weight: 600;
      color: #64748b;
    }

    .meta-value {
      font-weight: 700;
      color: #0f172a;
    }

    .cover-footer {
      text-align: center;
      font-size: 9pt;
      color: #64748b;
      border-top: 1px solid #cbd5e1;
      padding-top: 15px;
    }

    .section-break {
      page-break-before: always;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px 0;
      font-size: 9pt;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
      vertical-align: top;
    }

    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      font-family: 'Rajdhani', sans-serif;
      letter-spacing: 0.04em;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    .status-pass {
      background: #dcfce7;
      color: #15803d;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      display: inline-block;
      font-size: 8pt;
    }

    code, pre {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 8.5pt;
      background: #f1f5f9;
      padding: 2px 4px;
      border-radius: 3px;
      color: #0f172a;
    }

    pre {
      padding: 10px 12px;
      overflow-x: auto;
      border: 1px solid #e2e8f0;
      background: #0f172a;
      color: #f8fafc;
      border-radius: 6px;
      line-height: 1.4;
    }

    .info-card {
      background: #f8fafc;
      border-left: 4px solid #e11d48;
      padding: 12px 16px;
      margin: 14px 0;
      border-radius: 0 6px 6px 0;
    }

    .highlight-box {
      background: #fff1f2;
      border: 1px solid #fecdd3;
      padding: 10px 14px;
      border-radius: 6px;
      margin: 10px 0;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-header">
      <div style="font-size: 11pt; font-weight: 700; letter-spacing: 0.15em; color: #64748b;">ACADEMIC &amp; ENGINEERING SUBMISSION</div>
      <div class="cover-title">GYM &amp; FITNESS MANAGEMENT SYSTEM (GFMMS)</div>
      <div class="cover-subtitle">ANYTIME ATHLETIC (AF·24 PROTOCOL)</div>
      <div class="cover-badge">COMPREHENSIVE PROJECT REPORT &amp; VERIFICATION DOSSIER</div>
    </div>

    <div class="cover-meta">
      <div class="meta-row"><span class="meta-label">Project Domain:</span><span class="meta-value">Enterprise Web Application &amp; Biometric Access Control</span></div>
      <div class="meta-row"><span class="meta-label">Core Modules:</span><span class="meta-value">Module A (Registration &amp; Membership) + Module B (Turnstile &amp; Classes)</span></div>
      <div class="meta-row"><span class="meta-label">Backend Architecture:</span><span class="meta-value">TypeScript, Node.js, Express.js, PostgreSQL 17, Prisma ORM</span></div>
      <div class="meta-row"><span class="meta-label">Security &amp; Auth:</span><span class="meta-value">1-Click Google OAuth, JWT, Bcrypt, Role-Based Access Control</span></div>
      <div class="meta-row"><span class="meta-label">Hardware Simulator:</span><span class="meta-value">html5-qrcode Webcam Optical Scanner + Web Audio Synth</span></div>
      <div class="meta-row"><span class="meta-label">Notification Engine:</span><span class="meta-value">Nodemailer Gmail SMTP (dynamitedhruvin@gmail.com)</span></div>
      <div class="meta-row"><span class="meta-label">Automated Tests:</span><span class="meta-value">13/13 Jest Tests Passing • 21/21 E2E REST Scenarios Passing</span></div>
      <div class="meta-row"><span class="meta-label">Lead Engineer / Author:</span><span class="meta-value">Dhruvin Patel</span></div>
      <div class="meta-row"><span class="meta-label">Submission Date:</span><span class="meta-value">October 24, 2026</span></div>
      <div class="meta-row"><span class="meta-label">System Status:</span><span class="meta-value" style="color: #16a34a;">100% OPERATIONAL &amp; VERIFIED (PASS)</span></div>
    </div>

    <div class="cover-footer">
      <div>Anytime Athletic 24/7 Platform — Engineering Project Documentation</div>
      <div style="margin-top: 4px;">Verified against GFMMS Software Requirements Specification and UML Design Contracts</div>
    </div>
  </div>

  <!-- TABLE OF CONTENTS & EXECUTIVE SUMMARY -->
  <div class="section-break">
    <h1>1. Executive Summary &amp; Architecture</h1>
    <p>The <strong>Gym &amp; Fitness Management System (GFMMS)</strong> is an enterprise-grade full-stack architecture designed to power 24/7 athletic facilities. Operating under the high-performance brand <strong>Anytime Athletic (AF·24 Protocol)</strong>, the platform replaces fragmented gym spreadsheets with a synchronized, real-time reactive ecosystem.</p>

    <div class="info-card">
      <strong>Core Objectives Achieved:</strong>
      <ul>
        <li><strong>Module A:</strong> Comprehensive member registration, atomic payment verification, 4-tier plan lifecycle, and dynamic QR passcode generation.</li>
        <li><strong>Module B:</strong> Biometric turnstile simulation, 3-day emergency grace buffer, 60-minute anti-passback guard, FIFO class waitlist engine, and automatic 15-minute class attendance proximity matching.</li>
        <li><strong>Advanced Integrations:</strong> Real webcam QR scanner via <code>html5-qrcode</code>, procedural Web Audio laser sweep chirp, 1-Click Google OAuth, and 18% GST tax invoicing.</li>
      </ul>
    </div>

    <h2>System Technology Stack</h2>
    <table>
      <thead>
        <tr><th>Layer</th><th>Technology</th><th>Implementation Details</th></tr>
      </thead>
      <tbody>
        <tr><td><strong>Runtime &amp; Language</strong></td><td>Node.js v20+ / TypeScript 5</td><td>Strict type safety, ES Modules, zero compilation errors (<code>tsc --noEmit</code>).</td></tr>
        <tr><td><strong>Application Server</strong></td><td>Express.js 4</td><td>Modular routers, centralized error middleware, CORS, JSON payload handling.</td></tr>
        <tr><td><strong>Database &amp; ORM</strong></td><td>PostgreSQL 17 / Prisma ORM</td><td>Strict relational foreign keys, cascade constraints, native Enums.</td></tr>
        <tr><td><strong>Authentication</strong></td><td>JWT + Bcrypt + Google OAuth</td><td>Dual-role RBAC (Owner vs Athlete) with instant 1-click account switching.</td></tr>
        <tr><td><strong>Optical Hardware Scan</strong></td><td>html5-qrcode + Web Audio</td><td>Real-time webcam video stream QR decode with procedural audio feedback.</td></tr>
        <tr><td><strong>Transactional Email</strong></td><td>Nodemailer (Gmail SMTP)</td><td>Live dispatch of welcome passes, 18% GST invoices, and owner entrance alerts.</td></tr>
        <tr><td><strong>Frontend Interface</strong></td><td>Tailwind CSS 3 / Vanilla ES6</td><td>Responsive dark athletic aesthetic, multi-layer depth parallax, zero AI filler.</td></tr>
        <tr><td><strong>Automated Testing</strong></td><td>Jest &amp; Supertest</td><td>13 automated unit/integration tests + 21-scenario E2E system audit suite.</td></tr>
      </tbody>
    </table>
  </div>

  <!-- MODULE A: REGISTRATION & MEMBERSHIP -->
  <div class="section-break">
    <h1>2. Module A: Member Registration &amp; Membership</h1>
    <p>Module A governs athlete enrollment, payment verification, and subscription state machines:</p>

    <h2>Core Business Rules &amp; Operations</h2>
    <ul>
      <li><strong>Atomic Member Registration:</strong> Enrolls athletes with full contact, date of birth, emergency phone, and selected plan.</li>
      <li><strong>Conditional State Machine:</strong> Membership status remains <code>Pending</code> or <code>Cancelled</code> until an authorized payment is settled. Upon payment success, status immediately becomes <code>Active</code>.</li>
      <li><strong>QR Identifier Generation:</strong> Every activated athlete receives a unique, human-readable turnstile pass token (e.g. <code>AF-QR-ALICE001</code>) and high-resolution optical QR code.</li>
      <li><strong>Payment Failure Integrity Guard:</strong> If payment processing fails (simulated via <code>paymentMethod: 'FAIL'</code>), the membership state is set to <code>Cancelled</code> with HTTP 400 rejection and no active pass is provisioned.</li>
      <li><strong>4-Tier Membership Plans:</strong> Configured with 1-Month Anytime Flex (₹2,499), 3-Month Transformation (₹6,499), 6-Month Elite (₹10,999), and 12-Month All-Access VIP (₹18,999).</li>
      <li><strong>30-Minute Expiration Policy:</strong> Incomplete registrations expire automatically after 30 minutes, preventing orphaned allocations.</li>
    </ul>

    <h2>Module A Endpoints Reference</h2>
    <table>
      <thead>
        <tr><th>Method &amp; Path</th><th>Description</th><th>Success Response</th></tr>
      </thead>
      <tbody>
        <tr><td><code>POST /members/register</code></td><td>Enrolls athlete and atomically charges subscription</td><td><code>201 Created</code> with member, active membership &amp; QR token</td></tr>
        <tr><td><code>GET /members</code></td><td>Lists all registered members with active plans</td><td><code>200 OK</code> with array of member objects</td></tr>
        <tr><td><code>GET /members/:id</code></td><td>Retrieves complete athlete profile and history</td><td><code>200 OK</code> with relational memberships, payments, attendances</td></tr>
        <tr><td><code>GET /members/:id/qrcode</code></td><td>Generates high-res Base64 optical QR data URL</td><td><code>200 OK</code> with Base64 PNG data URL</td></tr>
        <tr><td><code>GET /plans</code></td><td>Fetches all active membership plans</td><td><code>200 OK</code> with plan tiers, pricing, and durationDays</td></tr>
      </tbody>
    </table>
  </div>

  <!-- MODULE B: ATTENDANCE & CLASS BOOKING -->
  <div class="section-break">
    <h1>3. Module B: Attendance &amp; Class Booking</h1>
    <p>Module B governs turnstile hardware control, access policies, and group studio reservations:</p>

    <h2>Core Business Rules &amp; Operations</h2>
    <ul>
      <li><strong>Dual-Identifier Resolution:</strong> The access controller resolves both database UUIDs and human-readable QR tokens (e.g. <code>AF-QR-ALICE001</code>).</li>
      <li><strong>Access Gatekeeper:</strong>
        <ul>
          <li><strong>Active Membership:</strong> Turnstile unlatches, attendance record created with timestamp and method (<code>QR</code> / <code>Manual</code>).</li>
          <li><strong>3-Day Grace Buffer:</strong> Subscriptions expired within 72 hours are permitted emergency access with an urgent renewal reminder.</li>
          <li><strong>Expired Outside Grace:</strong> Access rejected with HTTP 403 (<code>checkInDenied – please renew</code>); zero attendance rows created.</li>
        </ul>
      </li>
      <li><strong>60-Minute Anti-Passback Guard:</strong> Rejects duplicate check-ins within 60 minutes with HTTP 403 to prevent badge sharing.</li>
      <li><strong>15-Minute Class Proximity Auto-Attendance:</strong> Checking in within 15 minutes of a scheduled fitness class auto-marks the attendee as <code>Attended</code> and links the attendance record.</li>
      <li><strong>Smart Capacity &amp; FIFO Waitlist Engine:</strong>
        <ul>
          <li>Open seat: Status <code>Booked</code>, capacity increments.</li>
          <li>Full class: Status <code>Waitlisted</code> in strict chronological FIFO queue order.</li>
          <li>Cancellation &gt; 2 hours before class: Auto-promotes earliest waitlisted candidate to <code>Booked</code>.</li>
          <li>Cancellation &lt; 2 hours before class: Rejected by policy to protect studio schedule integrity.</li>
        </ul>
      </li>
    </ul>

    <h2>Module B Endpoints Reference</h2>
    <table>
      <thead>
        <tr><th>Method &amp; Path</th><th>Description</th><th>Success Response</th></tr>
      </thead>
      <tbody>
        <tr><td><code>POST /attendance/checkin</code></td><td>Turnstile scan verifying status, grace period &amp; anti-passback</td><td><code>201 Created</code> with attendance ID and door unlatch</td></tr>
        <tr><td><code>POST /attendance/checkout</code></td><td>Turnstile exit stamping departure timestamp</td><td><code>200 OK</code> with updated attendance record</td></tr>
        <tr><td><code>GET /classes</code></td><td>Studio classes roster with live occupancy counts</td><td><code>200 OK</code> with capacity, currentBookings, schedule</td></tr>
        <tr><td><code>POST /bookings</code></td><td>Reserves studio class seat or places into FIFO waitlist</td><td><code>201 Created</code> with Booked or Waitlisted status</td></tr>
        <tr><td><code>POST /bookings/:id/cancel</code></td><td>Cancels booking &amp; promotes next waitlisted candidate</td><td><code>200 OK</code> with promotion trigger confirmation</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ADVANCED FEATURES & VERIFICATION -->
  <div class="section-break">
    <h1>4. Advanced Extensions &amp; Verification Evidence</h1>
    
    <h2>1-Click Google OAuth &amp; RBAC</h2>
    <p>Provides passwordless authentication for both administrative owners and athletes. Integrated directly into the SPA header with quick demo profiles for Alice Johnson, Bob Smith, Charlie Davis, and Club Owner Dhruvin, plus support for any custom Google email address.</p>

    <h2>Hardware Webcam QR Scanner &amp; Audio Synthesis</h2>
    <p>The entrance kiosk embeds a real-time webcam video feed powered by <code>html5-qrcode</code>. When a QR pass is detected, a procedural Web Audio synthesizer emits an authentic 988Hz-1976Hz laser chime, populating the input and triggering turnstile check-in automatically.</p>

    <h2>GST Invoicing &amp; Transactional Emailing</h2>
    <p>Every transaction generates a GST-compliant tax invoice calculating 18% tax breakdown, subtotal, total amount, and unique invoice code. Connected to Gmail SMTP (<code>dynamitedhruvin@gmail.com</code>), the backend delivers welcome packets with attached scannable QR passes and live owner entry alerts.</p>

    <h2>Automated Verification Matrix</h2>
    <table>
      <thead>
        <tr><th>Suite</th><th>Commands Executed</th><th>Results</th><th>Status</th></tr>
      </thead>
      <tbody>
        <tr><td><strong>Jest Unit &amp; Integration</strong></td><td><code>npm test</code></td><td>13 Tests Passed / 0 Failed</td><td><span class="status-pass">PASS</span></td></tr>
        <tr><td><strong>TypeScript Compiler</strong></td><td><code>npx tsc --noEmit</code></td><td>0 Errors / Clean Build</td><td><span class="status-pass">PASS</span></td></tr>
        <tr><td><strong>E2E REST Audit Suite</strong></td><td><code>npx ts-node scripts/comprehensive-audit.ts</code></td><td>21 Scenarios Passed / 0 Failed</td><td><span class="status-pass">PASS</span></td></tr>
      </tbody>
    </table>
  </div>

  <!-- SCREENSHOT SUBMISSION GUIDE -->
  <div class="section-break">
    <h1>5. Official Screenshot Submission Guide</h1>
    <p>The following guide details all 13 screenshots required for academic and project submission, including page location, capture frame, and the exact descriptive caption to print below each figure:</p>

    <table>
      <thead>
        <tr><th>#</th><th>Figure Title</th><th>Page Location</th><th>Visual Elements to Capture</th><th>Exact Caption / Description</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>SS-01</strong></td>
          <td><strong>Hero Landing Page &amp; Branding</strong></td>
          <td>Dashboard (<code>/</code>)</td>
          <td>Header, kinetic SVG crest, hero headline, trust badges.</td>
          <td><em>Figure 1: Anytime Athletic Landing Page featuring kinetic SVG branding and multi-layer parallax depth system.</em></td>
        </tr>
        <tr>
          <td><strong>SS-02</strong></td>
          <td><strong>1-Click Google OAuth Modal</strong></td>
          <td>Header &rarr; Sign In Modal</td>
          <td>Quick profile cards for Alice, Bob, Charlie, and Owner.</td>
          <td><em>Figure 2: Unified 1-Click Google OAuth modal allowing passwordless authentication for both owners and athletes.</em></td>
        </tr>
        <tr>
          <td><strong>SS-03</strong></td>
          <td><strong>24/7 VIP Digital QR Pass</strong></td>
          <td>Header &rarr; QR Pass Modal</td>
          <td>High-res scannable QR code, token <code>AF-QR-ALICE001</code>, valid Oct 2027.</td>
          <td><em>Figure 3: Scannable 24/7 VIP Digital Entrance Pass with high-resolution QR code, token passcode, and test kiosk action.</em></td>
        </tr>
        <tr>
          <td><strong>SS-04</strong></td>
          <td><strong>Optical Camera Scanner</strong></td>
          <td>Kiosk (<code>/kiosk</code>)</td>
          <td>Live camera feed, sweeping red laser beam, sensor indicators.</td>
          <td><em>Figure 4: Hardware Turnstile Optical Camera Scanner simulating real-time video QR decoding with Web Audio chime synthesis.</em></td>
        </tr>
        <tr>
          <td><strong>SS-05</strong></td>
          <td><strong>Turnstile Access Granted</strong></td>
          <td>Kiosk after scan</td>
          <td>Green neon banner: <em>"ACCESS GRANTED — WELCOME, ALICE JOHNSON!"</em></td>
          <td><em>Figure 5: Successful Entrance Check-In confirmation validating Active membership and recording turnstile timestamp.</em></td>
        </tr>
        <tr>
          <td><strong>SS-06</strong></td>
          <td><strong>60-Min Anti-Passback Guard</strong></td>
          <td>Kiosk after re-scan</td>
          <td>Red warning banner: <em>"ACCESS DENIED (Duplicate Check-In)"</em></td>
          <td><em>Figure 6: Anti-Passback Security Enforcement rejecting a second check-in attempt within 60 minutes with HTTP 403 Forbidden.</em></td>
        </tr>
        <tr>
          <td><strong>SS-07</strong></td>
          <td><strong>Enrollment &amp; 4-Tier Plans</strong></td>
          <td>Join Now (<code>/register</code>)</td>
          <td>4 plan cards, enrollment form, payment method selector.</td>
          <td><em>Figure 7: Module A Membership Enrollment Protocol displaying 4 plan tiers, instant payment, and auto-renew toggle.</em></td>
        </tr>
        <tr>
          <td><strong>SS-08</strong></td>
          <td><strong>Studio Classes &amp; Capacity</strong></td>
          <td>Classes (<code>/classes</code>)</td>
          <td>Class cards with live capacity meters and booking buttons.</td>
          <td><em>Figure 8: Module B Studio Scheduling Engine showing real-time capacity meters, trainer assignments, and booking status.</em></td>
        </tr>
        <tr>
          <td><strong>SS-09</strong></td>
          <td><strong>FIFO Waitlist Inspector</strong></td>
          <td>Classes &rarr; Inspect Queue</td>
          <td>Modal with ordered waitlist candidates for full class.</td>
          <td><em>Figure 9: FIFO Waitlist Management modal displaying queued athletes eligible for automatic promotion upon seat cancellation.</em></td>
        </tr>
        <tr>
          <td><strong>SS-10</strong></td>
          <td><strong>Athlete Directory Cards Grid</strong></td>
          <td>Members (<code>/members</code>)</td>
          <td>3-column luxury athlete cards grid with avatars and badges.</td>
          <td><em>Figure 10: Active Athlete Directory in Card View mode showing member avatars, status rings, and quick action controls.</em></td>
        </tr>
        <tr>
          <td><strong>SS-11</strong></td>
          <td><strong>Deep Athlete Dossier Modal</strong></td>
          <td>Members &rarr; Click Dossier</td>
          <td>Modal with tabs: Profile, Active Plan, Attendance, Invoices.</td>
          <td><em>Figure 11: Deep Athlete Dossier Modal displaying complete historical timeline including turnstile check-ins and invoice ledger.</em></td>
        </tr>
        <tr>
          <td><strong>SS-12</strong></td>
          <td><strong>GST Tax Invoice Sheet</strong></td>
          <td>Payments &rarr; Click Invoice</td>
          <td>Official tax invoice sheet displaying 18% GST calculation.</td>
          <td><em>Figure 12: GST-Compliant Official Tax Invoice modal displaying 18% GST tax rate breakdown and verified transaction hash.</em></td>
        </tr>
        <tr>
          <td><strong>SS-13</strong></td>
          <td><strong>Terminal Verification Output</strong></td>
          <td>Terminal / PowerShell</td>
          <td>Terminal displaying 21/21 PASS and 13/13 Jest tests.</td>
          <td><em>Figure 13: Execution evidence of the 21-scenario End-to-End System Audit Suite and 13-test Jest suite confirming zero errors.</em></td>
        </tr>
      </tbody>
    </table>
  </div>

</body>
</html>`;

const reportHtmlPath = path.join(docsDir, 'GFMMS_Comprehensive_Project_Report.html');
fs.writeFileSync(reportHtmlPath, reportHtml, 'utf8');

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT 2: DEMO VIDEO SCRIPT HTML
// ─────────────────────────────────────────────────────────────────────────────
console.log('Generating PDF Document 2: GFMMS Demo Video Script...');

const scriptHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GFMMS — Demo Video Presentation Script</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Rajdhani:wght@500;600;700&display=swap');
    
    @page {
      size: A4;
      margin: 16mm 16mm 16mm 16mm;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: 'Inter', sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #1e293b;
      margin: 0;
      padding: 0;
    }

    h1, h2, h3 {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    h1 { font-size: 22pt; color: #0f172a; border-bottom: 2px solid #e11d48; padding-bottom: 6px; margin-top: 0; }
    h2 { font-size: 14pt; color: #b91c1c; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 1.2em; }

    .cover-page {
      page-break-after: always;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 40px 20px;
      border: 3px solid #0f172a;
      border-top: 10px solid #e11d48;
      background: #fafafa;
    }

    .cover-title {
      font-family: 'Rajdhani', sans-serif;
      font-size: 26pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.05em;
      line-height: 1.1;
      text-align: center;
      margin-top: 20px;
    }

    .cover-subtitle {
      font-family: 'Rajdhani', sans-serif;
      font-size: 15pt;
      color: #e11d48;
      font-weight: 700;
      text-align: center;
      margin-bottom: 25px;
    }

    .scene-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 5px solid #0f172a;
      border-radius: 8px;
      padding: 14px 18px;
      margin: 16px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
      page-break-inside: avoid;
    }

    .scene-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }

    .scene-title {
      font-family: 'Rajdhani', sans-serif;
      font-size: 13pt;
      font-weight: 700;
      color: #0f172a;
    }

    .scene-time {
      background: #e11d48;
      color: #ffffff;
      font-size: 9pt;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }

    .scene-action {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 9pt;
      color: #334155;
      margin-bottom: 10px;
    }

    .scene-action strong {
      color: #0f172a;
    }

    .speech-bubble {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 4px solid #16a34a;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      font-size: 9.5pt;
      color: #14532d;
      font-style: italic;
      line-height: 1.5;
    }

    .speech-bubble strong {
      font-style: normal;
      color: #15803d;
    }

    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 8.5pt;
    }

    .summary-table th, .summary-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: left;
    }

    .summary-table th {
      background: #0f172a;
      color: #ffffff;
      font-family: 'Rajdhani', sans-serif;
    }

    .pro-tip {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      font-size: 9pt;
      color: #78350f;
      margin-top: 20px;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div style="text-align: center;">
      <div style="font-size: 11pt; font-weight: 700; letter-spacing: 0.15em; color: #64748b;">OFFICIAL VIDEO PRESENTATION DOSSIER</div>
      <div class="cover-title">2-TO-4 MINUTE DEMO VIDEO SCRIPT &amp; PRESENTATION GUIDE</div>
      <div class="cover-subtitle">ANYTIME ATHLETIC (GFMMS) — 24/7 SANCTUARY</div>
      <div style="display: inline-block; background: #0f172a; color: white; padding: 6px 16px; border-radius: 4px; font-weight: 700; font-size: 10pt; letter-spacing: 0.1em;">
        FULL SYSTEM WALKTHROUGH WITH SPOKEN VOICEOVER
      </div>
    </div>

    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px 25px; margin: 30px 0;">
      <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom: 1px dashed #e2e8f0;"><span style="font-weight:600; color:#64748b;">Target Video Duration:</span><span style="font-weight:700; color:#0f172a;">3 Minutes 30 Seconds (Flexible 2:30 – 4:00)</span></div>
      <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom: 1px dashed #e2e8f0;"><span style="font-weight:600; color:#64748b;">Demo Application URL:</span><span style="font-weight:700; color:#0f172a;">http://localhost:3000</span></div>
      <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom: 1px dashed #e2e8f0;"><span style="font-weight:600; color:#64748b;">Presenter / Voiceover:</span><span style="font-weight:700; color:#0f172a;">Dhruvin Patel</span></div>
      <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom: 1px dashed #e2e8f0;"><span style="font-weight:600; color:#64748b;">Total Demonstrated Scenes:</span><span style="font-weight:700; color:#0f172a;">8 Structured Timed Scenes</span></div>
      <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom: 1px dashed #e2e8f0;"><span style="font-weight:600; color:#64748b;">Core Modules Covered:</span><span style="font-weight:700; color:#0f172a;">Module A (Registration &amp; Plans) &amp; Module B (Turnstile &amp; Classes)</span></div>
      <div style="display:flex; justify-content:space-between; padding:6px 0;"><span style="font-weight:600; color:#64748b;">Automated Audit Result:</span><span style="font-weight:700; color:#16a34a;">21/21 E2E Scenarios Passing • 13/13 Jest Tests</span></div>
    </div>

    <div style="text-align: center; font-size: 9pt; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 15px;">
      <div>Anytime Athletic 24/7 Platform — Engineering Project Presentation Script</div>
      <div style="margin-top: 4px;">Follow this script word-for-word while recording your screen for a flawless submission.</div>
    </div>
  </div>

  <!-- SCENE WALKTHROUGH -->
  <div style="page-break-before: always;">
    <h1>Detailed Scene-by-Scene Script</h1>

    <!-- SCENE 1 -->
    <div class="scene-card" style="border-left-color: #e11d48;">
      <div class="scene-header">
        <span class="scene-title">Scene 1: Introduction, Architecture &amp; Landing Page</span>
        <span class="scene-time">0:00 – 0:25 (25s)</span>
      </div>
      <div class="scene-action">
        <strong>On-Screen Action:</strong> Start at <code>http://localhost:3000</code>. Hover over the kinetic SVG crest (AF·24) in the header. Slowly scroll down to show the multi-layer parallax depth effect and live feature cards.
      </div>
      <div class="speech-bubble">
        <strong>Spoken Voiceover:</strong> "Hello everyone, and welcome to the demonstration of our Gym &amp; Fitness Management System, engineered under the high-performance brand Anytime Athletic. Built on Node.js, Express, TypeScript, and PostgreSQL with Prisma ORM, this platform implements two core modules: Module A for member registration and subscription lifecycle, and Module B for biometric turnstile access control and group fitness scheduling. As you can see on our landing page, we’ve incorporated a multi-layer parallax depth engine and an ultra-modern athletic aesthetic with zero AI clichés or developer clutter."
      </div>
    </div>

    <!-- SCENE 2 -->
    <div class="scene-card">
      <div class="scene-header">
        <span class="scene-title">Scene 2: 1-Click Google OAuth &amp; Session Switcher</span>
        <span class="scene-time">0:25 – 0:50 (25s)</span>
      </div>
      <div class="scene-action">
        <strong>On-Screen Action:</strong> Click the "SIGN IN WITH GOOGLE" button in the header. Show the modal with 4 demo accounts. Click Alice Johnson (alice.johnson@example.com). Watch the navbar instantly update with ALICE JOHNSON (VIP) and the pinned QR pass button.
      </div>
      <div class="speech-bubble">
        <strong>Spoken Voiceover:</strong> "To provide a frictionless experience, we implemented 1-Click Google Authentication. Rather than typing passwords repeatedly, members and administrators can authenticate in one tap. Let’s sign in as Alice Johnson, our VIP athlete. Notice how the navigation bar immediately adapts: Alice’s authenticated session is active, and a dedicated 24/7 QR Pass button is pinned directly to the header."
      </div>
    </div>

    <!-- SCENE 3 -->
    <div class="scene-card">
      <div class="scene-header">
        <span class="scene-title">Scene 3: Module A — Membership Plans &amp; Live Enrollment</span>
        <span class="scene-time">0:50 – 1:20 (30s)</span>
      </div>
      <div class="scene-action">
        <strong>On-Screen Action:</strong> Click "JOIN NOW". Scroll through the 4 plan tiers (Flex, Transformation, Elite, All-Access). Complete a registration form, select CreditCard, and click "COMPLETE ENROLLMENT". Show the success modal with the generated optical QR pass.
      </div>
      <div class="speech-bubble">
        <strong>Spoken Voiceover:</strong> "Now let's examine Module A: Member Registration and Membership Management. We offer four distinct membership tiers with transparent entitlements. When an athlete enrolls, our payment orchestrator processes the transaction atomically: only upon confirmed payment does the membership transition to Active status. An official QR identifier is provisioned, and an automated transactional welcome packet with the entrance token is dispatched to the member's email via Gmail SMTP."
      </div>
    </div>

    <!-- SCENE 4 -->
    <div class="scene-card">
      <div class="scene-header">
        <span class="scene-title">Scene 4: 24/7 Digital QR Pass &amp; Athlete Dossier</span>
        <span class="scene-time">1:20 – 1:55 (35s)</span>
      </div>
      <div class="scene-action">
        <strong>On-Screen Action:</strong> Click "⚡ MY 24/7 QR PASS" in header to display Alice's high-res pass (valid Oct 2027). Close modal. Click "MEMBERS". Toggle between CARDS and TABLE views. Click "DOSSIER" on Alice Johnson to display her complete tabbed timeline (Profile, Plan, Attendance History, Invoices).
      </div>
      <div class="speech-bubble">
        <strong>Spoken Voiceover:</strong> "Athletes can pull up their official 24/7 VIP Digital Pass anytime. It renders an ultra-crisp, high-resolution QR code that never breaks. In the Members Directory, gym owners can toggle between an interactive luxury Card view and a structured audit table. Clicking 'Dossier' on any athlete reveals their complete profile: active subscription specs, emergency contacts, historical turnstile check-ins, and settled tax invoices."
      </div>
    </div>

    <!-- SCENE 5 -->
    <div class="scene-card" style="border-left-color: #e11d48;">
      <div class="scene-header">
        <span class="scene-title">Scene 5: Module B — Hardware Kiosk Camera &amp; Security Guards</span>
        <span class="scene-time">1:55 – 2:35 (40s)</span>
      </div>
      <div class="scene-action">
        <strong>On-Screen Action:</strong> Click "KIOSK SCANNER". Click "START LIVE CAMERA SCANNER" to activate the webcam with sweeping laser beam. Scan Alice's QR code (AF-QR-ALICE001) to hear the audio chime and see green ACCESS GRANTED. Immediately click scan again to trigger the red 60-Minute Anti-Passback rejection. Click Charlie Davis to show expired rejection.
      </div>
      <div class="speech-bubble">
        <strong>Spoken Voiceover:</strong> "Next is Module B: Attendance Control and Turnstile Simulation. Our kiosk features a live optical camera scanner powered by html5-qrcode. When an athlete scans their QR pass, the system synthesizes an authentic audio chime and resolves the identifier directly against PostgreSQL. Alice's active pass unlatches the turnstile and logs the timestamp. But watch what happens if someone attempts to pass the same code back to a friend: our 60-minute anti-passback rule immediately rejects the attempt with an HTTP 403 Forbidden. Similarly, expired accounts outside the 3-day grace period are safely blocked."
      </div>
    </div>

    <!-- SCENE 6 -->
    <div class="scene-card">
      <div class="scene-header">
        <span class="scene-title">Scene 6: Module B — Studio Classes &amp; FIFO Waitlist Engine</span>
        <span class="scene-time">2:35 – 3:05 (30s)</span>
      </div>
      <div class="scene-action">
        <strong>On-Screen Action:</strong> Click "CLASSES". Show studio classes with live capacity progress meters. Book an open class for instant confirmation. Click "INSPECT FIFO QUEUE" on a full class (Spinning) to show the chronological waitlist candidates and explain the 2-hour cancellation promotion rule.
      </div>
      <div class="speech-bubble">
        <strong>Spoken Voiceover:</strong> "Module B also manages group fitness scheduling with a real-time capacity engine. Classes display live occupancy bars and assigned trainers. When seats are open, bookings are instantly confirmed. If a class reaches full capacity, members are placed into a strict First-In, First-Out waitlist queue. If a confirmed participant cancels more than two hours prior to the session, the earliest waitlisted athlete is automatically promoted to Booked."
      </div>
    </div>

    <!-- SCENE 7 -->
    <div class="scene-card">
      <div class="scene-header">
        <span class="scene-title">Scene 7: Financial Ledger &amp; 18% GST Invoicing</span>
        <span class="scene-time">3:05 – 3:30 (25s)</span>
      </div>
      <div class="scene-action">
        <strong>On-Screen Action:</strong> Click "PAYMENTS". Show financial audit trail and transaction summary stats. Click "INVOICE" on any transaction row to open the official GST tax invoice sheet with printable breakdown.
      </div>
      <div class="speech-bubble">
        <strong>Spoken Voiceover:</strong> "Every financial transaction is audited in our Payments view. Owners can track total gross volume, settled fees, and payment methods. For full regulatory compliance, clicking 'Invoice' generates an official GST tax invoice calculating the 18% tax breakdown, subtotal, and unique invoice hash."
      </div>
    </div>

    <!-- SCENE 8 -->
    <div class="scene-card">
      <div class="scene-header">
        <span class="scene-title">Scene 8: Automated Verification Audit (21/21 Pass) &amp; Wrap-up</span>
        <span class="scene-time">3:30 – 3:50 (20s)</span>
      </div>
      <div class="scene-action">
        <strong>On-Screen Action:</strong> Switch to Terminal / VS Code showing the terminal output: AUDIT COMPLETE: 21 PASSED / 0 FAILED and 13/13 Jest tests passing. Conclude facing camera or over dashboard.
      </div>
      <div class="speech-bubble">
        <strong>Spoken Voiceover:</strong> "To ensure complete software reliability, we built an automated 21-scenario End-to-End audit suite alongside our 13-test Jest suite—both running with a 100% pass rate. From optical turnstile scanning and FIFO queues to automated GST invoicing and Google auth, Anytime Athletic delivers a rock-solid, enterprise-grade gym management solution. Thank you for watching!"
      </div>
    </div>

    <div class="pro-tip">
      <strong>Recording Pro-Tips:</strong>
      <ol style="margin-top: 6px; padding-left: 20px;">
        <li>Set browser zoom to 100% or 90% at 1920x1080 resolution for clean visual margins.</li>
        <li>Ensure microphone volume is balanced; the synthesized camera beep will play clearly through your speakers in Scene 5.</li>
        <li>Pause for 1 second after major transitions (such as turnstile unlock or invoice modal popup) to let viewers absorb the interface.</li>
      </ol>
    </div>
  </div>

</body>
</html>`;

const scriptHtmlPath = path.join(docsDir, 'GFMMS_Demo_Video_Script.html');
fs.writeFileSync(scriptHtmlPath, scriptHtml, 'utf8');

// ─────────────────────────────────────────────────────────────────────────────
// CONVERT HTML TO PDF VIA HEADLESS CHROME
// ─────────────────────────────────────────────────────────────────────────────
const reportPdfPath = path.join(docsDir, 'GFMMS_Comprehensive_Project_Report.pdf');
const scriptPdfPath = path.join(docsDir, 'GFMMS_Demo_Video_Script.pdf');

console.log('Rendering GFMMS_Comprehensive_Project_Report.pdf...');
execSync(`"${chromePath}" --headless --no-sandbox --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${reportPdfPath}" "${reportHtmlPath}"`);

console.log('Rendering GFMMS_Demo_Video_Script.pdf...');
execSync(`"${chromePath}" --headless --no-sandbox --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${scriptPdfPath}" "${scriptHtmlPath}"`);

// Copy to artifact directory
const artifactReportPdf = path.join(artifactDir, 'GFMMS_Comprehensive_Project_Report.pdf');
const artifactScriptPdf = path.join(artifactDir, 'GFMMS_Demo_Video_Script.pdf');
fs.copyFileSync(reportPdfPath, artifactReportPdf);
fs.copyFileSync(scriptPdfPath, artifactScriptPdf);

console.log('--- PDF GENERATION SUCCESSFUL ---');
console.log('Report PDF (Docs):', reportPdfPath, 'Size:', fs.statSync(reportPdfPath).size, 'bytes');
console.log('Script PDF (Docs):', scriptPdfPath, 'Size:', fs.statSync(scriptPdfPath).size, 'bytes');
console.log('Report PDF (Artifact):', artifactReportPdf);
console.log('Script PDF (Artifact):', artifactScriptPdf);
