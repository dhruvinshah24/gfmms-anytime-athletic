# GFMMS / ANYTIME ATHLETIC — VIDEO DEMO SCRIPT (UPDATED)
## Complete Functional Walkthrough & Video Presentation Guide

**Target Video Duration:** ~4 Minutes 30 Seconds (Configurable from 3:30 to 5:30)  
**Resolution:** 1080p Full HD (1920x1080) / 60 FPS  
**Application URL:** `http://localhost:3000`  
**Presenters / Engineers:** Dhruvin Shah & Rishi Shah  
**Target Repository:** `https://github.com/dhruvinshah24/gfmms-anytime-athletic`  

---

### Video Flow Quick Reference (Scene by Scene)

| Scene | Timestamp | Topic / Feature Demonstrated | Page / View | Action on Screen |
|:---:|:---:|---|---|---|
| **1** | `0:00 – 0:35` | Introduction, Athletic Brand Vision & Hero Parallax | Home (`/`) | Scroll landing page, showcase luxury aesthetic and inspiring fitness quotes. |
| **2** | `0:35 – 1:10` | Top Navigation Declutter & Role-Based Access Control (RBAC) | Top Navbar | Demonstrate left-aligned branding, clean navbar, and security separation between Athlete and Owner views. |
| **3** | `1:10 – 1:45` | 1-Click Instant Authentication & Multi-Athlete Personas | Auth Modal | Open Google Sign-In modal; showcase 6 athlete personas (Alice, Bob, Charlie, Diana, Evan, Fiona) & Owner login. |
| **4** | `1:45 – 2:25` | Dedicated Athlete Member Portal & 24/7 Digital QR Pass | Member Portal (`#view-member-portal`) | Log in as Alice Johnson; demonstrate personal dashboard, vector QR pass, and live workout history. |
| **5** | `2:25 – 3:15` | Module A: Plan Tiers, Smart Enrollment & Duplicate Account Recovery | Join Now (`/register`) | Walk through 4 tiers; test registration, demonstrate smart re-enrollment upsert, and show the interactive Amber account recovery card. |
| **6** | `3:15 – 3:55` | Module B: Kiosk Optical Scanner, Audio Feedback & 60-Min Anti-Passback | Kiosk Scanner (`/kiosk`) | Start live webcam optical scanner, scan active QR (Access Granted chime), re-scan to trigger 60-min anti-passback duplicate rejection. |
| **7** | `3:55 – 4:35` | Module B: 8 Studio Classes, Live Capacity & FIFO Waitlist Engine | Classes (`/classes`) | Showcase 8 diverse classes across 4 disciplines; book an open seat, and inspect full class FIFO waitlist promotion. |
| **8** | `4:35 – 5:05` | Owner Command Center, Athlete Dossiers & 18% GST Invoicing | Members & Payments | Switch to Owner session; inspect member roster cards, deep dossier audit modal, and official GST tax invoice. |
| **9** | `5:05 – 5:30` | Automated Verification Suite (13 Jest Tests & 32 E2E Checks) & Wrap-up | Terminal / IDE | Display terminal passing all 13 unit tests and 32 integration checks; present closing remarks. |

---

### Detailed Scene-by-Scene Script with Spoken Voiceover

---

#### Scene 1: Introduction, Athletic Brand Vision & Hero Parallax
- **Timestamp:** `0:00 – 0:35` (35 Seconds)
- **Screen View:** `http://localhost:3000` (Home Page)
- **Visual Action:**
  - Start at the top of the landing page.
  - Hover over the kinetic crest (`AF·24`) with smooth gradient glow.
  - Slowly scroll down through the hero section to show the multi-layer parallax depth effect and ambient radiant orbs.
  - Highlight the customer-facing fitness branding: *"Where Discipline Meets Destiny"*, 24/7 access protocols, and luxury typography without technical clutter.
- **Voiceover Script:**
  > *"Hello everyone! Welcome to the updated demonstration of our Gym & Fitness Management System, built under the high-performance brand Anytime Athletic. Developed by Dhruvin Shah and Rishi Shah, this platform is engineered with Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL. Today, we'll walk you through our complete dual-module architecture: Module A covering subscription lifecycles, and Module B covering real-time biometric turnstile access control and group fitness scheduling. As you can see on our refreshed homepage, we've replaced all engineering jargon with inspiring athletic fitness branding, high-contrast visual tokens, and a smooth multi-layer parallax depth engine."*

