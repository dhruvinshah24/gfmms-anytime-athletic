# Anytime Athletic — Comprehensive System Engineering & Project Report
## Autonomous 24/7 Athletic Facility Infrastructure & Biometric Turnstile System

**Project:** Gym & Fitness Management System (GFMMS)  
**Brand Identity:** Anytime Athletic (`AF·24`)  
**Version:** 2.4.0 (Production-Verified Build)  
**Authors & System Architects:** Dhruvin Shah & Rishi Shah  
**Technology Stack:** Node.js • Express • TypeScript • PostgreSQL 17 • Prisma ORM • HTML5 QR • Web Audio API  
**Target Repository:** [https://github.com/dhruvinshah24/gfmms-anytime-athletic](https://github.com/dhruvinshah24/gfmms-anytime-athletic)  
**Documentation PDF:** [GFMMS_Comprehensive_Project_Report.pdf](file:///C:/Users/dhruv/.gemini/antigravity/scratch/gfmms-backend/docs/GFMMS_Comprehensive_Project_Report.pdf)  

---

## 1. Executive Summary & Problem Statement

Modern high-performance fitness facilities operate 24 hours a day, 7 days a week. Delivering safe, autonomous operations without round-the-clock front desk staffing presents four critical engineering challenges:

1. **Tailgating and Badge Sharing:** Traditional barcode scanners allow members to share screenshots or pass physical badges to non-paying guests.
2. **Brittle External Pass Dependencies:** Rendering QR tokens via external image CDNs fails during network dropouts, preventing paying members from entering the physical club.
3. **Studio Overbooking & Waitlist Chaos:** High-demand group fitness sessions experience attendance disputes, manual waitlist arbitrations, and empty seats from late cancellations.
4. **Lack of Role-Based Data Isolation:** Generic gym software frequently exposes confidential member rosters, phone numbers, and company financial figures to standard member sessions.

**Anytime Athletic (GFMMS)** addresses these challenges through an integrated full-stack architecture that unifies:
- **Module A:** Member onboarding, tiered subscription management, atomic payment transactions, smart re-enrollment upserts, and transactional GST tax invoicing.
- **Module B:** Biometric turnstile access control with 60-minute anti-passback defense, optical webcam scanning, and real-time studio class booking with automated FIFO waitlists.
- **Dual-Portal Security Architecture:** Complete Role-Based Access Control (RBAC) isolating member self-service from the Owner Command Center.

---

## 2. Technology Stack & Architectural Specifications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ANYTIME ATHLETIC CLIENT LAYER                         │
│  • Luxury Glassmorphism & Parallax Depth UI                                  │
│  • Client-Side Vector QR Generation (qrcode.min.js - 100% Offline Capable)  │
│  • Optical Camera Barcode Scanner (html5-qrcode)                            │
│  • Synthesized Audio Chime Engine (HTML5 Web Audio API)                    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST / JSON (HTTP)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    NODE.JS / EXPRESS / TYPESCRIPT BACKEND                   │
│  • Stateless JWT Authentication (24h Expiry) with bcrypt Salted Hashes      │
│  • Strict RBAC Route Guards (Athlete Portal vs Owner Command Center)        │
│  • Module A: MemberService, MembershipService, PaymentService               │
│  • Module B: AttendanceService, FitnessClassService, ClassBookingService     │
│  • Transactional Mail Service (Gmail SMTP with PDF GST Invoice Attachments) │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Prisma ORM (Type-Safe Client)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                       POSTGRESQL 17 RELATIONAL DATABASE                     │
│  • ACID Transactional Consistency & Foreign Key Cascades                   │
│  • Unique Indexed Constraints (emailAddress, qrCodeIdentifier)              │
│  • Entities: Member, Membership, Plan, Attendance, Class, Booking, Payment  │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Layer | Technology | Operational Function |
|---|---|---|
| **Backend Runtime** | Node.js v24 &amp; Express v4 | TypeScript 5.x, modular routing, error middleware, strict DTO typing. |
| **Database &amp; ORM** | PostgreSQL 17 &amp; Prisma v5 | ACID transactions, unique indexes, cascading relations, and seed scripts. |
| **Authentication** | JWT &amp; bcryptjs | Stateless role tokens (`owner` vs `member`), salted credential hashing. |
| **Turnstile Kiosk** | html5-qrcode &amp; Web Audio | Real-time optical video QR decoding, synthesized tone feedback. |
| **Pass Generation** | qrcode.min.js | High-density vector QR rendering (error correction level M) directly in browser. |
| **Email Subsystem** | Nodemailer &amp; SMTP | Automated dispatch of welcome packets, vector passcodes, and GST invoices. |

---

## 3. Visual System Walkthrough & Feature Breakdown

### 3.1 Luxury Landing Page & Brand Experience
The public landing page establishes Anytime Athletic's luxury fitness brand identity. The interface integrates Tailwind CSS, dynamic glassmorphism panels, ambient radiant lighting, and a multi-layer parallax depth engine. Public messaging emphasizes athletic dedication: *"Where Discipline Meets Destiny"* and *"24/7 High-Performance Protocol"*.

![Anytime Athletic Landing Page & Hero Section](file:///C:/Users/dhruv/.gemini/antigravity/scratch/gfmms-backend/docs/screenshots/01_hero_dashboard.png)
*Figure 3.1: Anytime Athletic Landing Page featuring 3D parallax depth, kinetic crest, and live club metrics.*

---

### 3.2 1-Click Google Authentication & Multi-Athlete Personas
To eliminate repetitive manual credential entry during evaluations, the platform includes a 1-Click Google Authentication modal populated with six distinct athlete personas representing every operational lifecycle state, along with master administrative access for the club owner.

![1-Click Google Sign-In Modal](file:///C:/Users/dhruv/.gemini/antigravity/scratch/gfmms-backend/docs/screenshots/02_google_auth_modal.png)
*Figure 3.2: 1-Click Google Sign-In modal presenting realistic subscriber personas.*

| Persona | Email | Membership Tier | Testing / Lifecycle Role |
|---|---|---|---|
| **Alice Johnson** | `alice.johnson@example.com` | 12-Month Anytime All-Access | **Active VIP** — 24/7 club access & priority reservations. |
| **Bob Smith** | `bob.smith@example.com` | 3-Month Body Transformation | **Active Member** — Standard multi-month privileges. |
| **Charlie Davis** | `charlie.davis@example.com` | 1-Month Flex (Expired) | **Expired** — Verifies turnstile grace period rejection. |
| **Diana Prince** | `diana.prince@example.com` | 6-Month Performance Elite | **Active Member** — Strength & conditioning specialist. |
| **Evan Wright** | `evan.wright@example.com` | 12-Month Anytime All-Access | **Active VIP** — Long-term subscriber. |
| **Fiona Gallagher** | `fiona.g@example.com` | Pending Applicant | **Pending** — Simulates incomplete registration retry. |
| **Dhruvin Shah** | `dynamitedhruvin@gmail.com` | Club Owner / Administrator | **Master Access** — Full roster & financial ledger privileges. |

---

### 3.3 The Dedicated Athlete Member Portal & 24/7 Digital QR Pass
Upon authentication, athletes are routed to their personal **Athlete Member Portal**. The interface pins their verified pass to the top navigation bar and displays their active tier, validity dates, verified entrance timestamps, and booked fitness classes.

![Alice Johnson 24/7 Digital QR Entrance Pass Modal](file:///C:/Users/dhruv/.gemini/antigravity/scratch/gfmms-backend/docs/screenshots/03_athlete_portal_qr.png)
*Figure 3.3: High-resolution client-side vector 24/7 Digital QR Pass and personal attendance timeline.*

- **Client-Side Vector Synthesis:** Rather than fetching fragile PNGs from external servers, the QR matrix is generated directly in the browser via `qrcode.min.js`. The token renders crisp vector paths on a high-contrast tile, scanning reliably on any smartphone or tablet screen even with zero internet connectivity.
- **Data Privacy Isolation:** Athletes only see their own attendance logs and reservations, completely isolated from other members' records.

---

### 3.4 Module A — Membership Plans & Smart Onboarding
Module A governs the subscription lifecycle across four tailored membership plan tiers:
1. **1-Month Anytime Flex Pass** (₹2,499) — 30-day all-hours access, functional turf, and private locker rooms.
2. **3-Month Body Transformation** (₹6,499) — 90-day multi-club access, unlimited group classes, and fitness body scans.
3. **6-Month Performance Elite** (₹10,999) — 180-day access, 2 personal training sessions, and sauna recovery suites.
4. **12-Month Anytime All-Access** (₹18,999) — 365-day worldwide access, priority class bookings, guest passes, and 4 PT sessions.

![Module A Plan Tiers & Registration Form](file:///C:/Users/dhruv/.gemini/antigravity/scratch/gfmms-backend/docs/screenshots/04_plan_tiers_onboarding.png)
*Figure 3.4: Four transparent membership plan tiers and atomic onboarding checkout form.*

---

### 3.5 Smart Re-Enrollment & Duplicate Account Recovery
In typical relational databases, if an applicant attempts to register after an incomplete payment or with an existing email, Prisma throws a `P2002 Unique constraint failed on (emailAddress)` error, crashing the server.

We re-engineered `src/services/member.service.ts` to implement an intelligent upsert pipeline:
- **Pending & Expired Accounts:** Reuses and updates the existing profile, establishing the new membership tier and processing payment seamlessly without unique constraint collisions.
- **Active Accounts:** Intercepts the request and returns structured code `ACCOUNT_ALREADY_ACTIVE`.
- **Amber Recovery Card:** Renders an intuitive warning card with an immediate **⚡ Sign In With This Account (1-Click)** button, directing the athlete straight to their pass.

![Smart Duplicate Account Recovery Alert Card](file:///C:/Users/dhruv/.gemini/antigravity/scratch/gfmms-backend/docs/screenshots/05_smart_duplicate_recovery.png)
*Figure 3.5: Interactive Amber Account Recovery Card offering direct 1-click authentication.*

---

### 3.6 Module B — Biometric Turnstile Kiosk Simulator
Module B manages physical facility access control. The interactive kiosk simulator embeds an optical camera scanner powered by `html5-qrcode` alongside synthesized Web Audio frequency feedback.

![Module B Turnstile Hardware Kiosk Scanner (Access Granted)](file:///C:/Users/dhruv/.gemini/antigravity/scratch/gfmms-backend/docs/screenshots/06_optical_turnstile_kiosk.png)
*Figure 3.6: Live optical camera scanning interface with sweeping laser overlay and Access Granted banner.*

- **Instant Optical Decoding:** Reads QR tokens from webcams or smartphone screens in under 150 milliseconds.
- **Audio-Visual Feedback:** Synthesizes an authentic positive high chime and illuminates a green **"ACCESS GRANTED"** banner while logging the attendance record in PostgreSQL.

---

### 3.7 The 60-Minute Anti-Passback Defense Guard
To eliminate tailgating and unauthorized pass-sharing, the backend implements an industrial anti-passback rule in `src/services/attendance.service.ts`.

If the same QR token is scanned again within **60 minutes**:
- The request is immediately rejected with an **HTTP 403 Forbidden** status.
- The turnstile triggers a low-frequency denial tone and flashes a red **"ACCESS DENIED — 60-Minute Anti-Passback Guard Active"** banner.
- No duplicate attendance row is written to PostgreSQL, protecting attendance ledger integrity.

![Turnstile Anti-Passback 60-Minute Duplicate Rejection Banner](file:///C:/Users/dhruv/.gemini/antigravity/scratch/gfmms-backend/docs/screenshots/07_turnstile_anti_passback.png)
*Figure 3.7: Instant rejection of duplicate check-in within 60 minutes, blocking tailgating.*

---

### 3.8 Module B — Studio Fitness Classes & Live Capacity Gauges
Module B orchestrates the group fitness schedule across eight distinct sessions in four athletic disciplines:
- **Cardio & HIIT:** *High Intensity Spinning* (20 seats, full), *Anytime Boxing & Strike* (15 seats), *Metabolic Conditioning HIIT* (25 seats).
- **Strength & Power:** *Olympic Power Lifting* (12 seats), *Functional Crossfit* (18 seats), *Kettlebell Conditioning* (16 seats).
- **Mind & Body:** *Sunrise Vinyasa Flow* (25 seats), *Pilates Core & Alignment* (14 seats).

![Anytime Athletic 8 Group Fitness Classes Schedule](file:///C:/Users/dhruv/.gemini/antigravity/scratch/gfmms-backend/docs/screenshots/08_group_fitness_classes.png)
*Figure 3.8: Studio fitness schedule across 4 disciplines with live capacity meters and instructor profiles.*

---

### 3.9 Concurrency-Safe FIFO Waitlist Engine
When a high-demand class reaches maximum capacity, applicants join an automated **First-In, First-Out (FIFO)** waitlist queue.

![FIFO Waitlist Queue Inspector Modal](file:///C:/Users/dhruv/.gemini/antigravity/scratch/gfmms-backend/docs/screenshots/09_fifo_waitlist_modal.png)
*Figure 3.9: Real-time FIFO waitlist queue inspector displaying chronological queue positions.*

- **2-Hour Cancellation Rule:** Confirmed attendees may cancel up to 2 hours prior to the session.
- **Automated Promotion:** When a confirmed participant cancels, the backend automatically promotes the candidate at position #1 to `Booked` status and logs a confirmation notification, maximizing studio capacity.

---

### 3.10 Owner Command Center & Athlete Dossier Audits
Authenticating with Club Owner credentials unlocks the administrative suite:
- **Members Directory:** Displays active, expired, and pending members with view toggles between luxury cards and high-density audit tables.
- **Comprehensive Athlete Dossier:** Clicking "DOSSIER" on any member opens their multi-tab history: active subscription entitlements, emergency contacts, turnstile entry logs, and billing history.

![Owner Command Center Active Member Directory](file:///C:/Users/dhruv/.gemini/antigravity/scratch/gfmms-backend/docs/screenshots/10_owner_member_directory.png)
*Figure 3.10: Owner Member Roster presenting interactive status badges and view toggles.*

![Alice Johnson Comprehensive Athlete Dossier Modal](file:///C:/Users/dhruv/.gemini/antigravity/scratch/gfmms-backend/docs/screenshots/11_athlete_dossier_modal.png)
*Figure 3.11: Comprehensive multi-tab Athlete Dossier tracking subscription specs and verified entries.*

---

### 3.11 Financial Audit Ledger & 18% GST Invoicing
In the **Payments Command Center**, owners audit gross revenue, settlement methods, and transaction hashes. For full regulatory compliance, clicking "INVOICE" opens an official printable GST tax invoice sheet.

![Printable 18% GST Tax Invoice Sheet Modal](file:///C:/Users/dhruv/.gemini/antigravity/scratch/gfmms-backend/docs/screenshots/12_financial_ledger_gst_invoice.png)
*Figure 3.12: Official GST Tax Invoice calculating base rate, 18% GST breakdown, and transaction hash.*

---

## 4. Quality Assurance & Automated Verification

Reliability is backed by an automated testing suite comprising 13 Jest unit tests and 32 end-to-end integration checks, running with a 100% pass rate:

```
PASS tests/moduleA.test.ts
  Module A: Member Registration & Membership Management
    √ should register with valid details + successful payment -> membership Active, QR generated, welcome notification logged (239 ms)
    √ should register with payment failure -> no Active membership created, failure reason returned (29 ms)
    √ should allow member to login with membershipID (14 ms)
    √ should manage membership plans (activate, deactivate, updatePrice) (34 ms)
    √ should process payments, generate receipt, invoice and refund (63 ms)

PASS tests/moduleB.test.ts
  Module B: Attendance Check-in & Class Booking Management
    √ should allow check-in with Active membership -> Attendance row created (90 ms)
    √ should reject check-in with Expired membership -> rejected, no Attendance row (18 ms)
    √ should reject second check-in for the same member within 60 minutes as duplicate (18 ms)
    √ should check-in within 15 minutes of a booked class -> booking auto-marked attended and linked (27 ms)
    √ should book a class with an open seat -> status Booked, confirmation notification (30 ms)
    √ should book a class that's full -> status Waitlisted, waitlist notification (35 ms)
    √ should cancel a booking >2 hours before class -> cancelled, next waitlisted member promoted to Booked (31 ms)
    √ should reject cancelling a booking <2 hours before class (17 ms)

Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
Time:        3.355 s
```

```
=============================================================
       GFMMS COMPREHENSIVE BACKEND SYSTEM AUDIT
=============================================================
[PASS] Database connectivity (PostgreSQL 17)
[PASS] MembershipPlan.create()
[PASS] MembershipPlan.updatePrice()
[PASS] MembershipPlan.deactivate()
[PASS] MembershipPlan.activate()
[PASS] Member.register() with payment success
[PASS] Member status set to Active
[PASS] QR code identifier generated
[PASS] Payment status set to Success
[PASS] Notification.send() WelcomeEmail generated
[PASS] Member.register() handles payment failure
[PASS] Registration flagged as incomplete
[PASS] Membership marked Cancelled, not Active
[PASS] Member.login() authentication
[PASS] Payment.recordManual()
[PASS] Payment.generateReceipt()
[PASS] Payment.generateInvoice()
[PASS] Payment.refund() processed
[PASS] Membership.extend()
[PASS] Membership.checkGracePeriod() for active member
[PASS] Attendance.recordCheckIn() / Member.checkIn()
[PASS] Attendance.preventDuplicate() blocks check-in within 60 minutes
[PASS] Attendance.recordCheckOut()
[PASS] FitnessClass.create()
[PASS] ClassBooking.confirm() with open seat -> Booked
[PASS] ClassBooking.confirm() when full -> Waitlisted
[PASS] ClassBooking.cancel() >2h before class
[PASS] ClassBooking.promoteFromWaitlist() promotes candidate
[PASS] Promoted booking updated to Booked status
[PASS] ClassBooking.cancel() enforces > 2 hours cancellation rule
[PASS] membershipService.expirePendingRegistrations(30) expired stale pending applicant
[PASS] Stale member transitioned to Cancelled

-------------------------------------------------------------
 AUDIT SUMMARY: 32 PASSED | 0 FAILED
-------------------------------------------------------------
```

---

## 5. Engineering Attribution & Git Repository

- **Co-Architects & Lead Engineers:**
  - **Dhruvin Shah:** Module A Architecture, Database Schemas, RBAC Security Models, Smart Re-Enrollment & Duplicate Recovery Pipeline, GST Tax Invoicing Engine.
  - **Rishi Shah:** Module B Architecture, Optical Camera Kiosk Integration, 60-Minute Anti-Passback Security Guards, Group Fitness Scheduling & FIFO Waitlist Engine.
- **Git Repository:** [https://github.com/dhruvinshah24/gfmms-anytime-athletic](https://github.com/dhruvinshah24/gfmms-anytime-athletic)
- **Branch:** `main` (All commits verified and pushed).
