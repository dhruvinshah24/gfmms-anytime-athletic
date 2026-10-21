# GFMMS – Gym & Fitness Center Membership Management System Backend

Backend implementation of the two core modules for the **Gym & Fitness Center Membership Management System (GFMMS)**, strictly aligned with the Software Requirements Specification (SRS), Class Diagram, Sequence Diagrams, and Data Dictionary for academic evaluation.

---

## 1. Tech Stack
- **Language**: TypeScript (`v5.6.3`)
- **Runtime**: Node.js (`v24.x LTS`)
- **Framework**: Express.js (`v4.21.x`)
- **Database**: PostgreSQL (`v17`)
- **ORM**: Prisma (`v5.22.x`)
- **Testing**: Jest + Supertest (`ts-jest`)

---

## 2. Implemented Modules & Scope

### **Module A — Member Registration & Membership Management**
- **Entities**: `Member`, `MembershipPlan`, `Membership`, `Payment`, `Notification`
- **Key Operations**:
  - `Member.register()`
  - `Member.login()`
  - `Membership`: `extend()`, `expire()`, `cancel()`, `checkGracePeriod()`
  - `MembershipPlan`: `activate()`, `deactivate()`, `updatePrice()`
  - `Payment`: `processOnline()`, `recordManual()`, `generateReceipt()`, `generateInvoice()`, `refund()`
  - `Notification`: `send()`, `retry()`, `logDelivery()`

### **Module B — Attendance Check-in & Class Booking Management**
- **Entities**: `Attendance`, `FitnessClass`, `ClassBooking`, `Notification` (shared)
- **Key Operations**:
  - `Attendance`: `recordCheckIn()`, `recordCheckOut()`, `verifyMemberStatus()`, `preventDuplicate()`
  - `FitnessClass`: `create()`, `cancel()`, `getWaitlist()`
  - `ClassBooking`: `confirm()`, `cancel()`, `promoteFromWaitlist()`

> Note: Non-core entities (`Trainer`, `WorkoutPlan`, `DietPlan`, `MealLog`, `WorkoutLog`, `Admin`, `NotificationTemplate`) are kept out of scope as specified; references (e.g., `trainerID`) are stored as clean string/UUID identifiers.

---

## 3. Academic Traceability: Endpoint & Diagram Operation Mapping

| HTTP Endpoint | Controller / Method | Class-Diagram Operation(s) Implemented | Sequence / Communication Flow Trace |
|---|---|---|---|
| `POST /members/register` | `MemberController.register` | `Member.register()`, `MembershipPlan.getAvailablePlans()`, `Payment.processOnline()`, `Membership.extend()`, `Notification.send()` | **Registration Flow**: checks plan validity, validates email/contact uniqueness, runs payment gateway transaction, extends validity by `durationDays`, issues `qrCodeIdentifier`, dispatches `WelcomeEmail` (or cancels and returns `displayFailureReason` on failure). |
| `POST /members/:id/login` | `MemberController.login` | `Member.login()` | Authenticates member by ID/credentials, returns active membership status. |
| `GET /members/:id` | `MemberController.getMember` | `Member` retrieval | Fetches member profile along with membership validity and payment history. |
| `PATCH /memberships/:id/extend` | `MembershipController.extend` | `Membership.extend()` | Extends validity end date by `durationDays`, updates status to `Active`. |
| `PATCH /memberships/:id/expire` | `MembershipController.expire` | `Membership.expire()` | Transitions membership status to `Expired`. |
| `PATCH /memberships/:id/cancel` | `MembershipController.cancel` | `Membership.cancel()` | Cancels membership record and synchronizes member status. |
| `GET /memberships/check-grace/:membershipID` | `MembershipController.checkGracePeriod` | `Membership.checkGracePeriod()` | Verifies if member is active or within configurable 3-day grace period. |
| `GET /plans` | `MembershipPlanController.getAvailablePlans` | `MembershipPlan.getAvailablePlans()` | Returns all active membership subscription plans. |
| `POST /plans` | `MembershipPlanController.createPlan` | `MembershipPlan.create()` | Admin creation of new subscription plans. |
| `PATCH /plans/:id/activate` | `MembershipPlanController.activate` | `MembershipPlan.activate()` | Marks plan `activeStatus = true`. |
| `PATCH /plans/:id/deactivate` | `MembershipPlanController.deactivate` | `MembershipPlan.deactivate()` | Marks plan `activeStatus = false`. |
| `PATCH /plans/:id/price` | `MembershipPlanController.updatePrice` | `MembershipPlan.updatePrice()` | Modifies plan pricing. |
| `POST /payments/online` | `PaymentController.processOnline` | `Payment.processOnline()` | Online payment gateway simulation (Credit Card, Debit Card, UPI). |
| `POST /payments/manual` | `PaymentController.recordManual` | `Payment.recordManual()` | Front-desk cash/card entry by Receptionist. |
| `GET /payments/:id/receipt` | `PaymentController.generateReceipt` | `Payment.generateReceipt()` | Generates structured digital receipt. |
| `GET /payments/:id/invoice` | `PaymentController.generateInvoice` | `Payment.generateInvoice()` | Generates downloadable invoice structure with 18% tax breakdown. |
| `POST /payments/:id/refund` | `PaymentController.refund` | `Payment.refund()` | Refunds transaction with audit reason code. |
| `POST /notifications/send` | `NotificationController.send` | `Notification.send()` | Dispatches and logs notification across Email/SMS/Push. |
| `POST /notifications/:id/retry` | `NotificationController.retry` | `Notification.retry()` | Re-attempts delivery for failed notifications. |
| `GET /notifications/:id/log` | `NotificationController.logDelivery` | `Notification.logDelivery()` | Retrieves delivery audit trail. |
| `POST /attendance/checkin` | `AttendanceController.checkIn` | `Member.checkIn()`, `Attendance.recordCheckIn()`, `Attendance.checkGracePeriod()`, `Attendance.verifyMemberStatus()`, `Attendance.preventDuplicate()` | **Check-in Flow**: verifies membership validity and 3-day grace period; blocks duplicates within 60 mins; auto-links to class bookings within 15 mins of start and marks them attended. |
| `POST /attendance/:id/checkout` | `AttendanceController.checkOut` | `Attendance.recordCheckOut()` | Sets visit `checkOutTimestamp`. |
| `POST /classes` | `FitnessClassController.create` | `FitnessClass.create()` | Creates group class with trainer, schedule, and capacity. |
| `POST /classes/:classId/cancel` | `FitnessClassController.cancelClass` | `FitnessClass.cancel()`, `Notification.send()` | Cancels class and sends SMS cancellation alert to booked members. |
| `GET /classes/:classId/waitlist` | `FitnessClassController.getWaitlist` | `FitnessClass.getWaitlist()` | Fetches waitlist ordered chronologically by `bookingTimestamp`. |
| `POST /classes/:classId/book` | `FitnessClassController.bookClass` | `Member.bookClass()`, `ClassBooking.confirm()`, `Notification.send()` | **Booking Flow**: verifies capacity; assigns `Booked` + sends `BookingConfirmation` if seat open; assigns `Waitlisted` + sends `WaitlistConfirmation` if full. |
| `POST /bookings/:bookingId/cancel` | `ClassBookingController.cancel` | `ClassBooking.cancel()`, `ClassBooking.promoteFromWaitlist()`, `Notification.send()` | **Cancel Flow**: enforces >2 hours cancellation deadline; decrements bookings; promotes earliest waitlisted member to `Booked` and sends seat offer notification. |