---

#### Scene 2: Top Navigation Declutter & Role-Based Access Control (RBAC)
- **Timestamp:** `0:35 – 1:10` (35 Seconds)
- **Screen View:** Top Navbar -> Public Views
- **Visual Action:**
  - Point out the left-aligned `ANYTIME ATHLETIC` brand crest and subtitle.
  - Show the decluttered top navigation links: **Dashboard**, **Join Now**, **Classes**, and the prominent **Kiosk Scanner** button.
  - Explain the strict Role-Based Access Control (RBAC) route guards:
    - Standard athletes only access their dedicated **Athlete Member Portal** and class bookings.
    - Owner-only views like the **Members Directory** and **Payments & Financial Ledger** are hidden from members and restricted to authorized gym owners.
- **Voiceover Script:**
  > *"We streamlined the header navigation to eliminate clutter. The branding is anchored cleanly to the top-left, and navigation items are organized logically. More importantly, we implemented strict Role-Based Access Control. When an athlete visits the site or logs in, they cannot access confidential member rosters or revenue ledgers. Athletes have their own dedicated Member Portal, while gym ownership views are secured exclusively for administrators and club owners."*

---

#### Scene 3: 1-Click Instant Authentication & Multi-Athlete Personas
- **Timestamp:** `1:10 – 1:45` (35 Seconds)
- **Screen View:** Top Navbar -> Sign In Modal
- **Visual Action:**
  - Click the **"SIGN IN WITH GOOGLE"** button in the header.
  - Display the comprehensive authentication modal featuring:
    - 6 realistic athlete personas across all subscription states:
      1. **Alice Johnson** — 1-Year VIP Active
      2. **Bob Smith** — 3-Month Active
      3. **Charlie Davis** — Expired Pass (testing grace period)
      4. **Diana Prince** — 6-Month Elite
      5. **Evan Wright** — Annual All-Access
      6. **Fiona Gallagher** — Pending Applicant
    - Plus **Club Owner Dhruvin** for administrative master access, and a custom Google email sign-in field.
  - Click **Alice Johnson** to demonstrate instant 1-click authentication.
- **Voiceover Script:**
  > *"To deliver an effortless user experience, we built a 1-Click Google Authentication suite. Instead of requiring users to remember test credentials, the modal surfaces six distinct athlete personas representing every subscription state—from active VIPs and annual holders to expired memberships and pending applicants. We also have club owner master access. Let's authenticate as Alice Johnson with one click."*

---

#### Scene 4: Dedicated Athlete Member Portal & 24/7 Digital QR Pass
- **Timestamp:** `1:45 – 2:25` (40 Seconds)
- **Screen View:** Top Navbar -> Click **"⚡ MY 24/7 QR PASS"** / Member Portal View (`#view-member-portal`)
- **Visual Action:**
  - Show the navbar immediately adapting with Alice's verified badge and glowing status indicator.
  - Open the dedicated **Athlete Member Portal**:
    - Display Alice's personal workout statistics, active plan tier (12-Month Anytime All-Access), and valid-through date.
    - Show the **24/7 Digital QR Pass**, generated client-side via `qrcode.min.js` vector matrix rendering, ensuring it never fails or expires.
    - Scroll through Alice's recent turnstile attendance check-in logs and personal booked classes.
- **Voiceover Script:**
  > *"Notice how the interface immediately shifts to Alice's personalized Athlete Portal. Pinned directly to the navigation bar is her 24/7 Digital QR Pass. The pass renders an offline vector matrix that remains sharp on any mobile screen or printed badge. In this portal, athletes can view their current subscription status, review their verified entrance timestamps, and monitor their upcoming group class reservations—all isolated from other athletes' private records."*

---

