# ANYTIME ATHLETIC (AF·24 PROTOCOL)
### Gym & Fitness Management System (GFMMS) — 24/7 High-Performance Infrastructure

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=typescript)](http://localhost:3000)
[![Jest Test Suite](https://img.shields.io/badge/Jest%20Tests-13%2F13%20Passing-success?style=for-the-badge&logo=jest)](http://localhost:3000)
[![E2E Audit Suite](https://img.shields.io/badge/E2E%20Audit-32%2F32%20Passing-blue?style=for-the-badge&logo=node.js)](http://localhost:3000)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2017%20%7C%20Prisma-indigo?style=for-the-badge&logo=postgresql)](http://localhost:3000)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-blue?style=for-the-badge&logo=typescript)](http://localhost:3000)
[![License](https://img.shields.io/badge/License-MIT-red?style=for-the-badge)](LICENSE)

An enterprise-grade, full-stack gym management infrastructure engineered with **TypeScript**, **Node.js**, **Express.js**, and **PostgreSQL 17** via **Prisma ORM**. Implements two mandatory software engineering modules: **Module A (Member Registration & Membership Lifecycle)** and **Module B (Biometric Turnstile Access & Studio Class Scheduling)** alongside strict Role-Based Access Control (RBAC), client-side vector QR generation, hardware optical camera scanning, 1-Click Google OAuth, automated transactional emailing, and GST-compliant invoicing.

---

## Table of Contents
- [1. Executive Architecture & RBAC Overview](#1-executive-architecture--rbac-overview)
- [2. Role-Based Access Control (RBAC) Architecture](#2-role-based-access-control-rbac-architecture)
- [3. Core Engineering Modules](#3-core-engineering-modules)
  - [Module A: Member Registration & Membership Management](#module-a-member-registration--membership-management)
  - [Module B: Attendance Control & Studio Class Booking](#module-b-attendance-control--studio-class-booking)
- [4. Studio Class Catalog (8 Diverse Disciplines)](#4-studio-class-catalog-8-diverse-disciplines)
- [5. Design System & High-Contrast Dark Athletic Palette](#5-design-system--high-contrast-dark-athletic-palette)
- [6. Database Entity-Relationship Model](#6-database-entity-relationship-model)
- [7. REST API Documentation](#7-rest-api-documentation)
- [8. Account Credentials & Persona Matrix](#8-account-credentials--persona-matrix)
- [9. Installation & Quick Start](#9-installation--quick-start)
- [10. Automated Verification & Testing](#10-automated-verification--testing)
- [11. Academic Documentation & PDF Dossiers](#11-academic-documentation--pdf-dossiers)

---

## 1. Executive Architecture & RBAC Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER (HTML5 / SPA)                            │
│  Tailwind CSS 3 • html5-qrcode Engine • Web Audio API • Parallax Depth Mesh │
│  Client-Side Vector QR Engine (qrcode.min.js) • Dynamic Role Navigation     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / REST (JSON) + Bearer JWT
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    APPLICATION BACKEND (Node.js + Express)                  │
│  Controllers  ──►  RBAC Middleware  ──►  Services (Domain Logic)            │
│  JWT / Bcrypt  ──►  Nodemailer (Gmail SMTP)  ──►  Prisma ORM Client         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Prisma Client (SQL)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                       PERSISTENCE LAYER (PostgreSQL 17)                     │
│  Members • Memberships • MembershipPlans • Payments • Attendance • Classes   │
│  ClassBookings • Notifications • Audit Logs (Relational Integrity & Enums)  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Role-Based Access Control (RBAC) Architecture

To preserve confidentiality and strictly comply with real-world enterprise standards, the application implements distinct, isolated experiences based on the authenticated user's role:

### 👑 Club Owner & Administrator (`dynamitedhruvin@gmail.com`)
- **Full Master Overview:** Live club metrics, turnstile entry velocity, total monthly recurring revenue (MRR), and active membership distribution.
- **Confidential Athlete Roster:** Searchable and filterable directory of all registered gym members with deep dossiers (personal contact info, medical emergency numbers, full attendance logs, invoice history).
- **Financial Audit Ledger:** Full view of all settled payments, tax breakdowns, manual transaction recording, and refund processing.
- **Studio & Capacity Control:** Real-time visibility into class enrollments, waitlist queues, and trainer assignments.

### 🏋️ Athlete Member Portal (Alice, Bob, Diana, Evan, etc.)
- **Dedicated Personal Sanctuary:** Athlete is routed directly to `#view-member-portal` upon sign-in.
- **Privacy Boundary:** Members **cannot** access other members' profiles, phone numbers, or club revenue data. Administrative routes (`view-members`, `view-payments`) are protected by client and server route guards.
- **My 24/7 Digital Entrance Key:** Instant high-resolution vector QR pass (`AF-QR-...`) with live status and 1-click turnstile simulation.
- **Personal Check-in Timeline:** Real-time chronological log of the member's workouts and turnstile stamps.
- **Class Reservations:** 1-click studio seat booking and cancellation (enforces the mandatory >2 hours cancellation window).
- **Invoices & Receipts:** Access only to the logged-in member's personal payment receipts and tax invoices.

---

## 3. Core Engineering Modules

### Module A: Member Registration & Membership Management
- **Atomic Member Registration:** Enrolls athlete credentials and verifies payment settlement before activating membership status.
- **Conditional State Machine:** Membership status remains `Cancelled` or `Pending` if payment fails (tested via `paymentMethod: 'FAIL'`), provisioning zero turnstile passcodes.
- **Dynamic Passcode Issuance:** Activated athletes receive a human-readable identifier (e.g. `AF-QR-ALICE001`) and a high-resolution Base64 optical QR code.
- **4-Tier Membership Structure:**
  1. **1-Month Anytime Flex Pass:** ₹2,499 (30 Days) — Cardio, turf rig, machine zone.
  2. **3-Month Body Transformation:** ₹6,499 (90 Days) — Global club access, group fitness classes.
  3. **6-Month Performance Elite:** ₹10,999 (180 Days) — Worldwide network, sauna, PT sessions.
  4. **12-Month Anytime All-Access VIP:** ₹18,999 (365 Days) — VIP priority class booking, recovery lounge.
- **Pending Expiration Policy:** Incomplete enrollments expire automatically after 30 minutes.

### Module B: Attendance Control & Studio Class Booking
- **Dual-Identifier Resolution:** Access controller resolves both internal database UUIDs and human-readable QR tokens (`AF-QR-ALICE001`).
- **Access Gatekeeper:**
  - `Active` Membership &rarr; Turnstile unlatches, attendance record logged.
  - `3-Day Grace Buffer` &rarr; Conditional emergency access granted with renewal reminder.
  - `Expired` outside grace &rarr; Rejection with HTTP 403 (`checkInDenied – please renew`).
- **60-Minute Anti-Passback Guard:** Prevents badge sharing. Duplicate check-ins by the same athlete within 60 minutes are rejected with HTTP 403.
- **15-Minute Class Proximity Match:** Checking in within 15 minutes of a scheduled fitness class automatically updates booking status to `Attended`.
- **FIFO Waitlist Queue Engine:**
  - Open class: Status `Booked`, seat reserved.
  - Full class: Status `Waitlisted` in chronological order.
  - Cancellation &gt; 2 hours prior to class: Earliest waitlisted member auto-promoted to `Booked`.
  - Cancellation &lt; 2 hours prior to class: Rejected by policy to protect studio integrity.

---

## 4. Studio Class Catalog (8 Diverse Disciplines)

The system features 8 diverse, scheduled classes across Cardio, Strength, HIIT, and Mind & Body:

| # | Class Title | Category | Trainer | Schedule | Capacity | Waitlist Rule |
|---|---|---|---|---|---|---|
| **1** | **High Intensity Spinning** | Cardio | Elena Rostova | Mon, Wed, Fri 07:00 | 2 Seats (Unit Test Spec) | FIFO Queue |
| **2** | **HIIT Ignition & Metabolic Burn** | HIIT | Marcus Vance | Tue, Thu, Sat 08:30 | 15 Seats | FIFO Queue |
| **3** | **Anytime Power Vinyasa Yoga** | Mind & Body | Priya Sharma | Daily 06:30 & 18:30 | 20 Seats | FIFO Queue |
| **4** | **Anytime Boxing & Strike Conditioning** | Cardio | Tyson Cole | Mon, Wed 19:00 | 12 Seats | FIFO Queue |
| **5** | **CrossFit WOD: Iron Titan** | Strength | Darius Stone | Mon, Wed, Fri 18:00 | 16 Seats | FIFO Queue |
| **6** | **Olympic Weightlifting & Barbell Masterclass**| Strength | Dmitri Volkov | Tue, Thu 17:30 | 10 Seats | FIFO Queue |
| **7** | **Pilates Reformer & Core Alignment** | Mind & Body | Sarah Jenkins | Wed, Sat 10:00 | 8 Seats | FIFO Queue |
| **8** | **HYROX Athletic Race Conditioning** | HIIT | Chris Porter | Sat, Sun 09:00 | 20 Seats | FIFO Queue |

---

## 5. Design System & High-Contrast Dark Athletic Palette

Built with a luxury, high-performance athletic visual identity optimized for contrast, readability, and visual impact:

| Token Name | Hex Code | Visual Role | Contrast Ratio |
|---|---|---|---|
| **Dark Void (Canvas)** | `#050505` | Primary background surface | WCAG AAA Deep Base |
| **Carbon Surface** | `#0C0C0C` | Elevated cards, glassmorphic panels | Subtle depth separation |
| **Electric Crimson** | `#E63946` | Primary action buttons, badges, scanner beam | High energy & vitality |
| **Fire Blaze** | `#FF6B35` | Secondary gradients, active glow highlights | Dynamic heat accents |
| **Neon Cyber Green** | `#00F5A0` | Unlocked turnstile, Active status, success tags | Peak optical recognition |
| **Pure White** | `#FFFFFF` | Primary headers, QR code matrix | Maximum text contrast |
| **Silver Muted** | `#9CA3AF` | Supporting labels, subtitles, metadata | Balanced readability |

---

## 6. Database Entity-Relationship Model

```mermaid
erDiagram
    Member ||--o{ Membership : "holds"
    Member ||--o{ Payment : "makes"
    Member ||--o{ Attendance : "logs"
    Member ||--o{ ClassBooking : "reserves"
    MembershipPlan ||--o{ Membership : "defines"
    FitnessClass ||--o{ ClassBooking : "schedules"
    Attendance ||--o| ClassBooking : "links"

    Member {
        string membershipID PK
        string fullName
        string emailAddress UK
        string contactNumber UK
        string emergencyContact
        date dateOfBirth
        string qrCodeIdentifier UK
        enum membershipStatus
        datetime joinDate
        string passwordHash
    }

    Membership {
        string membershipRecordID PK
        string membershipID FK
        string planID FK
        datetime startDate
        datetime endDate
        enum status
        boolean autoRenewFlag
    }

    MembershipPlan {
        string planID PK
        string name
        int durationDays
        decimal price
        string featureEntitlements
        boolean activeStatus
    }

    Payment {
        string paymentID PK
        string membershipID FK
        decimal amount
        enum paymentMethod
        enum paymentPurpose
        enum status
        datetime timestamp
        string transactionReferenceNumber UK
    }

    Attendance {
        string attendanceID PK
        string membershipID FK
        datetime checkInTimestamp
        datetime checkOutTimestamp
        enum checkInMethod
        string linkedClassBookingID FK
    }

    FitnessClass {
        string classID PK
        string name
        string category
        string trainerID
        datetime schedule
        int durationMinutes
        int capacity
        int currentBookings
        boolean isRecurring
    }

    ClassBooking {
        string bookingID PK
        string membershipID FK
        string classID FK
        datetime bookingTimestamp
        enum status
    }
```

---

## 7. REST API Documentation

| Method | Endpoint | Description | Success Response |
|---|---|---|---|
| `GET` | `/health` | Server heartbeat & status | `200 OK` |
| `POST` | `/auth/google` | 1-Click Google authentication | `200 OK` + JWT token |
| `POST` | `/auth/owner/login` | Club owner credentials login | `200 OK` + Admin token |
| `POST` | `/auth/member/login` | Member credentials login | `200 OK` + Member token |
| `GET` | `/auth/me` | Reload current session profile from DB | `200 OK` + Enriched user |
| `GET` | `/plans` | List active membership plans | `200 OK` + Array of plans |
| `GET` | `/members` | List registered athletes (Owner only) | `200 OK` + Members array |
| `GET` | `/members/:id` | Full athlete dossier profile | `200 OK` + Relational data |
| `GET` | `/members/:id/qrcode` | High-res Base64 PNG QR pass | `200 OK` + Data URL |
| `POST` | `/members/register` | Module A enrollment & payment | `201 Created` |
| `POST` | `/attendance/checkin` | Turnstile optical scan check-in | `201 Created` / `403 Forbidden` |
| `POST` | `/attendance/checkout` | Turnstile exit departure stamp | `200 OK` |
| `GET` | `/classes` | Studio classes with capacity | `200 OK` + Roster |
| `POST` | `/bookings` | Reserve seat or enter FIFO queue | `201 Created` |
| `POST` | `/bookings/:id/cancel`| Cancel booking & promote waitlist | `200 OK` |
| `GET` | `/payments` | Financial audit ledger (Owner only) | `200 OK` + Payments |
| `GET` | `/payments/:id/invoice`| GST-compliant 18% tax invoice | `200 OK` + Invoice sheet |
| `GET` | `/payments/:id/receipt`| Official payment receipt | `200 OK` + Receipt |

---

## 8. Account Credentials & Persona Matrix

| # | Role / Persona | Email | Default Password | QR Token | Plan Tier & Access Scope |
|---|---|---|---|---|---|
| **1** | **Club Owner & Admin** | `dynamitedhruvin@gmail.com` | `IronPeak@2026` | N/A | **Master Access** (Full Admin Command Center) |
| **2** | **Alice Johnson** | `alice.johnson@example.com` | `Anytime@2026` | `AF-QR-ALICE001` | **12-Month Anytime All-Access (Active VIP)** |
| **3** | **Bob Smith** | `bob.smith@example.com` | `Anytime@2026` | `AF-QR-BOB002` | **3-Month Body Transformation (Active)** |
| **4** | **Charlie Davis** | `charlie.davis@example.com` | `Anytime@2026` | `AF-QR-CHARLIE003` | **1-Month Flex (Expired — Boundary Test)** |
| **5** | **Diana Prince** | `diana.prince@example.com` | `Anytime@2026` | `AF-QR-DIANA004` | **6-Month Performance Elite (Active)** |
| **6** | **Evan Wright** | `evan.wright@example.com` | `Anytime@2026` | `AF-QR-EVAN005` | **12-Month Anytime All-Access (Active)** |
| **7** | **Fiona Gallagher** | `fiona.g@example.com` | `Anytime@2026` | `AF-QR-FIONA006` | **1-Month Flex (Pending Applicant)** |

---

## 9. Installation & Quick Start

### Prerequisites
- Node.js v20.x or higher
- PostgreSQL 17 running on `localhost:5432`
- Git

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/dhruvinshah24/gfmms-anytime-athletic.git
cd gfmms-anytime-athletic
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:Dhruvin@2710@localhost:5432/gfmms_db?schema=public"
JWT_SECRET="ironpeak-super-secret-jwt-key-2026-gfmms"
OWNER_EMAIL="dynamitedhruvin@gmail.com"
OWNER_PASSWORD_HASH="$2b$10$967Qti7bVykUoFm/BSWAFeK5FRLGqZ22Koq4HZZaJi72cAVT.eDtW"
SMTP_USER="dynamitedhruvin@gmail.com"
SMTP_PASS="pgtjcvupqyxtmjnm"
```

### 3. Database Migration & Seed
```bash
# Push schema to database
npm run prisma:push

# Generate Prisma Client
npm run prisma:generate

# Seed 4 plans, 8 classes, and 6 athlete personas
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
# Server running live on http://localhost:3000
```

---

## 10. Automated Verification & Testing

### Run Jest Unit & Integration Tests (13/13 Passing)
```bash
npm test
```
*Executes all assertions for Module A and Module B in sequence and automatically reseeds the database.*

### Run Comprehensive E2E System Audit Suite (32/32 Passing)
```bash
npm run audit
```
*Validates database connectivity, plan lifecycle, member registration, anti-passback, turnstile check-in, class bookings, FIFO waitlist promotion, cancellation timing rules, GST invoicing, and Gmail SMTP notifications.*

---

## 11. Academic Documentation & PDF Dossiers

Official project reports generated and available in the `docs/` folder:
- **Comprehensive Project Report (PDF):** [`docs/GFMMS_Comprehensive_Project_Report.pdf`](docs/GFMMS_Comprehensive_Project_Report.pdf) — Complete 13-screenshot submission guide, architecture, and verification matrix.
- **Demo Video Presentation Script (PDF):** [`docs/GFMMS_Demo_Video_Script.pdf`](docs/GFMMS_Demo_Video_Script.pdf) — Timed 2-to-4 minute walkthrough with word-for-word spoken voiceover.

---

*Engineered with precision for Anytime Athletic (AF·24 Protocol). Licensed under the MIT License.*
