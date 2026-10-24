import prisma from '../src/config/db';

const BASE_URL = 'http://localhost:3000';

interface AuditResult {
  step: string;
  endpoint: string;
  status: 'PASS' | 'FAIL';
  details: string;
}

const results: AuditResult[] = [];

function record(step: string, endpoint: string, status: 'PASS' | 'FAIL', details: string) {
  results.push({ step, endpoint, status, details });
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} [${status}] ${step} (${endpoint}): ${details}`);
}

async function api(path: string, options: any = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch (e) {
    // raw text
  }
  return { status: res.status, data };
}

async function runAudit() {
  console.log('===============================================================');
  console.log('   ANYTIME ATHLETIC (GFMMS) — COMPLETE SYSTEM AUDIT SUITE      ');
  console.log('===============================================================');

  // Clear prior test attendances so 60-min window check starts from clean slate
  await prisma.attendance.deleteMany();

  // 1. Health Check
  const healthRes = await api('/health');
  if (healthRes.status === 200 && healthRes.data?.status === 'ok') {
    record('System Health Check', 'GET /health', 'PASS', `Server alive (timestamp: ${healthRes.data.timestamp})`);
  } else {
    record('System Health Check', 'GET /health', 'FAIL', `Status code: ${healthRes.status}`);
  }

  // 2. Load Plans
  const plansRes = await api('/plans');
  let annualPlan: any = null;
  let flexPlan: any = null;
  if (plansRes.status === 200 && Array.isArray(plansRes.data?.data) && plansRes.data.data.length >= 4) {
    annualPlan = plansRes.data.data.find((p: any) => p.durationDays >= 365);
    flexPlan = plansRes.data.data.find((p: any) => p.durationDays === 30);
    record('Load Membership Plans', 'GET /plans', 'PASS', `Found ${plansRes.data.data.length} active plans. Annual: ₹${annualPlan?.price}, Flex: ₹${flexPlan?.price}`);
  } else {
    record('Load Membership Plans', 'GET /plans', 'FAIL', `Expected >= 4 plans, received: ${plansRes.data?.data?.length}`);
  }

  // 3. Load Members
  const membersRes = await api('/members');
  let alice: any = null;
  let bob: any = null;
  let charlie: any = null;
  if (membersRes.status === 200 && Array.isArray(membersRes.data?.data)) {
    alice = membersRes.data.data.find((m: any) => m.emailAddress === 'alice.johnson@example.com');
    bob = membersRes.data.data.find((m: any) => m.emailAddress === 'bob.smith@example.com');
    charlie = membersRes.data.data.find((m: any) => m.emailAddress === 'charlie.davis@example.com');
    record('Load Members List', 'GET /members', 'PASS', `Members count: ${membersRes.data.data.length}. Alice: ${alice ? 'Present' : 'Missing'}`);
  } else {
    record('Load Members List', 'GET /members', 'FAIL', `Status: ${membersRes.status}`);
  }

  // 4. Member Details & Dossier Data
  if (alice) {
    const aliceRes = await api(`/members/${alice.membershipID}`);
    if (aliceRes.status === 200 && aliceRes.data?.data) {
      const d = aliceRes.data.data;
      record('Fetch Athlete Dossier', `GET /members/${alice.membershipID}`, 'PASS', `Name: ${d.fullName}, Status: ${d.membershipStatus}, Plan: ${d.memberships?.[0]?.plan?.name}`);
    } else {
      record('Fetch Athlete Dossier', `GET /members/${alice.membershipID}`, 'FAIL', `Status: ${aliceRes.status}`);
    }

    // 5. QR Code Endpoint
    const qrRes = await api(`/members/${alice.membershipID}/qrcode`);
    if (qrRes.status === 200 && qrRes.data?.data?.qrCodeDataURL) {
      record('Generate High-Res QR Pass', `GET /members/${alice.membershipID}/qrcode`, 'PASS', `QR Token: ${qrRes.data.data.qrCodeIdentifier}, Base64 Length: ${qrRes.data.data.qrCodeDataURL.length}`);
    } else {
      record('Generate High-Res QR Pass', `GET /members/${alice.membershipID}/qrcode`, 'FAIL', `Status: ${qrRes.status}`);
    }
  }

  // 6. Member Password Login
  const memberLoginRes = await api('/auth/member/login', {
    method: 'POST',
    body: {
      emailAddress: 'alice.johnson@example.com',
      password: 'Anytime@2026',
    },
  });
  if (memberLoginRes.status === 200 && memberLoginRes.data?.data?.token) {
    record('Member Password Login', 'POST /auth/member/login', 'PASS', `Auth token issued for Alice Johnson (Role: ${memberLoginRes.data.data.role})`);
  } else {
    record('Member Password Login', 'POST /auth/member/login', 'FAIL', `Status: ${memberLoginRes.status}, Message: ${memberLoginRes.data?.message}`);
  }

  // 7. Member 1-Click Google Sign-In
  const googleMemberRes = await api('/auth/google', {
    method: 'POST',
    body: {
      email: 'alice.johnson@example.com',
      name: 'Alice Johnson',
    },
  });
  if (googleMemberRes.status === 200 && googleMemberRes.data?.data?.token) {
    record('Google 1-Click Member Auth', 'POST /auth/google', 'PASS', `Direct Google token issued for ${googleMemberRes.data.data.member?.fullName}`);
  } else {
    record('Google 1-Click Member Auth', 'POST /auth/google', 'FAIL', `Status: ${googleMemberRes.status}`);
  }

  // 8. Owner Password Login
  const ownerLoginRes = await api('/auth/owner/login', {
    method: 'POST',
    body: {
      email: 'dynamitedhruvin@gmail.com',
      password: 'Anytime@2026',
    },
  });
  if (ownerLoginRes.status === 200 && ownerLoginRes.data?.data?.token) {
    record('Club Owner Password Login', 'POST /auth/owner/login', 'PASS', `Admin token issued for Club Owner (Role: ${ownerLoginRes.data.data.role})`);
  } else {
    record('Club Owner Password Login', 'POST /auth/owner/login', 'FAIL', `Status: ${ownerLoginRes.status}`);
  }

  // 9. Owner 1-Click Google Sign-In
  const googleOwnerRes = await api('/auth/google', {
    method: 'POST',
    body: {
      email: 'dynamitedhruvin@gmail.com',
      name: 'Dhruvin Owner',
    },
  });
  if (googleOwnerRes.status === 200 && googleOwnerRes.data?.data?.role === 'owner') {
    record('Google 1-Click Owner Auth', 'POST /auth/google', 'PASS', `Owner privilege granted for dynamitedhruvin@gmail.com`);
  } else {
    record('Google 1-Click Owner Auth', 'POST /auth/google', 'FAIL', `Status: ${googleOwnerRes.status}`);
  }

  // 10. New Registration with Successful Payment (Dynamic unique contact)
  const timestamp = Date.now();
  const testEmail = `athlete.${timestamp}@example.com`;
  const testPhone = `+9198${timestamp.toString().slice(-8)}`;
  const regSuccessRes = await api('/members/register', {
    method: 'POST',
    body: {
      fullName: 'David Beckham',
      emailAddress: testEmail,
      contactNumber: testPhone,
      emergencyContact: '+919876588888',
      dateOfBirth: '1990-05-02',
      planID: annualPlan.planID,
      paymentMethod: 'CreditCard',
      autoRenew: true,
    },
  });
  let newMemberId = '';
  if (regSuccessRes.status === 201 && regSuccessRes.data?.data?.membership?.status === 'Active') {
    newMemberId = regSuccessRes.data.data.member.membershipID;
    record('Athlete Registration (Success)', 'POST /members/register', 'PASS', `Member created: ${newMemberId}, Status: Active, QR: ${regSuccessRes.data.data.qrCodeIdentifier}`);
  } else {
    record('Athlete Registration (Success)', 'POST /members/register', 'FAIL', `Status: ${regSuccessRes.status}, Error: ${regSuccessRes.data?.message || JSON.stringify(regSuccessRes.data)}`);
  }

  // 11. Registration with Simulated Payment Failure (paymentMethod: 'FAIL' per Module A specs)
  const regFailRes = await api('/members/register', {
    method: 'POST',
    body: {
      fullName: 'Declined Athlete',
      emailAddress: `declined.${timestamp}@example.com`,
      contactNumber: `+9197${timestamp.toString().slice(-8)}`,
      emergencyContact: '+919876522222',
      dateOfBirth: '1995-01-01',
      planID: flexPlan.planID,
      paymentMethod: 'FAIL',
    },
  });
  if (regFailRes.status === 400 && regFailRes.data?.registrationIncomplete === true) {
    record('Registration Payment Failure Branch', 'POST /members/register', 'PASS', `Payment aborted as expected: "${regFailRes.data.failureReason}". No active membership created.`);
  } else {
    record('Registration Payment Failure Branch', 'POST /members/register', 'FAIL', `Expected 400 with registrationIncomplete, received status: ${regFailRes.status}`);
  }

  // 12. Turnstile Check-In with Optical QR Passcode (Alice Johnson AF-QR-ALICE001)
  const checkinRes = await api('/attendance/checkin', {
    method: 'POST',
    body: {
      membershipID: 'AF-QR-ALICE001',
      method: 'QR',
    },
  });
  if (checkinRes.status === 201 && checkinRes.data?.data?.attendance) {
    record('Optical QR Turnstile Check-In', 'POST /attendance/checkin', 'PASS', `Gate unlatched for Alice Johnson. Attendance ID: ${checkinRes.data.data.attendance.attendanceID}`);
  } else {
    record('Optical QR Turnstile Check-In', 'POST /attendance/checkin', 'FAIL', `Status: ${checkinRes.status}, Message: ${checkinRes.data?.message}`);
  }

  // 13. Anti-Passback Guard: Duplicate Check-In within 60 Minutes (returns 403 Forbidden)
  const duplicateRes = await api('/attendance/checkin', {
    method: 'POST',
    body: {
      membershipID: 'AF-QR-ALICE001',
      method: 'QR',
    },
  });
  if ((duplicateRes.status === 403 || duplicateRes.status === 400) && duplicateRes.data?.message?.includes('Duplicate check-in')) {
    record('60-Min Anti-Passback Guard', 'POST /attendance/checkin', 'PASS', `Duplicate check-in blocked correctly: "${duplicateRes.data.message}"`);
  } else {
    record('60-Min Anti-Passback Guard', 'POST /attendance/checkin', 'FAIL', `Expected 403/400 rejection, received: ${duplicateRes.status}`);
  }

  // 14. Expired Member Check-In Outside Grace Period (Charlie Davis returns 403 Forbidden)
  const expiredRes = await api('/attendance/checkin', {
    method: 'POST',
    body: {
      membershipID: 'AF-QR-CHARLIE003',
      method: 'QR',
    },
  });
  if ((expiredRes.status === 403 || expiredRes.status === 400) && expiredRes.data?.message?.includes('checkInDenied')) {
    record('Expired Member Access Denial', 'POST /attendance/checkin', 'PASS', `Expired entry rejected correctly: "${expiredRes.data.message}"`);
  } else {
    record('Expired Member Access Denial', 'POST /attendance/checkin', 'FAIL', `Expected 403/400, received: ${expiredRes.status}`);
  }

  // 15. Check-Out (supported via POST /attendance/checkout and POST /attendance/:id/checkout)
  if (checkinRes.data?.data?.attendance?.attendanceID) {
    const checkoutRes = await api('/attendance/checkout', {
      method: 'POST',
      body: {
        attendanceID: checkinRes.data.data.attendance.attendanceID,
      },
    });
    if (checkoutRes.status === 200 && checkoutRes.data?.data?.checkOutTimestamp) {
      record('Turnstile Exit Checkout', 'POST /attendance/checkout', 'PASS', `Checkout stamped: ${checkoutRes.data.data.checkOutTimestamp}`);
    } else {
      record('Turnstile Exit Checkout', 'POST /attendance/checkout', 'FAIL', `Status: ${checkoutRes.status}`);
    }
  }

  // 16. Load Classes & Real-Time Capacity
  const classesRes = await api('/classes');
  let openClass: any = null;
  let fullClass: any = null;
  if (classesRes.status === 200 && Array.isArray(classesRes.data?.data)) {
    openClass = classesRes.data.data.find((c: any) => c.currentBookings < c.capacity);
    fullClass = classesRes.data.data.find((c: any) => c.name.includes('Spinning') || c.currentBookings >= c.capacity);
    record('Fetch Fitness Studio Classes', 'GET /classes', 'PASS', `Classes active: ${classesRes.data.data.length}. Open: "${openClass?.name}", Full: "${fullClass?.name}"`);
  } else {
    record('Fetch Fitness Studio Classes', 'GET /classes', 'FAIL', `Status: ${classesRes.status}`);
  }

  // 17. Class Booking with Available Seat (Instant Booked via POST /bookings)
  if (bob && openClass) {
    const bookRes = await api('/bookings', {
      method: 'POST',
      body: {
        membershipID: bob.membershipID,
        classID: openClass.classID,
      },
    });
    const booking = bookRes.data?.data?.booking || bookRes.data?.data;
    if (bookRes.status === 201 && (booking?.status === 'Booked' || booking?.bookingID)) {
      record('Instant Seat Reservation', 'POST /bookings', 'PASS', `Seat confirmed for Bob Smith in "${openClass.name}". Booking ID: ${booking?.bookingID}`);
    } else {
      record('Instant Seat Reservation', 'POST /bookings', 'FAIL', `Status: ${bookRes.status}, Msg: ${bookRes.data?.message}`);
    }
  }

  // 18. Financial Ledger & Invoices
  const paymentsRes = await api('/payments');
  if (paymentsRes.status === 200 && Array.isArray(paymentsRes.data?.data) && paymentsRes.data.data.length > 0) {
    const p = paymentsRes.data.data[0];
    record('Financial Ledger Retrieval', 'GET /payments', 'PASS', `Found ${paymentsRes.data.data.length} transactions. Latest: ₹${p.amount} (${p.status})`);

    // 19. Tax Invoice Generation
    const invoiceRes = await api(`/payments/${p.paymentID}/invoice`);
    if (invoiceRes.status === 200 && invoiceRes.data?.data?.invoiceNumber) {
      const inv = invoiceRes.data.data;
      record('GST Tax Invoice Declaration', `GET /payments/${p.paymentID}/invoice`, 'PASS', `Invoice: ${inv.invoiceNumber}, GST Rate: ${inv.taxRate}, Tax: ₹${inv.taxAmount}, Total: ₹${inv.totalAmount}`);
    } else {
      record('GST Tax Invoice Declaration', `GET /payments/${p.paymentID}/invoice`, 'FAIL', `Status: ${invoiceRes.status}`);
    }

    // 20. Official Payment Receipt
    const receiptRes = await api(`/payments/${p.paymentID}/receipt`);
    if (receiptRes.status === 200 && receiptRes.data?.data?.receiptNumber) {
      record('Official Payment Receipt', `GET /payments/${p.paymentID}/receipt`, 'PASS', `Receipt: ${receiptRes.data.data.receiptNumber}`);
    } else {
      record('Official Payment Receipt', `GET /payments/${p.paymentID}/receipt`, 'FAIL', `Status: ${receiptRes.status}`);
    }
  } else {
    record('Financial Ledger Retrieval', 'GET /payments', 'FAIL', `Status: ${paymentsRes.status}`);
  }

  // 21. Notification Audit Log
  const notifRes = await api('/notifications');
  if (notifRes.status === 200 && Array.isArray(notifRes.data?.data)) {
    record('Notification Audit Dispatch', 'GET /notifications', 'PASS', `Dispatched alerts logged: ${notifRes.data.data.length}`);
  } else {
    record('Notification Audit Dispatch', 'GET /notifications', 'FAIL', `Status: ${notifRes.status}`);
  }

  console.log('===============================================================');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`AUDIT COMPLETE: ${passed} PASSED / ${failed} FAILED (TOTAL: ${results.length})`);
  console.log('===============================================================');

  await prisma.$disconnect();

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Fatal audit failure:', err.message);
  process.exit(1);
});
