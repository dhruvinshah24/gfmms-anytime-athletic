# ANYTIME ATHLETIC (AF·24 PROTOCOL)
### Gym & Fitness Management System (GFMMS) — 24/7 High-Performance Infrastructure

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=typescript)](http://localhost:3000)
[![Jest Test Suite](https://img.shields.io/badge/Jest%20Tests-13%2F13%20Passing-success?style=for-the-badge&logo=jest)](http://localhost:3000)
[![E2E Audit Suite](https://img.shields.io/badge/E2E%20Audit-21%2F21%20Passing-blue?style=for-the-badge&logo=node.js)](http://localhost:3000)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2017%20%7C%20Prisma-indigo?style=for-the-badge&logo=postgresql)](http://localhost:3000)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-blue?style=for-the-badge&logo=typescript)](http://localhost:3000)
[![License](https://img.shields.io/badge/License-MIT-red?style=for-the-badge)](LICENSE)

An enterprise-grade, full-stack gym management infrastructure engineered with **TypeScript**, **Node.js**, **Express.js**, and **PostgreSQL 17** via **Prisma ORM**. Implements two mandatory software engineering modules: **Module A (Member Registration & Membership Lifecycle)** and **Module B (Biometric Turnstile Access & Studio Class Scheduling)** alongside hardware optical camera scanning, 1-Click Google OAuth, automated transactional emailing, and GST-compliant invoicing.

---

## Table of Contents
- [1. Executive Architecture Overview](#1-executive-architecture-overview)
- [2. Core Engineering Modules](#2-core-engineering-modules)
  - [Module A: Member Registration & Membership Management](#module-a-member-registration--membership-management)
  - [Module B: Attendance Control & Studio Class Booking](#module-b-attendance-control--studio-class-booking)
- [3. Advanced Systems & Innovations](#3-advanced-systems--innovations)
- [4. Database Entity-Relationship Model](#4-database-entity-relationship-model)
- [5. REST API Documentation](#5-rest-api-documentation)
- [6. Account Credentials Matrix](#6-account-credentials-matrix)
- [7. Installation & Quick Start](#7-installation--quick-start)
- [8. Automated Verification & Testing](#8-automated-verification--testing)
- [9. Academic Documentation & PDF Dossiers](#9-academic-documentation--pdf-dossiers)

---

## 1. Executive Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER (HTML5 / SPA)                            │
│  Tailwind CSS 3 • html5-qrcode Engine • Web Audio API • Parallax Depth Mesh │
│  Responsive Touch Viewports • Holographic Cards • Deep Tabbed Dossiers      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / REST (JSON)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    APPLICATION BACKEND (Node.js + Express)                  │
│  Controllers  ──►  Services (Domain Logic)  ──►  Data Access (Prisma ORM)   │
│  JWT / Bcrypt  ──►  Nodemailer (Gmail SMTP)  ──►  QRCode High-Res Engine    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Prisma Client (SQL)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                       PERSISTENCE LAYER (PostgreSQL 17)                     │
│  Members • Memberships • MembershipPlans • Payments • Attendance • Classes   │
│  ClassBookings • Notifications • Audit Logs (Relational Integrity & Enums)  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Engineering Modules

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
- **60-Minute Anti-Passback Guard:** Prevents card sharing. Duplicate check-ins by the same athlete within 60 minutes are rejected with HTTP 403.
- **15-Minute Class Proximity Match:** Checking in within 15 minutes of a scheduled fitness class automatically updates booking status to `Attended`.
- **FIFO Waitlist Queue Engine:**
  - Open class: Status `Booked`, seat reserved.
  - Full class: Status `Waitlisted` in chronological order.
  - Cancellation &gt; 2 hours prior to class: Earliest waitlisted member auto-promoted to `Booked`.
  - Cancellation &lt; 2 hours prior to class: Rejected by policy to protect studio integrity.

---

## 3. Advanced Systems & Innovations

- **Hardware Camera Turnstile:** Real-time webcam optical QR scanner powered by `html5-qrcode` with drag-and-drop image fallback.
- **Web Audio Laser Synthesizer:** Procedural 988Hz-1976Hz laser sweep chirp played on valid QR scans without external audio files.
- **1-Click Google OAuth:** Instant passwordless authentication for both administrative owners and athletes.
- **Gmail SMTP Integration:** Live delivery of welcome packets, attached QR passes, 18% GST invoices, and owner entrance alerts via `dynamitedhruvin@gmail.com`.
- **GST-Compliant Invoicing:** Generates official 18% GST tax invoices calculating taxable base amounts, tax subtotals, and unique hashes.
- **Athlete Dossier Ledger:** Interactive directory with a Cards vs Table toggle and deep dossiers (Profile, Active Plan, Attendance Timeline, Invoices, Bookings).

---

## 4. Database Entity-Relationship Model

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

## 5. REST API Documentation

| Method | Endpoint | Description | Success Response |
|---|---|---|---|
| `GET` | `/health` | Server heartbeat & status | `200 OK` |
| `POST` | `/auth/google` | 1-Click Google authentication | `200 OK` + JWT token |
| `POST` | `/auth/owner/login` | Club owner credentials login | `200 OK` + Admin token |
| `POST` | `/auth/member/login` | Member credentials login | `200 OK` + Member token |
| `GET` | `/plans` | List active membership plans | `200 OK` + Array of plans |
| `GET` | `/members` | List registered athletes | `200 OK` + Members array |
| `GET` | `/members/:id` | Full athlete dossier profile | `200 OK` + Relational data |
| `GET` | `/members/:id/qrcode` | High-res Base64 QR pass | `200 OK` + Data URL |
| `POST` | `/members/register` | Module A enrollment & payment | `201 Created` |
| `POST` | `/attendance/checkin` | Turnstile optical scan check-in | `201 Created` / `403 Forbidden` |
| `POST` | `/attendance/checkout` | Turnstile exit departure stamp | `200 OK` |
| `GET` | `/classes` | Studio classes with capacity | `200 OK` + Roster |
| `POST` | `/bookings` | Reserve seat or enter FIFO queue | `201 Created` |
| `POST` | `/bookings/:id/cancel`| Cancel booking & promote waitlist | `200 OK` |
| `GET` | `/payments` | Financial audit ledger | `200 OK` + Payments |
| `GET` | `/payments/:id/invoice`| GST-compliant 18% tax invoice | `200 OK` + Invoice sheet |
| `GET` | `/payments/:id/receipt`| Official payment receipt | `200 OK` + Receipt |
| `GET` | `/notifications` | Dispatched notifications log | `200 OK` + Logs |

---

## 6. Account Credentials Matrix

| # | Role / Name | Email | Password | QR Passcode | Plan Tier |
|---|---|---|---|---|---|
| **1** | **Club Owner & Admin** | `dynamitedhruvin@gmail.com` | `Anytime@2026` | N/A | Full Administrative Control |
| **2** | **Alice Johnson (VIP)** | `alice.johnson@example.com` | `Anytime@2026` | `AF-QR-ALICE001` | **12-Month Anytime All-Access (Active VIP)** |
| **3** | **Bob Smith** | `bob.smith@example.com` | `Anytime@2026` | `AF-QR-BOB002` | **3-Month Body Transformation (Active)** |
| **4** | **Charlie Davis** | `charlie.davis@example.com` | `Anytime@2026` | `AF-QR-CHARLIE003` | **1-Month Flex (Expired — Boundary Test)** |

---

## 7. Installation & Quick Start

### Prerequisites
- Node.js v20.x or higher
- PostgreSQL 17 running on localhost:5432
- Git

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/anytime-athletic-gfmms.git
cd anytime-athletic-gfmms
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gfmms_db?schema=public"
JWT_SECRET="anytime-athletic-super-secret-jwt-key-2026"
OWNER_EMAIL="dynamitedhruvin@gmail.com"
OWNER_PASSWORD_HASH="$2b$10$4fYDABB4C7wQjFDPaQoVB.dNf73GAvclVvo0bUuC4OnBtdwEcjjwa"
SMTP_USER="dynamitedhruvin@gmail.com"
SMTP_PASS="pgtjcvupqyxtmjnm"
```

### 3. Database Migration & Seed
```bash
# Push schema to database
npm run prisma:push

# Generate Prisma Client
npm run prisma:generate

# Seed 4 plans, classes, and demo accounts
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
# Server running live on http://localhost:3000
```

---

## 8. Automated Verification & Testing

### Run Jest Unit & Integration Tests (13/13 Passing)
```bash
npm test
```
*Executes all assertions for Module A and Module B in sequence and automatically reseeds the database.*

### Run Comprehensive E2E REST System Audit (21/21 Passing)
```bash
npx ts-node scripts/comprehensive-audit.ts
```
*Validates health, auth, plans, optical check-in, anti-passback, grace period, class booking, FIFO waitlist, GST invoicing, receipts, and checkout.*

---

## 9. Academic Documentation & PDF Dossiers

Official project reports generated and available in the `docs/` folder:
- **Comprehensive Project Report (PDF):** [`docs/GFMMS_Comprehensive_Project_Report.pdf`](docs/GFMMS_Comprehensive_Project_Report.pdf) — Complete 13-screenshot submission guide, architecture, and verification matrix.
- **Demo Video Presentation Script (PDF):** [`docs/GFMMS_Demo_Video_Script.pdf`](docs/GFMMS_Demo_Video_Script.pdf) — Timed 2-to-4 minute walkthrough with word-for-word spoken voiceover.

---

*Engineered with precision for Anytime Athletic (AF·24 Protocol). Licensed under the MIT License.*