#### Scene 5: Module A — Plan Tiers, Smart Enrollment & Duplicate Account Recovery
- **Timestamp:** `2:25 – 3:15` (50 Seconds)
- **Screen View:** Navigation -> Click **"JOIN NOW"** (`#view-register`)
- **Visual Action:**
  - Showcase the 4 transparent membership plan tiers:
    1. **1-Month Anytime Flex Pass** (₹2,499)
    2. **3-Month Body Transformation** (₹6,499)
    3. **6-Month Performance Elite** (₹10,999)
    4. **12-Month Anytime All-Access** (₹18,999 — Best Value)
  - Demonstrate our newly implemented **Smart Re-Enrollment & Duplicate Recovery System**:
    - Enter Dhruvin Shah's email (`dhruvin12347@gmail.com`).
    - Attempt to register an active account: show the elegant **Amber "ACCOUNT ALREADY REGISTERED"** card with the **⚡ Sign In With This Account (1-Click)** button, preventing ugly database unique constraint crashes.
    - Toggle the **"Simulate Payment Gateway Failure"** checkbox to demonstrate the clean **Payment Authorization Declined** message.
    - Submit a valid registration to show instant account activation, transactional welcome notification, and automated invoice email dispatch.
- **Voiceover Script:**
  > *"In Module A, we manage the complete athlete enrollment lifecycle across four tailored membership tiers. In our latest update, we addressed edge cases around re-enrollment and duplicate entries. Previously, if an applicant had an incomplete payment or an expired profile, re-registering would trigger a database constraint failure. Now, our backend executes an intelligent upsert: pending or expired accounts are smoothly reactivated, while athletes with active memberships receive an intuitive Amber alert with a direct 1-click sign-in button. When enrollment succeeds, an atomic payment transaction activates the membership, generates a unique QR identifier, and delivers an official welcome packet and invoice via transactional email."*

---

#### Scene 6: Module B — Turnstile Kiosk Simulator, Audio Feedback & 60-Min Anti-Passback
- **Timestamp:** `3:15 – 3:55` (40 Seconds)
- **Screen View:** Top Navbar -> Click **"KIOSK SCANNER"** (`#view-kiosk`)
- **Visual Action:**
  - Open the Hardware Kiosk Simulation View.
  - Click **"START LIVE CAMERA SCANNER"** to demonstrate the HTML5 live webcam feed with optical laser sweep.
  - Click **Alice Johnson's Quick-Scan button** (`AF-QR-ALICE001`):
    - Listen to the synthesized Web Audio laser chime.
    - Observe the green **"ACCESS GRANTED"** banner with turnstile unlocked icon and attendance ledger increment.
  - **Immediately click the scan button again:**
    - Observe the red **"ACCESS DENIED — 60-Minute Anti-Passback Guard Active"** banner, blocking tailgating or pass-sharing.
  - Click **Charlie Davis (Expired)** to demonstrate strict expiration enforcement.
- **Voiceover Script:**
  > *"Now for Module B: Turnstile Access Control. Our kiosk simulator features live optical camera scanning powered by html5-qrcode. When Alice scans her QR code at the turnstile, the system synthesizes an authentic audio chime, verifies her active status in PostgreSQL, and unlatches the entrance barrier. But watch what happens if Alice immediately attempts to re-scan her pass or pass it back to a friend: our 60-minute anti-passback rule blocks the duplicate entry with an HTTP 403 Forbidden. Similarly, expired athletes outside their 3-day grace period are blocked, protecting club security 24/7."*

---

#### Scene 7: Module B — 8 Studio Classes, Live Capacity & FIFO Waitlist Engine
- **Timestamp:** `3:55 – 4:35` (40 Seconds)
- **Screen View:** Navigation -> Click **"CLASSES"** (`#view-classes`)
- **Visual Action:**
  - Showcase the expanded lineup of **8 Studio Fitness Classes** categorized across 4 disciplines:
    - **Cardio & HIIT:** *High Intensity Spinning*, *Anytime Boxing & Strike Conditioning*, *Metabolic Conditioning HIIT*
    - **Strength & Power:** *Olympic Power Lifting*, *Functional Crossfit Endurance*, *Kettlebell Athletic Conditioning*
    - **Mind & Body:** *Sunrise Vinyasa Flow*, *Pilates Core & Alignment*
  - Point out real-time capacity progress meters with color-coded occupancy badges.
  - Book an open seat on *Pilates Core* to show immediate reservation confirmation.
  - Click on a full class (*High Intensity Spinning*) and inspect the **FIFO Waitlist Queue**:
    - Explain that when a booked member cancels more than 2 hours before start time, the first waitlisted member is automatically promoted to confirmed status.
