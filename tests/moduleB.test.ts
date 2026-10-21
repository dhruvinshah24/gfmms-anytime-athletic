import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/db';
import { MembershipStatus, BookingStatus } from '@prisma/client';

describe('Module B: Attendance Check-in & Class Booking Management', () => {
  let activeMemberId: string;
  let expiredMemberId: string;
  let testPlanId: string;

  beforeAll(async () => {
    // Clean all test tables
    await prisma.attendance.deleteMany();
    await prisma.classBooking.deleteMany();
    await prisma.fitnessClass.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.member.deleteMany();
    await prisma.membershipPlan.deleteMany();

    // Create plan
    const plan = await prisma.membershipPlan.create({
      data: {
        name: 'Test Plan B',
        durationDays: 30,
        price: 3000.0,
        featureEntitlements: ['Floor', 'Classes'],
        activeStatus: true,
      },
    });
    testPlanId = plan.planID;

    // Create Active Member
    const activeMember = await prisma.member.create({
      data: {
        fullName: 'Active Member B',
        dateOfBirth: new Date('1990-01-01'),
        contactNumber: '+919999900001',
        emailAddress: 'active.member.b@test.com',
        emergencyContact: '+919999900002',
        qrCodeIdentifier: 'GFMMS-QR-ACTB',
        membershipStatus: MembershipStatus.Active,
      },
    });
    activeMemberId = activeMember.membershipID;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    await prisma.membership.create({
      data: {
        membershipID: activeMemberId,
        planID: testPlanId,
        startDate: new Date(),
        endDate: futureDate,
        status: MembershipStatus.Active,
      },
    });

    // Create Expired Member (past grace period > 3 days)
    const expiredMember = await prisma.member.create({
      data: {
        fullName: 'Expired Member B',
        dateOfBirth: new Date('1985-05-05'),
        contactNumber: '+919999900003',
        emailAddress: 'expired.member.b@test.com',
        emergencyContact: '+919999900004',
        membershipStatus: MembershipStatus.Expired,
      },
    });
    expiredMemberId = expiredMember.membershipID;

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 30);
    const pastStart = new Date();
    pastStart.setDate(pastStart.getDate() - 60);
    await prisma.membership.create({
      data: {
        membershipID: expiredMemberId,
        planID: testPlanId,
        startDate: pastStart,
        endDate: pastDate,
        status: MembershipStatus.Expired,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Scenario 1: Check-in with Active membership -> Attendance row created
  it('should allow check-in with Active membership -> Attendance row created', async () => {
    const res = await request(app)
      .post('/attendance/checkin')
      .send({ membershipID: activeMemberId, method: 'QR' })
      .expect(201);

    expect(res.body.status).toBe('success');
    expect(res.body.data.attendance).toBeDefined();
    expect(res.body.data.attendance.membershipID).toBe(activeMemberId);
    expect(res.body.data.attendance.checkInMethod).toBe('QR');

    // Verify row exists in DB
    const attendanceRow = await prisma.attendance.findUnique({
      where: { attendanceID: res.body.data.attendance.attendanceID },
    });
    expect(attendanceRow).not.toBeNull();
  });

  // Scenario 2: Check-in with Expired membership -> rejected, no Attendance row
  it('should reject check-in with Expired membership -> rejected, no Attendance row', async () => {
    const countBefore = await prisma.attendance.count();

    const res = await request(app)
      .post('/attendance/checkin')
      .send({ membershipID: expiredMemberId, method: 'Manual' })
      .expect(403);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toContain('checkInDenied – please renew');

    const countAfter = await prisma.attendance.count();
    expect(countAfter).toBe(countBefore);
  });

  // Scenario 3: Second check-in within 60 minutes -> rejected as duplicate
  it('should reject second check-in for the same member within 60 minutes as duplicate', async () => {
    const countBefore = await prisma.attendance.count();

    const res = await request(app)
      .post('/attendance/checkin')
      .send({ membershipID: activeMemberId, method: 'QR' })
      .expect(403);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toContain('Duplicate check-in: Member already checked in within the last 60 minutes');

    const countAfter = await prisma.attendance.count();
    expect(countAfter).toBe(countBefore);
  });

  // Scenario 4: Check-in within 15 minutes of a booked class -> booking auto-marked attended
  it('should check-in within 15 minutes of a booked class -> booking auto-marked attended and linked', async () => {
    // Create a new member for this test to avoid 60-minute duplicate check-in collision
    const classMember = await prisma.member.create({
      data: {
        fullName: 'Class Attendee',
        dateOfBirth: new Date('1994-03-10'),
        contactNumber: '+919888800001',
        emailAddress: 'class.attendee@test.com',
        emergencyContact: '+919888800002',
        membershipStatus: MembershipStatus.Active,
      },
    });

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    await prisma.membership.create({
      data: {
        membershipID: classMember.membershipID,
        planID: testPlanId,
        startDate: new Date(),
        endDate: futureDate,
        status: MembershipStatus.Active,
      },
    });

    // Create a class scheduled 10 minutes from now (within 15 minutes window)
    const classTime = new Date(Date.now() + 10 * 60 * 1000);
    const fitnessClass = await prisma.fitnessClass.create({
      data: {
        name: 'Yoga Express',
        category: 'Flexibility',
        trainerID: 'TR-YOGA-01',
        schedule: classTime,
        durationMinutes: 45,
        capacity: 10,
        currentBookings: 1,
      },
    });

    // Create booked reservation
    const booking = await prisma.classBooking.create({
      data: {
        membershipID: classMember.membershipID,
        classID: fitnessClass.classID,
        status: BookingStatus.Booked,
        bookingTimestamp: new Date(),
      },
    });

    // Perform check-in
    const res = await request(app)
      .post('/attendance/checkin')
      .send({ membershipID: classMember.membershipID, method: 'QR' })
      .expect(201);

    expect(res.body.status).toBe('success');
    expect(res.body.data.linkedClassBookingID).toBe(booking.bookingID);
    expect(res.body.data.autoAttendedBooking.status).toBe(BookingStatus.Attended);

    // Verify DB updated
    const updatedBooking = await prisma.classBooking.findUnique({
      where: { bookingID: booking.bookingID },
    });
    expect(updatedBooking?.status).toBe(BookingStatus.Attended);
  });

  // Scenario 5: Book a class with an open seat -> status Booked, confirmation notification
  it('should book a class with an open seat -> status Booked, confirmation notification', async () => {
    // Create another active member
    const member = await prisma.member.create({
      data: {
        fullName: 'Member With Open Seat',
        dateOfBirth: new Date('1991-07-07'),
        contactNumber: '+919777700001',
        emailAddress: 'openseat.member@test.com',
        emergencyContact: '+919777700002',
        membershipStatus: MembershipStatus.Active,
      },
    });

    // Create class with capacity = 1, currentBookings = 0
    const scheduledTime = new Date(Date.now() + 5 * 60 * 60 * 1000);
    const fitnessClass = await prisma.fitnessClass.create({
      data: {
        name: 'Pilates Core',
        category: 'Strength',
        trainerID: 'TR-PILATES-01',
        schedule: scheduledTime,
        durationMinutes: 60,
        capacity: 1,
        currentBookings: 0,
      },
    });

    const res = await request(app)
      .post(`/classes/${fitnessClass.classID}/book`)
      .send({ membershipID: member.membershipID })
      .expect(201);

    expect(res.body.status).toBe('success');
    expect(res.body.data.status).toBe(BookingStatus.Booked);

    // Verify class currentBookings incremented to 1
    const updatedClass = await prisma.fitnessClass.findUnique({
      where: { classID: fitnessClass.classID },
    });
    expect(updatedClass?.currentBookings).toBe(1);

    // Verify BookingConfirmation notification created
    const notif = await prisma.notification.findFirst({
      where: {
        recipientID: member.membershipID,
        category: 'BookingConfirmation',
      },
    });
    expect(notif).not.toBeNull();
    expect(notif?.content).toContain('Pilates Core');
  });

  // Scenario 6: Book a class that's full -> status Waitlisted, waitlist notification
  it("should book a class that's full -> status Waitlisted, waitlist notification", async () => {
    // Create class that is already full (capacity: 1, currentBookings: 1)
    const scheduledTime = new Date(Date.now() + 5 * 60 * 60 * 1000);
    const fullClass = await prisma.fitnessClass.create({
      data: {
        name: 'Full Crossfit Session',
        category: 'Strength',
        trainerID: 'TR-CF-01',
        schedule: scheduledTime,
        durationMinutes: 60,
        capacity: 1,
        currentBookings: 1,
      },
    });

    // Active member requesting booking
    const waitlistMember = await prisma.member.create({
      data: {
        fullName: 'Waitlist Candidate',
        dateOfBirth: new Date('1993-09-09'),
        contactNumber: '+919666600001',
        emailAddress: 'waitlist.candidate@test.com',
        emergencyContact: '+919666600002',
        membershipStatus: MembershipStatus.Active,
      },
    });

    const res = await request(app)
      .post(`/classes/${fullClass.classID}/book`)
      .send({ membershipID: waitlistMember.membershipID })
      .expect(201);

    expect(res.body.status).toBe('success');
    expect(res.body.data.status).toBe(BookingStatus.Waitlisted);

    // Verify class capacity and bookings did not change beyond capacity
    const checkedClass = await prisma.fitnessClass.findUnique({
      where: { classID: fullClass.classID },
    });
    expect(checkedClass?.currentBookings).toBe(1);

    // Verify WaitlistConfirmation notification created
    const notif = await prisma.notification.findFirst({
      where: {
        recipientID: waitlistMember.membershipID,
        category: 'WaitlistConfirmation',
      },
    });
    expect(notif).not.toBeNull();
    expect(notif?.content).toContain('added to the waitlist');
  });

  // Scenario 7: Cancel a booking >2 hours before class -> cancelled, next waitlisted member promoted to Booked
  it('should cancel a booking >2 hours before class -> cancelled, next waitlisted member promoted to Booked', async () => {
    // Schedule class 4 hours from now (> 2 hours)
    const scheduledTime = new Date(Date.now() + 4 * 60 * 60 * 1000);
    const promoClass = await prisma.fitnessClass.create({
      data: {
        name: 'Kickboxing Flow',
        category: 'Cardio',
        trainerID: 'TR-KB-01',
        schedule: scheduledTime,
        durationMinutes: 50,
        capacity: 1,
        currentBookings: 1,
      },
    });

    // Member 1 holds the Booked seat
    const booker = await prisma.member.create({
      data: {
        fullName: 'Original Booker',
        dateOfBirth: new Date('1992-02-02'),
        contactNumber: '+919555500001',
        emailAddress: 'original.booker@test.com',
        emergencyContact: '+919555500002',
        membershipStatus: MembershipStatus.Active,
      },
    });

    const bookedReservation = await prisma.classBooking.create({
      data: {
        membershipID: booker.membershipID,
        classID: promoClass.classID,
        status: BookingStatus.Booked,
        bookingTimestamp: new Date(Date.now() - 3600000),
      },
    });

    // Member 2 is on the Waitlist
    const waitlistedMember = await prisma.member.create({
      data: {
        fullName: 'Waitlisted Guy',
        dateOfBirth: new Date('1990-12-12'),
        contactNumber: '+919555500010',
        emailAddress: 'waitlisted.guy@test.com',
        emergencyContact: '+919555500011',
        membershipStatus: MembershipStatus.Active,
      },
    });

    const waitlistedReservation = await prisma.classBooking.create({
      data: {
        membershipID: waitlistedMember.membershipID,
        classID: promoClass.classID,
        status: BookingStatus.Waitlisted,
        bookingTimestamp: new Date(Date.now() - 1800000),
      },
    });

    // Cancel booking > 2 hours prior
    const res = await request(app)
      .post(`/bookings/${bookedReservation.bookingID}/cancel`)
      .expect(200);

    expect(res.body.status).toBe('success');
    expect(res.body.data.cancelledBooking.status).toBe(BookingStatus.Cancelled);
    expect(res.body.data.promotedBooking).toBeDefined();
    expect(res.body.data.promotedBooking.bookingID).toBe(waitlistedReservation.bookingID);
    expect(res.body.data.promotedBooking.status).toBe(BookingStatus.Booked);

    // Verify in database that waitlisted reservation is now Booked
    const promotedDb = await prisma.classBooking.findUnique({
      where: { bookingID: waitlistedReservation.bookingID },
    });
    expect(promotedDb?.status).toBe(BookingStatus.Booked);

    // Verify promotion notification sent to waitlisted member
    const notif = await prisma.notification.findFirst({
      where: {
        recipientID: waitlistedMember.membershipID,
        category: 'WaitlistConfirmation',
      },
    });
    expect(notif).not.toBeNull();
    expect(notif?.content).toContain('promoted to Booked');
  });

  // Scenario 8: Cancel a booking <2 hours before class -> rejected
  it('should reject cancelling a booking <2 hours before class', async () => {
    // Schedule class 1 hour from now (< 2 hours)
    const scheduledTime = new Date(Date.now() + 1 * 60 * 60 * 1000);
    const urgentClass = await prisma.fitnessClass.create({
      data: {
        name: 'Urgent HIIT Session',
        category: 'HIIT',
        trainerID: 'TR-HIIT-01',
        schedule: scheduledTime,
        durationMinutes: 45,
        capacity: 5,
        currentBookings: 1,
      },
    });

    const urgentMember = await prisma.member.create({
      data: {
        fullName: 'Urgent Member',
        dateOfBirth: new Date('1997-04-04'),
        contactNumber: '+919444400001',
        emailAddress: 'urgent.member@test.com',
        emergencyContact: '+919444400002',
        membershipStatus: MembershipStatus.Active,
      },
    });

    const urgentBooking = await prisma.classBooking.create({
      data: {
        membershipID: urgentMember.membershipID,
        classID: urgentClass.classID,
        status: BookingStatus.Booked,
        bookingTimestamp: new Date(),
      },
    });

    const res = await request(app)
      .post(`/bookings/${urgentBooking.bookingID}/cancel`)
      .expect(400);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toContain('Cancellation rejected');
    expect(res.body.message).toContain('more than 2 hours before the class start time');

    // Confirm status was NOT changed in DB
    const bookingDb = await prisma.classBooking.findUnique({
      where: { bookingID: urgentBooking.bookingID },
    });
    expect(bookingDb?.status).toBe(BookingStatus.Booked);
  });
});
