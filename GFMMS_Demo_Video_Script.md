# GFMMS / ANYTIME ATHLETIC — 3-MINUTE VIDEO SCRIPT
## Two-Part Continuous Presentation (1.5 Minutes Each)

**Total Duration:** Exactly 3 Minutes (0:00 – 3:00)  
**Structure:** Two contiguous 1.5-minute blocks (Single clean hand-off at 1:30)  
- **Part 1 (`0:00 – 1:30`):** **Dhruvin Shah** — Vision, Stack, 1-Click Auth, Athlete Portal & Module A Enrollment  
- **Part 2 (`1:30 – 3:00`):** **Rishi Shah** — Kiosk Turnstile, Anti-Passback, Classes & FIFO, Owner Command Center & Tests  

**Screen Resolution:** 1080p Full HD (1920x1080) at 60 FPS  
**App URL:** `http://localhost:3000`  
**GitHub Repository:** `https://github.com/dhruvinshah24/gfmms-anytime-athletic`  

---

### Timing & Responsibility Breakdown

```
[0:00 ───────────────────── 1:30] ───► [1:30 ───────────────────── 3:00]
         PART 1: DHRUVIN SHAH                      PART 2: RISHI SHAH
 • Brand Vision & Parallax Hero           • Optical Webcam Kiosk Scanner
 • Node/Express/TS/PostgreSQL Stack       • Audio Chime & 60-Min Anti-Passback
 • 1-Click Google Auth & Personas         • 8 Fitness Classes & FIFO Waitlists
 • Athlete Portal & 24/7 Vector QR Pass   • Owner Command Center & Dossiers
 • Module A: 4 Plan Tiers & Enrollment    • 18% GST Invoicing & 32 E2E Tests
```

---

## PART 1: DHRUVIN SHAH (0:00 – 1:30 | 1.5 Minutes)
### Vision, Architecture, Athlete Portal & Subscription Onboarding

#### Segment 1A: Introduction, Brand Vision & Tech Stack (`0:00 – 0:30`)
- **Screen View:** `http://localhost:3000` (Landing Page)
- **Visual Action:**
  - Start at the top of the page.
  - Hover over the kinetic crest (`AF·24`) with fiery orange-red glow.
  - Slowly scroll down through the 3D parallax hero, showcasing the athletic typography: *"Where Discipline Meets Destiny"*.
  - Point to the clean top navigation with left-aligned branding.
- **Spoken Voiceover — Dhruvin Shah:**
  > *"Hello everyone! Welcome to Anytime Athletic, an enterprise Gym and Fitness Management System engineered by myself, Dhruvin Shah, and Rishi Shah. Built on Node.js, Express, TypeScript, PostgreSQL, and Prisma ORM, this platform delivers an industrial-grade solution for modern 24/7 athletic facilities.
  >
  > Our architecture is anchored by strict Role-Based Access Control: public visitors explore plans, members access a dedicated self-service portal, and administrators manage financial and member operations securely."*

#### Segment 1B: 1-Click Authentication & The Athlete Member Portal (`0:30 – 0:55`)
- **Screen View:** Header -> Click **"SIGN IN WITH GOOGLE"** -> Dedicated Member Portal (`#view-member-portal`)
- **Visual Action:**
  - Click **"SIGN IN WITH GOOGLE"** to show the 6 seeded athlete personas (Alice, Bob, Charlie, Diana, Evan, Fiona).
  - Click **Alice Johnson** (`alice.johnson@example.com`).
  - Show the interface instantly loading the **Athlete Member Portal**.
  - Highlight Alice's **24/7 Digital QR Pass** (crisp vector matrix), active Annual VIP tier, personal turnstile check-in timeline, and booked classes.
- **Spoken Voiceover — Dhruvin Shah:**
  > *"To ensure frictionless onboarding, we integrated 1-Click Google Authentication with personas representing every membership state. Let’s sign in as Alice Johnson, our VIP annual athlete.
  >
  > In her private Athlete Portal, Alice's 24/7 Digital Pass is generated dynamically using client-side vector graphics, ensuring it scans reliably on any screen with zero offline degradation. Below her pass, she tracks her attendance timestamps and upcoming studio class reservations in complete privacy."*

#### Segment 1C: Module A — Membership Plans & Smart Enrollment (`0:55 – 1:30`)
- **Screen View:** Navigation -> Click **"JOIN NOW"** (`#view-register`)
- **Visual Action:**
  - Scroll across the 4 membership tiers: 1-Month Flex, 3-Month Transformation, 6-Month Elite, and 12-Month All-Access.
  - Show the registration form with built-in smart account recovery: demonstrate how existing accounts receive an interactive Amber alert with 1-click login.
  - Select a plan, submit payment, and show instant activation with automated transactional welcome email and invoice dispatch.