---

## 4. Setup & Installation

### Prerequisites
- Node.js (LTS version 20+ or 24+)
- PostgreSQL 14+ installed and running locally on port 5432
- Database credentials configured in `.env` (provided by default for `gfmms_db`)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Verify `.env` has the correct PostgreSQL connection string:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:Dhruvin@2710@localhost:5432/gfmms_db?schema=public"
NODE_ENV=development
```

And `.env.test` for running tests:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:Dhruvin@2710@localhost:5432/gfmms_test_db?schema=public"
NODE_ENV=test
```

### Step 3: Run Database Migrations
Synchronize the PostgreSQL database with the Prisma schema:
```bash
npm run prisma:push
```

### Step 4: Run the Database Seed Script
Populates the database with:
- 1 MembershipPlan (`Annual Premium Fitness Plan`)
- 1 FitnessClass near capacity (`High Intensity Spinning`, Capacity: 2, 1 Current Booking)
- 2 Active Members (`Alice Johnson` with booked seat, `Bob Smith`)
- 1 Expired Member (`Charlie Expired` for testing rejection)

```bash
npm run seed
```

### Step 5: Start the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

---

## 5. Running Automated Tests

The test suite is built with **Jest** and **Supertest** covering all required test branches and edge cases:

```bash
npm test
```

### Verified Test Scenarios:
- **Module A**:
  1. `Register with valid details + successful payment` -> Membership set to `Active`, unique QR code generated, `WelcomeEmail` logged in notifications.
  2. `Register with payment failure` -> No Active membership created, registration marked cancelled/incomplete, failure reason returned.
  3. `Member login` -> Authenticates and retrieves membership status.
  4. `Membership plan lifecycle` -> Price updates, deactivation, and reactivation.
  5. `Payment lifecycle` -> Manual receipt generation, tax invoice calculation, and refunds.
- **Module B**:
  1. `Check-in with Active membership` -> Attendance record created.
  2. `Check-in with Expired membership` -> Rejected with `checkInDenied – please renew`, no Attendance row created.
  3. `Duplicate check-in prevention` -> Second check-in within 60 minutes rejected.
  4. `Check-in within 15 minutes of booked class` -> Class booking auto-marked `Attended` and linked.
  5. `Book class with open seat` -> Status `Booked`, `BookingConfirmation` notification issued.
  6. `Book class when full` -> Status `Waitlisted`, `WaitlistConfirmation` notification issued.
  7. `Cancel booking >2 hours before class` -> Booking cancelled, earliest waitlisted member promoted to `Booked` with notification.
  8. `Cancel booking <2 hours before class` -> Rejected with time-limit error.

---

## 6. Business Logic & Edge Cases Implemented

1. **30-Minute Auto-Expiry on Incomplete Registration**:
   - Implemented via `membershipService.expirePendingRegistrations(windowMinutes = 30)`.
   - Any registration record left in `Pending` state for over 30 minutes without successful payment is automatically marked `Cancelled` and its reserved identifiers freed.
2. **Grace Period Verification**:
   - Per SRS `Renew.Grace`, members with an expired membership can check in within a configurable 3-day grace window.
   - Evaluated dynamically in `AttendanceService.verifyMemberStatus()` and `MembershipService.checkGracePeriod()`.
3. **Waitlist FIFO Promotion**:
   - When a booking is cancelled >2 hours prior to class start, `ClassBooking.promoteFromWaitlist()` queries the earliest waitlisted member (`bookingTimestamp ASC`), promotes them to `Booked`, updates the class counter, and dispatches a notification.

---

## 7. API Testing & Postman Collection
Import the included `gfmms_postman_collection.json` file directly into **Postman** or **Thunder Client** to test all endpoints interactively.