- **Voiceover Script:**
  > *"Module B also orchestrates group fitness reservations. We expanded our schedule to eight distinct classes across Cardio, HIIT, Strength, and Mind & Body disciplines. Each card features real-time occupancy gauges and certified trainer bios. When seats are open, members book instantly. When a session reaches capacity, our FIFO waitlist engine queues participants in strict chronological order. If a confirmed attendee cancels more than two hours prior to the session, the system automatically promotes the earliest waitlisted athlete to confirmed status and dispatches a notification."*

---

#### Scene 8: Owner Command Center, Athlete Dossiers & 18% GST Invoicing
- **Timestamp:** `4:35 – 5:05` (30 Seconds)
- **Screen View:** Auth Modal -> Sign in as **Club Owner Dhruvin** -> Navigate to **"MEMBERS"** and **"PAYMENTS"**
- **Visual Action:**
  - Open the Google Modal and switch to **Dhruvin (Club Owner & Admin)**.
  - Notice the navigation bar immediately unlocks the **Members** directory and **Payments** ledger.
  - Navigate to **Members (`#view-members`)**:
    - Toggle between **Luxury Cards** and **Audit Table** view.
    - Click **"DOSSIER"** on Alice Johnson to inspect her multi-tab profile: plan specs, emergency contacts, check-in audit timeline, and payment ledger.
  - Navigate to **Payments (`#view-payments`)**:
    - Show aggregate gross volume counters.
    - Click **"INVOICE"** on any settled payment to display the printable 18% GST Tax Invoice modal with subtotal, tax calculation, and transaction hash.
- **Voiceover Script:**
  > *"Now, let's switch into the Owner Command Center by signing in as Club Owner Dhruvin. The administration links appear instantly. In the Members Directory, owners can toggle between interactive cards and detailed audit tables. Clicking 'Dossier' reveals an athlete's complete operational profile—including emergency contacts, verified turnstile timestamps, and payment histories. In the Payments section, owners track revenue metrics and can generate compliant GST tax invoices calculating base rate, 18% tax breakdown, and audit reference numbers."*

---

#### Scene 9: Automated Verification Suite (13 Jest Tests & 32 E2E Checks) & Wrap-up
- **Timestamp:** `5:05 – 5:30` (25 Seconds)
- **Screen View:** Split Screen or Switch to Terminal / VS Code
- **Visual Action:**
  - Show the terminal executing:
    - `npm test`: **13 passed, 13 total** across Module A and Module B.
    - `npm run audit`: **32 PASSED | 0 FAILED** comprehensive integration checks.
  - Show the clean git log displaying commits authored by **Dhruvin Shah** and **Rishi Shah**.
  - Deliver confident closing statement.
- **Voiceover Script:**
  > *"Underpinning every feature is our automated test suite: thirteen Jest unit tests and thirty-two end-to-end audit scenarios, all running with a 100% pass rate. From optical turnstile scanning and anti-passback defense to automated waitlist promotions and role-based portals, Anytime Athletic delivers an industrial-grade, full-stack fitness management system. All code and documentation are committed and pushed to GitHub. Thank you for watching!"*

---

### Speaker Delivery Tips & Technical Setup

1. **Screen & Audio Setup:**
   - **Resolution:** 1920x1080 at 100% browser zoom (or 90% for widescreen presentation).
   - **Microphone:** Keep microphone volume steady; the Web Audio turnstile chime will sound crisp and authentic through speakers during Scene 6.
2. **Pacing Guidelines:**
   - **3:30 Pace:** Deliver voiceover with high energy and skip long pauses between clicks.
   - **4:30 – 5:30 Pace:** Allow 1–2 seconds for each UI modal or camera scanner visual to settle before moving to the next tab.
3. **Cursor Movement:**
   - Move smoothly between navigation buttons; avoid rapid or jittery mouse movements.
4. **Live Verification Commands:**
   - Start backend server: `npm run dev`
   - Run unit test suite: `npm test`
   - Run complete audit: `npm run audit`
