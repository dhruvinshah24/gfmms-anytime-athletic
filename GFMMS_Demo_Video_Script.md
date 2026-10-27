# GFMMS / ANYTIME ATHLETIC — 3-MINUTE DUAL-SPEAKER DEMO SCRIPT
## Complete System Presentation & Technical Walkthrough

**Total Video Runtime:** Exactly 3 Minutes (0:00 – 3:00)  
**Speakers:** **Dhruvin Shah** & **Rishi Shah**  
**Resolution:** 1080p Full HD (1920x1080) / 60 FPS  
**Application URL:** `http://localhost:3000`  
**GitHub Repository:** `https://github.com/dhruvinshah24/gfmms-anytime-athletic`  

---

### Speaker Turn Quick-Reference

| Scene | Timestamp | Topic | Primary Screen View | Speaker 1 (Dhruvin) | Speaker 2 (Rishi) |
|:---:|:---:|---|---|---|---|
| **1** | `0:00 – 0:30` | Introduction, Vision & Stack | Home Page (`/`) | Brand ethos & full-stack tech | Dual modules & RBAC architecture |
| **2** | `0:30 – 1:00` | 1-Click Auth & Athlete Portal | Auth Modal -> Member Portal | 1-Click Google OAuth & personas | 24/7 Vector QR Pass & logs |
| **3** | `1:00 – 1:35` | Module A: Plans & Enrollment | Join Now (`/register`) | 4 Plan tiers & onboarding form | Atomic payment & duplicate guard |
| **4** | `1:35 – 2:10` | Module B: Kiosk & Anti-Passback | Kiosk Scanner (`/kiosk`) | Optical webcam scan & audio chime | 60-min anti-passback rejection |
| **5** | `2:10 – 2:35` | Module B: Classes & FIFO Waitlist | Classes (`/classes`) | 8 studio classes & live gauges | FIFO waitlist auto-promotion |
| **6** | `2:35 – 3:00` | Owner Center, Tests & Wrap-Up | Owner View -> Terminal | Roster dossiers & 18% GST invoice | 13 Jest / 32 E2E tests & closing |

---

### Full Scene-by-Scene Script with Spoken Dialogue

---

#### Scene 1: Introduction, Brand Vision & Stack
- **Timing:** `0:00 – 0:30` (30 Seconds)
- **Screen View:** `http://localhost:3000` (Home Page)
- **Visual Action:**
  - Start on hero header.
  - Hover over the glowing kinetic crest (`AF·24`).
  - Smoothly scroll down through the 3D parallax hero with high-performance typography: *"Where Discipline Meets Destiny"*.

- **[Dhruvin Shah] (0:00 – 0:15):**
  > *"Hello everyone! Welcome to Anytime Athletic, an enterprise-grade Gym and Fitness Center Management System. Built with Node.js, Express, TypeScript, PostgreSQL, and Prisma ORM, this platform is engineered for modern 24/7 facilities requiring industrial precision and luxury athlete experiences."*

- **[Rishi Shah] (0:15 – 0:30):**
  > *"Our architecture implements two core modules: Module A for member registration and subscription lifecycles, and Module B for biometric turnstile security and studio scheduling. A strict Role-Based Access Control model completely isolates private member portals from administrative owner controls."*

---

#### Scene 2: 1-Click Authentication & The Athlete Member Portal
- **Timing:** `0:30 – 1:00` (30 Seconds)
- **Screen View:** Top Navbar -> Click **"SIGN IN WITH GOOGLE"** -> Dedicated Member Portal (`#view-member-portal`)
- **Visual Action:**
  - Click **"SIGN IN WITH GOOGLE"** to reveal the 6 athlete personas (Alice, Bob, Charlie, Diana, Evan, Fiona) and Owner profile.
  - Click **Alice Johnson** (`alice.johnson@example.com`).
  - Interface immediately loads the dedicated **Athlete Member Portal**.
  - Highlight Alice's **24/7 Digital QR Pass**, her active Annual VIP tier, personal turnstile check-in timeline, and booked classes.

- **[Dhruvin Shah] (0:30 – 0:45):**
  > *"To ensure frictionless onboarding, we integrated 1-Click Google Authentication with seeded personas representing every membership state. Let's sign in as Alice Johnson, our VIP annual member. Notice how the navbar immediately pins Alice's active pass directly to the header."*

- **[Rishi Shah] (0:45 – 1:00):**
  > *"In her private Athlete Portal, Alice's 24/7 Digital Pass is generated dynamically using client-side vector graphics, ensuring instant scanning on any screen with zero offline degradation. Below her pass, she tracks her attendance timestamps and upcoming studio class reservations."*

---

#### Scene 3: Module A — Membership Plans, Smart Enrollment & Automated Invoicing
- **Timing:** `1:00 – 1:35` (35 Seconds)
- **Screen View:** Navigation -> Click **"JOIN NOW"** (`#view-register`)
- **Visual Action:**
  - Showcase the 4 membership plan tiers: 1-Month Flex, 3-Month Transformation, 6-Month Elite, and 12-Month All-Access.
  - Fill in enrollment fields or test re-enrollment to show the interactive **Amber "Account Already Registered"** alert with 1-click sign-in button.
  - Submit enrollment with payment method `CreditCard` to show instant activation and token dispatch.