- **Spoken Voiceover — Dhruvin Shah:**
  > *"Module A manages member registration across four transparent plan tiers. Our enrollment pipeline is completely atomic: applicant details and payment authorization settle together, instantly activating the membership, issuing a unique QR token, and dispatching a welcome packet with an official GST invoice via Gmail SMTP.
  >
  > If an existing athlete attempts re-registration, intelligent guards prevent database collisions and offer instant sign-in.
  >
  > Now, I'll hand over to Rishi to demonstrate our biometric access kiosk, group class scheduling, and owner analytics."*

---

## PART 2: RISHI SHAH (1:30 – 3:00 | 1.5 Minutes)
### Biometric Turnstile Kiosk, Class Scheduling, Owner Center & Audit

#### Segment 2A: Module B — Hardware Kiosk Simulator & Anti-Passback Defense (`1:30 – 2:05`)
- **Screen View:** Top Navigation Bar -> Click **"KIOSK SCANNER"** (`#view-kiosk`)
- **Visual Action:**
  - Click **"START LIVE CAMERA SCANNER"** to show the webcam feed with the optical red laser sweep.
  - Click **Alice Johnson's Quick-Scan button** (`AF-QR-ALICE001`): Web Audio chime plays, green **"ACCESS GRANTED"** banner illuminates, turnstile unlocks.
  - **Immediately click the scan button again:** Red **"ACCESS DENIED — 60-Minute Anti-Passback Guard Active"** banner triggers.
  - Click **Charlie Davis**: Expired account rejected.
- **Spoken Voiceover — Rishi Shah:**
  > *"Thanks Dhruvin! Module B oversees physical access control through our interactive turnstile kiosk simulator, featuring real-time optical webcam scanning.
  >
  > When Alice scans her QR code at the turnstile, the backend validates her credentials in PostgreSQL, triggers an authentic audio chime, and logs her entrance.
  >
  > To eliminate tailgating and pass-sharing, we built an industrial 60-minute anti-passback rule. If Alice re-scans her pass within an hour, the system rejects it immediately with an HTTP 403 Forbidden. Expired accounts outside our grace period are locked out just as strictly, protecting the club 24/7."*

#### Segment 2B: Module B — Studio Fitness Classes & FIFO Waitlist Engine (`2:05 – 2:30`)
- **Screen View:** Navigation -> Click **"CLASSES"** (`#view-classes`)
- **Visual Action:**
  - Showcase the schedule of **8 Studio Fitness Classes** across Cardio, HIIT, Strength, and Mind & Body disciplines.
  - Point to real-time occupancy meters with dynamic badges.
  - Book an open seat on *Pilates Core* (instant confirmation).
  - Open a full session (*High Intensity Spinning*) and inspect the ordered **FIFO Waitlist Queue**.
- **Spoken Voiceover — Rishi Shah:**
  > *"Module B also orchestrates group fitness scheduling with eight distinct classes across HIIT, Strength, Cardio, and Yoga. Every session displays live seat occupancy meters and certified trainer bios.
  >
  > Open seats confirm instantly. When a session reaches maximum capacity, members join a strict First-In, First-Out waitlist queue. If a confirmed athlete cancels more than two hours prior, our automated engine immediately promotes the earliest waitlisted member to confirmed status."*

#### Segment 2C: Owner Command Center, Automated Tests & Wrap-Up (`2:30 – 3:00`)
- **Screen View:** Sign in as **Owner Dhruvin** (`/members` & `/payments`) -> Split Screen to Terminal
- **Visual Action:**
  - Switch session to **Club Owner Dhruvin**: Top nav unlocks **Members** and **Payments**.
  - Show Member Directory Cards & Table view; click **"DOSSIER"** on Alice to display her multi-tab history.
  - Open **Payments**, click **"INVOICE"** to show printable 18% GST tax invoice.
  - Switch to Terminal showing:
    - `npm test`: **13/13 passed**
    - `npm run audit`: **32/32 PASSED**
- **Spoken Voiceover — Rishi Shah:**
  > *"Finally, the Owner Command Center provides executive oversight. Administrators can inspect comprehensive athlete dossiers tracking check-in timelines and emergency contacts, alongside financial audit ledgers that generate compliant 18% GST tax invoices.
  >
  > Underpinning the entire platform is our verification suite: thirteen Jest unit tests and thirty-two end-to-end integration checks running with a 100% pass rate.
  >
  > Anytime Athletic delivers a complete, enterprise-grade gym management solution. Thank you for watching!"*

---

### Speaker Delivery Tips for Recording
1. **Cadence:** Maintain an even, confident pace (~135–140 words per minute).
2. **The Hand-off at 1:30:** Dhruvin finishes naturally with *"Now, I'll hand over to Rishi..."*, and Rishi begins immediately with *"Thanks Dhruvin!"*.
3. **Screen Setup:** Full HD 1920x1080 at 100% browser zoom for optimal layout.
4. **Volume:** Keep both microphones balanced for seamless sound across both speakers.
