const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const screenshotsDir = path.join(docsDir, 'screenshots');
const artifactDir = 'C:\\Users\\dhruv\\.gemini\\antigravity\\brain\\031ae8c5-69c7-454d-870b-780f81e90418';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// Helper to encode image to base64 data URI
function getBase64Image(filename) {
  const filePath = path.join(screenshotsDir, filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

console.log('Loading high-resolution screenshots for report embedding...');
const imgHero = getBase64Image('01_hero_dashboard.png');
const imgAuth = getBase64Image('02_google_auth_modal.png');
const imgQr = getBase64Image('03_athlete_portal_qr.png');
const imgPlans = getBase64Image('04_plan_tiers_onboarding.png');
const imgRecovery = getBase64Image('05_smart_duplicate_recovery.png');
const imgKiosk = getBase64Image('06_optical_turnstile_kiosk.png');
const imgAntiPassback = getBase64Image('07_turnstile_anti_passback.png');
const imgClasses = getBase64Image('08_group_fitness_classes.png');
const imgFifo = getBase64Image('09_fifo_waitlist_modal.png');
const imgDirectory = getBase64Image('10_owner_member_directory.png');
const imgDossier = getBase64Image('11_athlete_dossier_modal.png');
const imgInvoice = getBase64Image('12_financial_ledger_gst_invoice.png');

console.log('Assembling comprehensive, humanized project report HTML...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Anytime Athletic — Comprehensive System Engineering & Project Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Rajdhani:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

    @page {
      size: A4;
      margin: 14mm 14mm 14mm 14mm;
      @bottom-right {
        content: "Page " counter(page);
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #64748b;
      }
      @bottom-left {
        content: "Anytime Athletic (GFMMS) • Engineering Report";
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #94a3b8;
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 9.6pt;
      line-height: 1.55;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* Cover Page */
    .cover-page {
      page-break-after: always;
      height: 96vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 48px 36px;
      background: linear-gradient(145deg, #090d16 0%, #111827 50%, #1e111a 100%);
      color: #ffffff;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: inset 0 0 100px rgba(0,0,0,0.8);
      position: relative;
      overflow: hidden;
    }

    .cover-page::before {
      content: '';
      position: absolute;
      top: -120px;
      right: -120px;
      width: 420px;
      height: 420px;
      background: radial-gradient(circle, rgba(230, 57, 70, 0.28) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .cover-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.12);
      padding-bottom: 24px;
    }

    .cover-brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #e63946, #ff6b35);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 800;
      font-size: 20pt;
      color: #ffffff;
      box-shadow: 0 0 25px rgba(230,57,70,0.5);
    }

    .brand-text h2 {
      font-family: 'Rajdhani', sans-serif;
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      margin: 0;
      color: #ffffff;
    }

    .brand-text p {
      font-family: 'Inter', sans-serif;
      font-size: 8.5pt;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #94a3b8;
      margin: 2px 0 0 0;
    }

    .badge-live {
      background: rgba(0, 245, 160, 0.15);
      color: #00f5a0;
      border: 1px solid rgba(0, 245, 160, 0.4);
      padding: 6px 14px;
      border-radius: 20px;
      font-family: 'Rajdhani', sans-serif;
      font-size: 9.5pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .cover-hero {
      margin: 40px 0;
    }

    .cover-kicker {
      font-family: 'Rajdhani', sans-serif;
      font-size: 13pt;
      font-weight: 700;
      color: #e63946;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-bottom: 12px;
    }

    .cover-title {
      font-family: 'Rajdhani', sans-serif;
      font-size: 34pt;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: 0.03em;
      margin: 0 0 16px 0;
      color: #ffffff;
    }

    .cover-subtitle {
      font-size: 11pt;
      color: #cbd5e1;
      max-width: 620px;
      line-height: 1.6;
      margin-bottom: 28px;
    }

    .cover-modules-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-top: 10px;
    }

    .module-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 16px;
    }

    .module-card h4 {
      font-family: 'Rajdhani', sans-serif;
      font-size: 12pt;
      font-weight: 700;
      color: #e63946;
      margin: 0 0 6px 0;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .module-card p {
      font-size: 8.8pt;
      color: #94a3b8;
      margin: 0;
      line-height: 1.45;
    }

    .cover-footer {
      border-top: 1px solid rgba(255,255,255,0.12);
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .meta-group label {
      display: block;
      font-size: 7.8pt;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
      margin-bottom: 3px;
    }

    .meta-group span {
      font-size: 10pt;
      font-weight: 600;
      color: #f1f5f9;
    }

    /* Headings & Structure */
    h1, h2, h3, h4 {
      font-family: 'Rajdhani', sans-serif;
      color: #0f172a;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    h1 {
      font-size: 20pt;
      line-height: 1.2;
      border-bottom: 2px solid #e63946;
      padding-bottom: 6px;
      margin-top: 24px;
      margin-bottom: 14px;
      color: #0f172a;
    }

    h2 {
      font-size: 14pt;
      line-height: 1.25;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-top: 20px;
      margin-bottom: 10px;
      color: #b91c1c;
    }

    h3 {
      font-size: 11.5pt;
      color: #1e293b;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    p {
      margin-top: 0;
      margin-bottom: 10px;
      color: #334155;
      line-height: 1.6;
    }

    ul, ol {
      margin-top: 4px;
      margin-bottom: 12px;
      padding-left: 20px;
    }

    li {
      margin-bottom: 4px;
      color: #334155;
    }

    /* Screenshot Container */
    .screenshot-block {
      page-break-inside: avoid;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px;
      margin: 14px 0 16px 0;
      box-shadow: 0 4px 10px rgba(0,0,0,0.04);
    }

    .screenshot-img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .screenshot-caption {
      margin-top: 8px;
      font-size: 8.5pt;
      color: #475569;
      font-style: italic;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 4px;
    }

    .screenshot-tag {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8pt;
      letter-spacing: 0.06em;
      background: #fee2e2;
      color: #b91c1c;
      padding: 2px 8px;
      border-radius: 4px;
    }

    /* Info Callout */
    .callout {
      background: #f1f5f9;
      border-left: 4px solid #e63946;
      border-radius: 0 6px 6px 0;
      padding: 10px 14px;
      margin: 12px 0;
      font-size: 9pt;
      color: #334155;
    }

    .callout-title {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 9.5pt;
      color: #0f172a;
      margin-bottom: 3px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 8.8pt;
    }

    th {
      background: #0f172a;
      color: #ffffff;
      font-family: 'Rajdhani', sans-serif;
      font-size: 9pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 8px 10px;
      text-align: left;
      border: 1px solid #0f172a;
    }

    td {
      padding: 7px 10px;
      border: 1px solid #e2e8f0;
      color: #334155;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    /* Code & Terminal */
    pre, code {
      font-family: 'JetBrains Mono', Consolas, monospace;
    }

    code {
      background: #f1f5f9;
      color: #b91c1c;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 8.8pt;
    }

    .terminal-box {
      background: #0f172a;
      color: #f8fafc;
      padding: 12px 14px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.2pt;
      line-height: 1.45;
      margin: 12px 0;
      overflow-x: auto;
      border: 1px solid #1e293b;
    }

    .terminal-box .green { color: #4ade80; }
    .terminal-box .cyan { color: #38bdf8; }
    .terminal-box .yellow { color: #facc15; }

    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>

  <!-- ══════════════════════════════════════════════════════════════════
       COVER PAGE
       ══════════════════════════════════════════════════════════════════ -->
  <div class="cover-page">
    <div class="cover-top">
      <div class="cover-brand">
        <div class="brand-icon">AF</div>
        <div class="brand-text">
          <h2>ANYTIME ATHLETIC</h2>
          <p>Gym &amp; Fitness Management System (GFMMS)</p>
        </div>
      </div>
      <div class="badge-live">v2.4.0 • PRODUCTION READY</div>
    </div>

    <div class="cover-hero">
      <div class="cover-kicker">Comprehensive Engineering &amp; Architecture Report</div>
      <div class="cover-title">Autonomous 24/7 Athletic Facility Infrastructure</div>
      <div class="cover-subtitle">
        An industrial-grade full-stack platform engineered with Node.js, Express, TypeScript, PostgreSQL, and Prisma ORM. Delivering automated subscription onboarding, offline-resilient vector QR passes, optical turnstile scanning with 60-minute anti-passback defense, and real-time FIFO studio class scheduling.
      </div>

      <div class="cover-modules-grid">
        <div class="module-card">
          <h4>Module A: Membership &amp; Financial Lifecycle</h4>
          <p>Automated multi-tier onboarding, atomic payment settlement, smart re-enrollment upserts, duplicate account protection, and transactional GST invoicing.</p>
        </div>
        <div class="module-card">
          <h4>Module B: Access Control &amp; Scheduling</h4>
          <p>Optical camera turnstile simulation, 60-minute anti-passback duplicate blocking, 8-discipline class scheduling, and concurrency-safe FIFO waitlists.</p>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div class="meta-group">
        <label>Principal Engineers</label>
        <span>Dhruvin Shah &amp; Rishi Shah</span>
      </div>
      <div class="meta-group">
        <label>Tech Stack</label>
        <span>Node.js • Express • TypeScript • PostgreSQL 17 • Prisma</span>
      </div>
      <div class="meta-group">
        <label>Test Coverage</label>
        <span>13/13 Jest Units • 32/32 E2E Integration Checks</span>
      </div>
      <div class="meta-group">
        <label>Date of Publication</label>
        <span>October 27, 2026</span>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       SECTION 1: EXECUTIVE SUMMARY & PROBLEM STATEMENT
       ══════════════════════════════════════════════════════════════════ -->
  <h1>1. Executive Summary &amp; System Architecture</h1>

  <p>
    Modern high-performance athletic facilities operate around the clock, demanding autonomous systems capable of governing facility access, subscription billing, and class capacity without requiring perpetual front-desk personnel. Traditional off-the-shelf gym software typically suffers from four critical vulnerabilities:
  </p>
  <ul>
    <li><strong>Tailgating and Badge Sharing:</strong> Lack of biometric or anti-passback mechanisms allows members to share screenshot passes or pass tokens to non-paying guests.</li>
    <li><strong>Brittle Third-Party Integrations:</strong> External QR rendering services fail during network dropouts, locking paying athletes out of the physical facility.</li>
    <li><strong>Manual Reservation Chaos:</strong> Group fitness sessions encounter frequent overbooking disputes, manual waitlist arbitrations, and empty seats due to late cancellations.</li>
    <li><strong>Lack of Role-Based Security:</strong> Standard member accounts often gain visibility into private rosters, member contact numbers, and corporate revenue ledgers.</li>
  </ul>

  <p>
    <strong>Anytime Athletic (GFMMS)</strong> resolves these operational deficiencies by unifying membership lifecycle automation (Module A) with physical turnstile biometric simulation and intelligent class scheduling (Module B).
  </p>

  <div class="callout">
    <div class="callout-title">Core Architectural Principles</div>
    <strong>1. Atomic Execution:</strong> Member creation, payment authorization, and token issuance execute as unified transactions.<br>
    <strong>2. Local-First Vector Resilience:</strong> QR tokens are synthesized directly in the browser via client-side vector matrices, operating 100% offline.<br>
    <strong>3. Strict RBAC Isolation:</strong> Athlete portals are completely quarantined from administrative owner controls and sensitive corporate data.
  </div>

  <h3>System Tech Stack &amp; Runtime Specification</h3>
  <table>
    <thead>
      <tr>
        <th>Layer</th>
        <th>Technology</th>
        <th>Specification / Responsibility</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Backend Runtime</strong></td>
        <td>Node.js &amp; Express</td>
        <td>TypeScript v5.x, RESTful JSON API routing, strict schema validations.</td>
      </tr>
      <tr>
        <td><strong>Database &amp; ORM</strong></td>
        <td>PostgreSQL 17 &amp; Prisma</td>
        <td>Relational schema with ACID transactions, cascading deletes, and unique indexing.</td>
      </tr>
      <tr>
        <td><strong>Authentication &amp; RBAC</strong></td>
        <td>JWT &amp; bcryptjs</td>
        <td>Stateless role-based tokens (Owner vs Member), 24h expiration, salted password hashing.</td>
      </tr>
      <tr>
        <td><strong>Turnstile Scanner</strong></td>
        <td>html5-qrcode &amp; Web Audio</td>
        <td>Real-time optical webcam barcode decoding, synthesized frequency tone feedback.</td>
      </tr>
      <tr>
        <td><strong>Offline Pass Matrix</strong></td>
        <td>qrcode.min.js</td>
        <td>Client-side canvas/vector generation, high-density error-correction level M.</td>
      </tr>
      <tr>
        <td><strong>Transactional Mail</strong></td>
        <td>Nodemailer &amp; Gmail SMTP</td>
        <td>Automated welcome packets, QR entrance tokens, and 18% GST tax invoices.</td>
      </tr>
    </tbody>
  </table>

  <!-- ══════════════════════════════════════════════════════════════════
       SECTION 2: LANDING PAGE & BRAND EXPERIENCE
       ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <h1>2. Frontend Brand Experience &amp; Landing Page</h1>

  <p>
    The public entrance of the web application presents a luxury, high-performance athletic identity. Built with Tailwind CSS, custom glassmorphism panels, and multi-layer parallax depth physics, the interface rejects developer jargon in favor of authentic athletic motivators: <em>"Where Discipline Meets Destiny"</em> and <em>"24/7 High-Performance Protocol"</em>.
  </p>

  <div class="screenshot-block">
    <img src="${imgHero}" class="screenshot-img" alt="Anytime Athletic Landing Page & Hero Section">
    <div class="screenshot-caption">
      <span>Figure 2.1: Anytime Athletic Landing Page featuring 3D parallax depth, kinetic crest, and live club metrics.</span>
      <span class="screenshot-tag">VIEW: DASHBOARD / HOME</span>
    </div>
  </div>

  <h3>Key User Experience Features:</h3>
  <ul>
    <li><strong>Kinetic SVG Brand Crest:</strong> Custom-crafted 24/7 infinity emblem with radiant gradient animations and micro-interactions.</li>
    <li><strong>Ambient Lighting &amp; Parallax Layers:</strong> Multi-layer background depth transforms smoothly on scroll without impacting browser frames-per-second.</li>
    <li><strong>Streamlined Top Navigation:</strong> Left-aligned branding paired with high-contrast active state indicators and dedicated Kiosk launch button.</li>
  </ul>

  <!-- ══════════════════════════════════════════════════════════════════
       SECTION 3: 1-CLICK AUTHENTICATION & MULTI-ATHLETE PERSONAS
       ══════════════════════════════════════════════════════════════════ -->
  <h2>2.1 Seamless 1-Click Authentication &amp; RBAC Personas</h2>
  <p>
    To eliminate repetitive test credential typing and demonstrate realistic lifecycle states, the system features a 1-Click Google Sign-In modal populated with six seeded athlete personas and administrative master control.
  </p>

  <div class="screenshot-block">
    <img src="${imgAuth}" class="screenshot-img" alt="1-Click Google Sign-In Modal with Seeded Personas">
    <div class="screenshot-caption">
      <span>Figure 2.2: Instant Google Sign-In interface presenting realistic subscriber lifecycle personas.</span>
      <span class="screenshot-tag">COMPONENT: AUTH MODAL</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Persona</th>
        <th>Email Address</th>
        <th>Subscription Tier</th>
        <th>Status &amp; Verification Role</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Alice Johnson</strong></td>
        <td><code>alice.johnson@example.com</code></td>
        <td>12-Month Anytime All-Access</td>
        <td>Active VIP — Full 24/7 club &amp; priority class privileges.</td>
      </tr>
      <tr>
        <td><strong>Bob Smith</strong></td>
        <td><code>bob.smith@example.com</code></td>
        <td>3-Month Body Transformation</td>
        <td>Active Member — Standard facility access &amp; bookings.</td>
      </tr>
      <tr>
        <td><strong>Charlie Davis</strong></td>
        <td><code>charlie.davis@example.com</code></td>
        <td>1-Month Anytime Flex (Expired)</td>
        <td>Expired — Verifies 3-day grace period rejection at turnstile.</td>
      </tr>
      <tr>
        <td><strong>Diana Prince</strong></td>
        <td><code>diana.prince@example.com</code></td>
        <td>6-Month Performance Elite</td>
        <td>Active Member — Strength &amp; conditioning specialist.</td>
      </tr>
      <tr>
        <td><strong>Evan Wright</strong></td>
        <td><code>evan.wright@example.com</code></td>
        <td>12-Month Anytime All-Access</td>
        <td>Active Member — Long-term VIP athlete.</td>
      </tr>
      <tr>
        <td><strong>Fiona Gallagher</strong></td>
        <td><code>fiona.g@example.com</code></td>
        <td>Pending Plan Applicant</td>
        <td>Pending — Simulates incomplete registration retry flow.</td>
      </tr>
      <tr>
        <td><strong>Dhruvin Shah</strong></td>
        <td><code>dynamitedhruvin@gmail.com</code></td>
        <td>Club Owner / Administrator</td>
        <td>Master Access — Unlocks Members Directory and Financial Ledger.</td>
      </tr>
    </tbody>
  </table>

  <!-- ══════════════════════════════════════════════════════════════════
       SECTION 4: ATHLETE MEMBER PORTAL & 24/7 QR PASS
       ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <h1>3. The Athlete Member Portal &amp; 24/7 Digital QR Pass</h1>

  <p>
    When an athlete authenticates, the system transitions to the dedicated <strong>Athlete Member Portal</strong>. This hub provides self-service tools while strictly preventing exposure to sensitive club rosters or financial records.
  </p>

  <div class="screenshot-block">
    <img src="${imgQr}" class="screenshot-img" alt="Alice Johnson 24/7 Digital QR Entrance Pass Modal">
    <div class="screenshot-caption">
      <span>Figure 3.1: High-resolution client-side vector 24/7 Digital QR Pass and personal attendance timeline.</span>
      <span class="screenshot-tag">VIEW: ATHLETE PORTAL</span>
    </div>
  </div>

  <h3>Technical Highlights of the Digital Entrance Token:</h3>
  <ul>
    <li><strong>Client-Side Vector Synthesis:</strong> The QR matrix is rendered directly using vector paths on a clean white matrix tile, avoiding external image CDN dependencies and operating 100% offline.</li>
    <li><strong>Tamper-Resistant Identifiers:</strong> Identifiers follow standard formatting (<code>GFMMS-QR-&lt;uuid&gt;</code> or <code>AF-QR-&lt;member&gt;</code>) linked uniquely to the active database record.</li>
    <li><strong>Personalized Telemetry:</strong> Athletes can monitor their verified entrance timestamps, total monthly visits, and upcoming group class reservations.</li>
  </ul>

  <!-- ══════════════════════════════════════════════════════════════════
       SECTION 5: MODULE A — ONBOARDING & SMART RE-ENROLLMENT
       ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <h1>4. Module A: Member Registration &amp; Smart Recovery</h1>

  <p>
    Module A governs athlete enrollment, subscription tier assignment, and payment processing. The system offers four distinct tiers tailored to diverse training commitments.
  </p>

  <div class="screenshot-block">
    <img src="${imgPlans}" class="screenshot-img" alt="Module A Membership Plan Tiers & Registration Form">
    <div class="screenshot-caption">
      <span>Figure 4.1: Four transparent membership plan tiers and atomic onboarding checkout form.</span>
      <span class="screenshot-tag">VIEW: JOIN NOW / ENROLLMENT</span>
    </div>
  </div>

  <h3>Plan Specifications &amp; Entitlement Matrix:</h3>
  <table>
    <thead>
      <tr>
        <th>Membership Tier</th>
        <th>Duration</th>
        <th>Price</th>
        <th>Key Entitlements</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1-Month Flex Pass</strong></td>
        <td>30 Days</td>
        <td>₹2,499</td>
        <td>24/7 Club Access, Cardio &amp; Turf Rig, Machine Zone, Private Showers.</td>
      </tr>
      <tr>
        <td><strong>3-Month Transformation</strong></td>
        <td>90 Days</td>
        <td>₹6,499</td>
        <td>Global Club Network, Unlimited Classes (Spin, HIIT, Yoga), Fitness Scan.</td>
      </tr>
      <tr>
        <td><strong>6-Month Performance Elite</strong></td>
        <td>180 Days</td>
        <td>₹10,999</td>
        <td>All Group Fitness, 2 Personal Training Sessions, Sauna &amp; Wellness Suite.</td>
      </tr>
      <tr>
        <td><strong>12-Month All-Access (VIP)</strong></td>
        <td>365 Days</td>
        <td>₹18,999</td>
        <td>Unlimited Worldwide Access, VIP Priority Bookings, 4 PT Sessions, Guest Passes.</td>
      </tr>
    </tbody>
  </table>

  <h2>4.1 Smart Re-Enrollment &amp; Duplicate Account Recovery</h2>
  <p>
    A common failure in relational membership databases occurs when an applicant attempts registration after an earlier failed payment or with an existing active email, triggering an unhandled <code>P2002 Unique Constraint</code> crash.
  </p>
  <p>
    We re-engineered the backend in <code>src/services/member.service.ts</code> to execute a smart upsert:
  </p>
  <ul>
    <li><strong>Pending / Expired Profiles:</strong> If a record exists with <code>Pending</code> or <code>Cancelled</code> status, the system reuses and updates the profile, establishing the new membership tier and processing payment without collision.</li>
    <li><strong>Active Accounts:</strong> If the email is already associated with an <code>Active</code> membership, the controller intercepts the attempt and returns structured error code <code>ACCOUNT_ALREADY_ACTIVE</code>.</li>
    <li><strong>Contextual Amber Alert:</strong> The frontend renders an intuitive Amber warning card featuring a <strong>⚡ Sign In With This Account (1-Click)</strong> action, allowing the athlete to immediately access their pass.</li>
  </ul>

  <div class="screenshot-block">
    <img src="${imgRecovery}" class="screenshot-img" alt="Smart Duplicate Account Recovery Alert Card">
    <div class="screenshot-caption">
      <span>Figure 4.2: Interactive Amber Account Recovery Card offering direct 1-click authentication.</span>
      <span class="screenshot-tag">SECURITY: DUPLICATE RECOVERY</span>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       SECTION 6: MODULE B — BIOMETRIC TURNSTILE KIOSK & ANTI-PASSBACK
       ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <h1>5. Module B: Turnstile Kiosk &amp; Anti-Passback Defense</h1>

  <p>
    Module B bridges digital authorization with physical facility access. Our hardware kiosk simulator integrates an optical camera scanner powered by <code>html5-qrcode</code> alongside a synthesized Web Audio feedback engine.
  </p>

  <div class="screenshot-block">
    <img src="${imgKiosk}" class="screenshot-img" alt="Module B Turnstile Hardware Kiosk Scanner (Access Granted)">
    <div class="screenshot-caption">
      <span>Figure 5.1: Live optical camera scanning interface with sweeping laser and Access Granted chime.</span>
      <span class="screenshot-tag">MODULE B: TURNSTILE SIMULATOR</span>
    </div>
  </div>

  <h2>5.1 The 60-Minute Anti-Passback Security Guard</h2>
  <p>
    To eliminate tailgating and pass-sharing, the backend implements an industrial anti-passback rule in <code>attendance.service.ts</code>. When a QR pass successfully unlatches the turnstile, an active attendance record is committed.
  </p>
  <p>
    If the same QR token is presented again within <strong>60 minutes</strong>:
  </p>
  <ul>
    <li>The request is immediately blocked with an <strong>HTTP 403 Forbidden</strong> status.</li>
    <li>The kiosk triggers a low-frequency alert buzz and illuminates a prominent red <strong>"ACCESS DENIED — 60-Minute Anti-Passback Guard Active"</strong> banner.</li>
    <li>No duplicate attendance entry is committed to the database, preventing attendance ledger inflation.</li>
  </ul>

  <div class="screenshot-block">
    <img src="${imgAntiPassback}" class="screenshot-img" alt="Turnstile Anti-Passback 60-Minute Duplicate Rejection Banner">
    <div class="screenshot-caption">
      <span>Figure 5.2: Instant rejection of duplicate check-in within 60 minutes, blocking tailgating.</span>
      <span class="screenshot-tag">SECURITY: ANTI-PASSBACK ACTIVE</span>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       SECTION 7: MODULE B — FITNESS CLASSES & FIFO WAITLIST
       ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <h1>6. Module B: Studio Classes &amp; FIFO Waitlists</h1>

  <p>
    The group fitness subsystem manages real-time studio reservations across eight distinct classes categorized into four athletic disciplines.
  </p>

  <div class="screenshot-block">
    <img src="${imgClasses}" class="screenshot-img" alt="Anytime Athletic 8 Group Fitness Classes Schedule">
    <div class="screenshot-caption">
      <span>Figure 6.1: Studio fitness schedule across 4 disciplines with live capacity meters and instructor profiles.</span>
      <span class="screenshot-tag">MODULE B: GROUP CLASSES</span>
    </div>
  </div>

  <h3>8 Studio Classes Overview:</h3>
  <table>
    <thead>
      <tr>
        <th>Class Name</th>
        <th>Category</th>
        <th>Capacity</th>
        <th>Instructor</th>
        <th>Schedule Window</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>High Intensity Spinning</strong></td>
        <td>Cardio &amp; HIIT</td>
        <td>20 Seats (Full)</td>
        <td>Coach Elena Rostova</td>
        <td>Daily 06:30 AM</td>
      </tr>
      <tr>
        <td><strong>Anytime Boxing &amp; Strike</strong></td>
        <td>Cardio &amp; Combat</td>
        <td>15 Seats</td>
        <td>Marcus 'The Tank' Vance</td>
        <td>Mon / Wed / Fri 07:00 PM</td>
      </tr>
      <tr>
        <td><strong>Metabolic Conditioning HIIT</strong></td>
        <td>Cardio &amp; HIIT</td>
        <td>25 Seats</td>
        <td>Sarah Jenkins</td>
        <td>Tue / Thu 08:00 AM</td>
      </tr>
      <tr>
        <td><strong>Olympic Power Lifting</strong></td>
        <td>Strength &amp; Power</td>
        <td>12 Seats</td>
        <td>Dmitri Volkov</td>
        <td>Daily 05:30 PM</td>
      </tr>
      <tr>
        <td><strong>Functional Crossfit</strong></td>
        <td>Strength &amp; Turf</td>
        <td>18 Seats</td>
        <td>Alex Rivera</td>
        <td>Mon / Wed / Fri 06:00 AM</td>
      </tr>
      <tr>
        <td><strong>Kettlebell Conditioning</strong></td>
        <td>Strength</td>
        <td>16 Seats</td>
        <td>Coach Elena Rostova</td>
        <td>Tue / Thu 06:30 PM</td>
      </tr>
      <tr>
        <td><strong>Sunrise Vinyasa Flow</strong></td>
        <td>Mind &amp; Body</td>
        <td>25 Seats</td>
        <td>Ananya Deshmukh</td>
        <td>Daily 06:00 AM</td>
      </tr>
      <tr>
        <td><strong>Pilates Core &amp; Alignment</strong></td>
        <td>Mind &amp; Body</td>
        <td>14 Seats</td>
        <td>Ananya Deshmukh</td>
        <td>Sat / Sun 09:00 AM</td>
      </tr>
    </tbody>
  </table>

  <h2>6.1 Concurrency-Safe FIFO Waitlist Promotion Engine</h2>
  <p>
    When a session reaches capacity (such as <em>High Intensity Spinning</em>), members are placed in a strict <strong>First-In, First-Out (FIFO)</strong> waitlist queue.
  </p>

  <div class="screenshot-block">
    <img src="${imgFifo}" class="screenshot-img" alt="FIFO Waitlist Queue Inspector Modal">
    <div class="screenshot-caption">
      <span>Figure 6.2: Real-time FIFO waitlist queue inspector displaying chronological queue positions.</span>
      <span class="screenshot-tag">LOGIC: FIFO WAITLIST ENGINE</span>
    </div>
  </div>

  <div class="callout">
    <div class="callout-title">Automated Queue Promotion Rules</div>
    <strong>1. 2-Hour Cancellation Cutoff:</strong> Members holding confirmed seats may cancel up to 2 hours prior to the session.<br>
    <strong>2. Instant Chronological Promotion:</strong> Upon cancellation, the athlete at waitlist position #1 is automatically promoted to <code>Booked</code> status.<br>
    <strong>3. Immediate Notification:</strong> The promoted member receives a transactional notification confirming their confirmed seat.
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       SECTION 8: OWNER COMMAND CENTER & GST INVOICING
       ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <h1>7. Owner Command Center, Dossiers &amp; GST Invoicing</h1>

  <p>
    Authenticating as <strong>Club Owner Dhruvin</strong> unlocks the administrative suite, providing comprehensive visibility into active memberships, athlete dossiers, and the financial audit ledger.
  </p>

  <div class="screenshot-block">
    <img src="${imgDirectory}" class="screenshot-img" alt="Owner Command Center Active Member Directory">
    <div class="screenshot-caption">
      <span>Figure 7.1: Owner Member Roster presenting interactive status badges and view toggles.</span>
      <span class="screenshot-tag">ADMIN: MEMBER DIRECTORY</span>
    </div>
  </div>

  <h2>7.1 Deep Athlete Dossier Audit</h2>
  <p>
    Clicking <strong>"DOSSIER"</strong> on any member opens their operational audit history. Organized across four tabbed panels, owners can inspect subscription dates, emergency contacts, turnstile timestamps, and settled payment receipts.
  </p>

  <div class="screenshot-block">
    <img src="${imgDossier}" class="screenshot-img" alt="Alice Johnson Comprehensive Athlete Dossier Modal">
    <div class="screenshot-caption">
      <span>Figure 7.2: Comprehensive multi-tab Athlete Dossier tracking subscription specs and verified entries.</span>
      <span class="screenshot-tag">ADMIN: ATHLETE DOSSIER</span>
    </div>
  </div>

  <h2>7.2 Financial Audit Trail &amp; 18% GST Invoicing</h2>
  <p>
    In the <strong>Payments Command Center</strong>, every transaction is logged with unique reference numbers and settlement timestamps. For regulatory tax compliance, clicking <strong>"INVOICE"</strong> opens an official printable GST tax invoice sheet.
  </p>

  <div class="screenshot-block">
    <img src="${imgInvoice}" class="screenshot-img" alt="Printable 18% GST Tax Invoice Sheet Modal">
    <div class="screenshot-caption">
      <span>Figure 7.3: Official GST Tax Invoice calculating base rate, 18% GST breakdown, and transaction hash.</span>
      <span class="screenshot-tag">FINANCE: 18% GST INVOICE</span>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       SECTION 9: SYSTEM VERIFICATION & TEST AUDIT
       ══════════════════════════════════════════════════════════════════ -->
  <div class="page-break"></div>
  <h1>8. Automated Verification Suite &amp; Test Results</h1>

  <p>
    Reliability is verified across both unit and end-to-end integration tiers. Every build passes 13 Jest unit tests and 32 end-to-end scenario checks with a 100% pass rate.
  </p>

  <h3>Jest Unit Test Suite (13 Passed / 0 Failed):</h3>
  <div class="terminal-box">
<span class="green">PASS</span> tests/moduleA.test.ts
  Module A: Member Registration &amp; Membership Management
    <span class="green">√</span> should register with valid details + successful payment -&gt; membership Active, QR generated, welcome notification logged (239 ms)
    <span class="green">√</span> should register with payment failure -&gt; no Active membership created, failure reason returned (29 ms)
    <span class="green">√</span> should allow member to login with membershipID (14 ms)
    <span class="green">√</span> should manage membership plans (activate, deactivate, updatePrice) (34 ms)
    <span class="green">√</span> should process payments, generate receipt, invoice and refund (63 ms)

<span class="green">PASS</span> tests/moduleB.test.ts
  Module B: Attendance Check-in &amp; Class Booking Management
    <span class="green">√</span> should allow check-in with Active membership -&gt; Attendance row created (90 ms)
    <span class="green">√</span> should reject check-in with Expired membership -&gt; rejected, no Attendance row (18 ms)
    <span class="green">√</span> should reject second check-in for the same member within 60 minutes as duplicate (18 ms)
    <span class="green">√</span> should check-in within 15 minutes of a booked class -&gt; booking auto-marked attended and linked (27 ms)
    <span class="green">√</span> should book a class with an open seat -&gt; status Booked, confirmation notification (30 ms)
    <span class="green">√</span> should book a class that's full -&gt; status Waitlisted, waitlist notification (35 ms)
    <span class="green">√</span> should cancel a booking &gt;2 hours before class -&gt; cancelled, next waitlisted member promoted to Booked (31 ms)
    <span class="green">√</span> should reject cancelling a booking &lt;2 hours before class (17 ms)

<span class="cyan">Test Suites:</span> 2 passed, 2 total
<span class="cyan">Tests:</span>       13 passed, 13 total
<span class="cyan">Time:</span>        3.355 s
  </div>

  <h3>Comprehensive End-to-End System Audit (32 Passed / 0 Failed):</h3>
  <div class="terminal-box">
=============================================================
       GFMMS COMPREHENSIVE BACKEND SYSTEM AUDIT
=============================================================
<span class="green">[PASS]</span> Database connectivity (PostgreSQL 17)
<span class="green">[PASS]</span> MembershipPlan.create()
<span class="green">[PASS]</span> MembershipPlan.updatePrice()
<span class="green">[PASS]</span> MembershipPlan.deactivate()
<span class="green">[PASS]</span> MembershipPlan.activate()
<span class="green">[PASS]</span> Member.register() with payment success
<span class="green">[PASS]</span> Member status set to Active
<span class="green">[PASS]</span> QR code identifier generated
<span class="green">[PASS]</span> Payment status set to Success
<span class="green">[PASS]</span> Notification.send() WelcomeEmail generated
<span class="green">[PASS]</span> Member.register() handles payment failure
<span class="green">[PASS]</span> Registration flagged as incomplete
<span class="green">[PASS]</span> Membership marked Cancelled, not Active
<span class="green">[PASS]</span> Member.login() authentication
<span class="green">[PASS]</span> Payment.recordManual()
<span class="green">[PASS]</span> Payment.generateReceipt()
<span class="green">[PASS]</span> Payment.generateInvoice()
<span class="green">[PASS]</span> Payment.refund() processed
<span class="green">[PASS]</span> Membership.extend()
<span class="green">[PASS]</span> Membership.checkGracePeriod() for active member
<span class="green">[PASS]</span> Attendance.recordCheckIn() / Member.checkIn()
<span class="green">[PASS]</span> Attendance.preventDuplicate() blocks check-in within 60 minutes
<span class="green">[PASS]</span> Attendance.recordCheckOut()
<span class="green">[PASS]</span> FitnessClass.create()
<span class="green">[PASS]</span> ClassBooking.confirm() with open seat -&gt; Booked
<span class="green">[PASS]</span> ClassBooking.confirm() when full -&gt; Waitlisted
<span class="green">[PASS]</span> ClassBooking.cancel() &gt;2h before class
<span class="green">[PASS]</span> ClassBooking.promoteFromWaitlist() promotes candidate
<span class="green">[PASS]</span> Promoted booking updated to Booked status
<span class="green">[PASS]</span> ClassBooking.cancel() enforces &gt; 2 hours cancellation rule
<span class="green">[PASS]</span> membershipService.expirePendingRegistrations(30) expired stale pending applicant
<span class="green">[PASS]</span> Stale member transitioned to Cancelled

-------------------------------------------------------------
 <span class="cyan">AUDIT SUMMARY:</span> <span class="green">32 PASSED</span> | <span class="cyan">0 FAILED</span>
-------------------------------------------------------------
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       SECTION 10: CONCLUSION & ENGINEERING CREDITS
       ══════════════════════════════════════════════════════════════════ -->
  <h1>9. Conclusion &amp; Engineering Credits</h1>

  <p>
    Anytime Athletic (GFMMS) demonstrates a complete, fault-tolerant architecture for modern autonomous gym management. By coupling TypeScript and PostgreSQL with local-first vector pass generation, optical camera hardware turnstiles, and concurrency-safe FIFO queues, the system guarantees 24/7 reliability without front-desk overhead.
  </p>

  <div class="callout">
    <div class="callout-title">Engineering Attribution</div>
    <strong>Co-Developers &amp; System Architects:</strong><br>
    • <strong>Dhruvin Shah:</strong> Module A Lead, Database Architecture, RBAC Security Models, Smart Re-Enrollment &amp; Duplicate Recovery, GST Tax Invoicing Engine.<br>
    • <strong>Rishi Shah:</strong> Module B Lead, Optical Kiosk Camera Integration, 60-Minute Anti-Passback Guards, Group Fitness Scheduling &amp; FIFO Waitlists.<br><br>
    <strong>Repository:</strong> <a href="https://github.com/dhruvinshah24/gfmms-anytime-athletic">https://github.com/dhruvinshah24/gfmms-anytime-athletic</a><br>
    <strong>Branch:</strong> <code>main</code> (Commit verified and synchronized)
  </div>

</body>
</html>`;

const reportHtmlPath = path.join(docsDir, 'GFMMS_Comprehensive_Project_Report.html');
fs.writeFileSync(reportHtmlPath, htmlContent, 'utf8');
console.log('Report HTML written to:', reportHtmlPath);

// Execute Chrome Headless to compile PDF
const reportPdfPath = path.join(docsDir, 'GFMMS_Comprehensive_Project_Report.pdf');
console.log('Compiling high-resolution PDF via headless Chrome...');
execSync(`"${chromePath}" --headless --no-sandbox --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${reportPdfPath}" "${reportHtmlPath}"`);

const stats = fs.statSync(reportPdfPath);
console.log('PDF rendered successfully! Size:', stats.size, 'bytes');

// Copy PDF to brain artifact directory
const artifactPdfPath = path.join(artifactDir, 'GFMMS_Comprehensive_Project_Report.pdf');
fs.copyFileSync(reportPdfPath, artifactPdfPath);
console.log('Copied PDF to artifact directory:', artifactPdfPath);

console.log('=== REPORT PDF GENERATION COMPLETE ===');