- **[Dhruvin Shah] (1:00 – 1:17):**
  > *"In Module A, athletes choose from four transparent membership tiers. When enrolling, our system features smart account recovery: existing active accounts are automatically identified and directed to sign in, protecting the member database from duplicate conflicts."*

- **[Rishi Shah] (1:17 – 1:35):**
  > *"Enrollment is atomic: only upon verified payment does the membership transition to Active status. The system instantly provisions a unique QR token and dispatches an automated transactional welcome packet with an official GST invoice directly to the member's email."*

---

#### Scene 4: Module B — Hardware Kiosk Simulator & 60-Minute Anti-Passback
- **Timing:** `1:35 – 2:10` (35 Seconds)
- **Screen View:** Top Navigation Bar -> Click **"KIOSK SCANNER"** (`#view-kiosk`)
- **Visual Action:**
  - Click **"START LIVE CAMERA SCANNER"** to show the live optical webcam feed with red laser sweep.
  - Click **Alice Johnson's Quick-Scan button** (`AF-QR-ALICE001`): Web Audio chime sounds, green **"ACCESS GRANTED"** banner displays, turnstile unlatches.
  - **Immediately click the scan button again:** Red **"ACCESS DENIED — 60-Minute Anti-Passback Guard Active"** rejection banner displays.
  - Click **Charlie Davis**: Expired account rejected.

- **[Dhruvin Shah] (1:35 – 1:52):**
  > *"Module B manages physical security through our hardware kiosk simulator, featuring live optical camera scanning. When Alice scans her QR code at the turnstile, the backend validates her credentials in PostgreSQL, triggers an audio chime, and unlocks the entrance."*

- **[Rishi Shah] (1:52 – 2:10):**
  > *"To eliminate tailgating and pass-sharing, we enforce a strict 60-minute anti-passback rule. Scanning the same pass again immediately triggers an HTTP 403 duplicate block. Expired accounts outside our grace period are likewise locked out, ensuring 24/7 security."*

---

#### Scene 5: Module B — Studio Fitness Classes & FIFO Waitlist Engine
- **Timing:** `2:10 – 2:35` (25 Seconds)
- **Screen View:** Navigation -> Click **"CLASSES"** (`#view-classes`)
- **Visual Action:**
  - Display the schedule of **8 Studio Fitness Classes** across Cardio, HIIT, Strength, and Mind & Body disciplines.
  - Highlight real-time capacity progress meters.
  - Book an open seat on *Pilates Core* (instant confirmation).
  - Open a full class (*High Intensity Spinning*) and inspect the ordered **FIFO Waitlist Queue**.

- **[Dhruvin Shah] (2:10 – 2:22):**
  > *"Module B also orchestrates group fitness scheduling with eight distinct classes across HIIT, Strength, Cardio, and Yoga. Every session displays live seat occupancy meters and verified trainer credentials."*

- **[Rishi Shah] (2:22 – 2:35):**
  > *"Open seats confirm instantly. When a session is full, members join a strict First-In, First-Out waitlist. If a confirmed athlete cancels more than two hours prior, the first waitlisted member is automatically promoted to confirmed status."*

---

#### Scene 6: Owner Command Center, Automated Tests & Wrap-Up
- **Timing:** `2:35 – 3:00` (25 Seconds)
- **Screen View:** Switch to **Owner Dhruvin** (`/members` & `/payments`) -> Split Screen to Terminal
- **Visual Action:**
  - Authenticate as **Club Owner Dhruvin**: Top nav unlocks **Members** and **Payments**.
  - Show Member Directory Cards & Table view; click **"DOSSIER"** on Alice to display full multi-tab history.
  - Open **Payments**, click **"INVOICE"** to show printable 18% GST tax invoice.
  - Switch to Terminal showing:
    - `npm test`: **13/13 passed**
    - `npm run audit`: **32/32 PASSED**
  - Both speakers deliver closing lines.

- **[Dhruvin Shah] (2:35 – 2:48):**
  > *"In the Owner Command Center, gym operators have complete oversight. The Member Directory offers detailed athlete dossiers tracking check-in timelines and emergency contacts, alongside financial ledgers that generate compliant 18% GST tax invoices."*

- **[Rishi Shah] (2:48 – 3:00):**
  > *"Every feature is verified by thirteen Jest unit tests and thirty-two end-to-end audit checks running with a 100% pass rate. Anytime Athletic delivers an industrial-grade gym management solution. Thank you for watching!"*

---

### Rehearsal & Recording Checklist
1. **Speaking Speed:** Keep a brisk, confident pace (~140–145 words/minute).
2. **Audio Hand-off:** Let Speaker 2 start immediately as Speaker 1 finishes each sentence; avoid dead air.
3. **Screen Zoom:** 100% browser zoom at 1920x1080 Full HD.
4. **Volume Check:** Ensure both microphones are balanced so transitions between Dhruvin and Rishi sound uniform.
