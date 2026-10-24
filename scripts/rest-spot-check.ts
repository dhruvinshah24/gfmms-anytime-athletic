/**
 * REST Spot-Check Script — validates live GFMMS endpoints
 * All routes wrap in { status, message, data }
 */
import * as http from 'http';

const BASE_PORT = 3000;
let pass = 0;
let fail = 0;

function ok(label: string, val: boolean, detail?: string) {
  if (val) { console.log(`[PASS] ${label}${detail ? ' | ' + detail : ''}`); pass++; }
  else      { console.log(`[FAIL] ${label}${detail ? ' | ' + detail : ''}`); fail++; }
}

function request(method: string, path: string, body?: object): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : undefined;
    const opts: http.RequestOptions = {
      host: 'localhost', port: BASE_PORT, path, method,
      headers: { 'Content-Type': 'application/json', ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}) },
    };
    const r = http.request(opts, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode || 0, data: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode || 0, data: raw }); }
      });
    });
    r.on('error', reject);
    if (bodyStr) r.write(bodyStr);
    r.end();
  });
}

async function main() {
  console.log('\n========== GFMMS REST Endpoint Spot-Check ==========\n');
  const ts = Date.now();

  // GET /health
  const health = await request('GET', '/health');
  ok('GET /health -> 200', health.status === 200);
  ok('GET /health -> status:ok', health.data?.status === 'ok');

  // GET /plans — response shape: { status, data: [{ planID, ... }] }
  const plansRes = await request('GET', '/plans');
  ok('GET /plans -> 200', plansRes.status === 200);
  ok('GET /plans -> data is array', Array.isArray(plansRes.data?.data));
  const planID: string = plansRes.data?.data[0]?.planID;
  ok('GET /plans -> has planID', !!planID, `planID=${planID}`);

  // GET /members — response shape: { status, data: [...] }
  const membersRes = await request('GET', '/members');
  ok('GET /members -> 200', membersRes.status === 200);
  ok('GET /members -> data is array', Array.isArray(membersRes.data?.data));

  // GET /classes — response shape: { status, data: [...] }
  const classesRes = await request('GET', '/classes');
  ok('GET /classes -> 200', classesRes.status === 200);
  ok('GET /classes -> data is array', Array.isArray(classesRes.data?.data));

  // GET /payments
  const paymentsRes = await request('GET', '/payments');
  ok('GET /payments -> 200', paymentsRes.status === 200);

  // POST /members/register — success
  // response shape: { status, message, data: { member: {...}, membership: {...}, payment: {...} } }
  const email = `spotcheck_${ts}@gfmms.com`;
  const phone = `9${String(ts).slice(-9)}`;
  const reg = await request('POST', '/members/register', {
    fullName: 'REST Check User', dateOfBirth: '1992-03-20',
    contactNumber: phone, emailAddress: email,
    emergencyContact: `8${String(ts).slice(-9)}`, planID, paymentMethod: 'CreditCard',
  });
  ok('POST /members/register -> 201', reg.status === 201, `got ${reg.status}`);
  const member = reg.data?.data?.member;
  const payment = reg.data?.data?.payment;
  ok('POST /members/register -> membershipStatus Active', member?.membershipStatus === 'Active');
  ok('POST /members/register -> qrCodeIdentifier generated', !!member?.qrCodeIdentifier);
  ok('POST /members/register -> payment status Success', payment?.status === 'Success');
  const memberID: string = member?.membershipID;
  const paymentID: string = payment?.paymentID;

  // POST /members/register — failed payment
  const ts2 = ts + 1;
  const regFail = await request('POST', '/members/register', {
    fullName: 'Fail Pay User', dateOfBirth: '1985-07-01',
    contactNumber: `9${String(ts2).slice(-9)}`, emailAddress: `failpay_${ts2}@gfmms.com`,
    emergencyContact: `8${String(ts2).slice(-9)}`, planID, paymentMethod: 'FAIL',
  });
  ok('POST /members/register FAIL -> non-201', regFail.status !== 201, `got ${regFail.status}`);
  ok('POST /members/register FAIL -> no Active membership', regFail.data?.data?.member?.membershipStatus !== 'Active');

  // POST /members/:id/login — response shape: { data: { authenticated, member } }
  const login = await request('POST', `/members/${memberID}/login`, { membershipID: memberID });
  ok('POST /members/:id/login -> 200', login.status === 200, `got ${login.status}`);
  ok('POST /members/:id/login -> authenticated:true', login.data?.data?.authenticated === true);

  // POST /attendance/checkin — response shape: { data: { success, attendance: { attendanceID }, ... } }
  const checkin = await request('POST', '/attendance/checkin', { membershipID: memberID, checkInMethod: 'QR' });
  ok('POST /attendance/checkin -> 201', checkin.status === 201, `got ${checkin.status}`);
  const attendRecord = checkin.data?.data?.attendance;
  ok('POST /attendance/checkin -> attendanceID present', !!attendRecord?.attendanceID);
  const attendanceID: string = attendRecord?.attendanceID;

  // POST /attendance/checkin — duplicate (within 60 min) -> 403
  const dupCheckin = await request('POST', '/attendance/checkin', { membershipID: memberID, checkInMethod: 'QR' });
  ok('POST /attendance/checkin duplicate -> 403', dupCheckin.status === 403, `got ${dupCheckin.status}`);

  // POST /attendance/:attendanceID/checkout — response shape: { data: { checkOutTimestamp, ... } }
  const checkout = await request('POST', `/attendance/${attendanceID}/checkout`);
  ok('POST /attendance/:id/checkout -> 200', checkout.status === 200, `got ${checkout.status}`);
  ok('POST /attendance/:id/checkout -> checkOutTimestamp set', !!checkout.data?.data?.checkOutTimestamp);

  // POST /classes (create) — response shape: { data: { classID, ... } }
  const futureSchedule = new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString();
  const cls = await request('POST', '/classes', {
    name: `REST Spot Yoga ${ts}`, category: 'Yoga', trainerID: 'trainer-rest-01',
    schedule: futureSchedule, durationMinutes: 60, capacity: 5, isRecurring: false,
  });
  ok('POST /classes -> 201', cls.status === 201, `got ${cls.status}`);
  const classData = cls.data?.data;
  ok('POST /classes -> classID present', !!classData?.classID);
  const classID: string = classData?.classID;

  // POST /classes/:classId/book — response shape: { data: { booking: { bookingID, status }, status } }
  const book = await request('POST', `/classes/${classID}/book`, { membershipID: memberID });
  ok('POST /classes/:classId/book -> 201', book.status === 201, `got ${book.status}`);
  const bookData = book.data?.data?.booking;
  ok('POST /classes/:classId/book -> status Booked', bookData?.status === 'Booked');
  const bookingID: string = bookData?.bookingID;

  // POST /bookings/:bookingId/cancel (>2h before class — 5h away)
  // response shape: { data: { cancelledBooking: { status }, ... } }
  const cancel = await request('POST', `/bookings/${bookingID}/cancel`);
  ok('POST /bookings/:bookingId/cancel -> 200', cancel.status === 200, `got ${cancel.status}`);
  ok('POST /bookings/:bookingId/cancel -> cancelledBooking.status=Cancelled',
    cancel.data?.data?.cancelledBooking?.status === 'Cancelled');

  // GET /classes/:classId/waitlist — response shape: { data: [...] }
  const waitlist = await request('GET', `/classes/${classID}/waitlist`);
  ok('GET /classes/:classId/waitlist -> 200', waitlist.status === 200, `got ${waitlist.status}`);
  ok('GET /classes/:classId/waitlist -> array', Array.isArray(waitlist.data?.data));

  // GET /payments/:id/receipt — response shape: { data: { receiptNumber, ... } }
  const receipt = await request('GET', `/payments/${paymentID}/receipt`);
  ok('GET /payments/:id/receipt -> 200', receipt.status === 200, `got ${receipt.status}`);
  ok('GET /payments/:id/receipt -> has receiptNumber', !!receipt.data?.data?.receiptNumber);

  // GET /payments/:id/invoice — response shape: { data: { invoiceNumber, ... } }
  const invoice = await request('GET', `/payments/${paymentID}/invoice`);
  ok('GET /payments/:id/invoice -> 200', invoice.status === 200, `got ${invoice.status}`);
  ok('GET /payments/:id/invoice -> has invoiceNumber', !!invoice.data?.data?.invoiceNumber);

  console.log(`\n-------------------------------------------------------------`);
  console.log(` REST SPOT-CHECK: ${pass} PASSED | ${fail} FAILED`);
  console.log(`-------------------------------------------------------------\n`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('[FATAL]', err.message);
  process.exit(1);
});
