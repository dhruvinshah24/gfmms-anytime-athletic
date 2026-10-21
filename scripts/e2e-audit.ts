import prisma from '../src/config/db';
import { memberService } from '../src/services/member.service';
import { membershipService } from '../src/services/membership.service';
import { membershipPlanService } from '../src/services/membershipPlan.service';
import { paymentService } from '../src/services/payment.service';
import { notificationService } from '../src/services/notification.service';
import { attendanceService } from '../src/services/attendance.service';
import { fitnessClassService } from '../src/services/fitnessClass.service';
import { classBookingService } from '../src/services/classBooking.service';
import {
  BookingStatus,
  MembershipStatus,
  NotificationChannel,
  PaymentPurpose,
} from '@prisma/client';

async function runAudit() {
  console.log('\n=============================================================');
  console.log('       GFMMS COMPREHENSIVE BACKEND SYSTEM AUDIT');
  console.log('=============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: any) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`, detail || '');
      failed++;
    }
  }

  try {
    // 1. Audit Database Connectivity
    const dbCheck = await prisma.$queryRaw`SELECT 1 as result`;
    assert(Array.isArray(dbCheck) && (dbCheck[0] as any).result === 1, 'Database connectivity (PostgreSQL 17)');

    // 2. Audit Membership Plan Management
    const testPlan = await membershipPlanService.createPlan({
      name: 'Audit Pro Plan',
      durationDays: 90,
      price: 5000,
      featureEntitlements: ['Sauna', 'Gym Floor', 'Personal Training Discount'],
      activeStatus: true,
    });
    assert(testPlan.name === 'Audit Pro Plan', 'MembershipPlan.create()');

    const updatedPlan = await membershipPlanService.updatePrice(testPlan.planID, 5500);
    assert(Number(updatedPlan.price) === 5500, 'MembershipPlan.updatePrice()');

    const deactPlan = await membershipPlanService.deactivate(testPlan.planID);
    assert(deactPlan.activeStatus === false, 'MembershipPlan.deactivate()');

    const actPlan = await membershipPlanService.activate(testPlan.planID);
    assert(actPlan.activeStatus === true, 'MembershipPlan.activate()');

    // 3. Audit Member Registration Flow (Success)
    const timestamp = Date.now();
    const regResult = await memberService.register({
      fullName: 'Audit User Alpha',
      dateOfBirth: '1995-03-15',
      contactNumber: `+9199000${timestamp.toString().slice(-5)}`,
      emailAddress: `audit.user.${timestamp}@test.com`,
      emergencyContact: '+919900000000',
      planID: actPlan.planID,
      paymentMethod: 'UPI',
    });
    assert(regResult.success === true, 'Member.register() with payment success');
    assert(regResult.member?.membershipStatus === MembershipStatus.Active, 'Member status set to Active');
    assert(!!regResult.qrCodeIdentifier && regResult.qrCodeIdentifier.startsWith('GFMMS-QR-'), 'QR code identifier generated');
    assert(regResult.payment?.status === 'Success', 'Payment status set to Success');

    // Check Welcome notification was sent
    const welcomeNotifs = await prisma.notification.findMany({
      where: { recipientID: regResult.member!.membershipID, category: 'WelcomeEmail' },
    });
    assert(welcomeNotifs.length > 0, 'Notification.send() WelcomeEmail generated');

    // 4. Audit Member Registration Flow (Payment Failure alternate branch)
    const failRegResult = await memberService.register({
      fullName: 'Audit User Fail',
      dateOfBirth: '1996-04-16',
      contactNumber: `+9199100${timestamp.toString().slice(-5)}`,
      emailAddress: `audit.fail.${timestamp}@test.com`,
      emergencyContact: '+919900000000',
      planID: actPlan.planID,
      paymentMethod: 'FAIL',
    });
    assert(failRegResult.success === false, 'Member.register() handles payment failure');
    assert(failRegResult.registrationIncomplete === true, 'Registration flagged as incomplete');
    assert(failRegResult.member?.membershipStatus === MembershipStatus.Cancelled, 'Membership marked Cancelled, not Active');

    // 5. Audit Member Login
    const loginResult = await memberService.login(regResult.member!.membershipID, {
      emailAddress: `audit.user.${timestamp}@test.com`,
    });
    assert(loginResult.authenticated === true, 'Member.login() authentication');

    // 6. Audit Payment Lifecycle (Manual payment, Receipt, Invoice, Refund)
    const manualPayment = await paymentService.recordManual({
      membershipID: regResult.member!.membershipID,
      amount: 2000,
      paymentMethod: 'Cash',
      paymentPurpose: PaymentPurpose.Renewal,
    });
    assert(manualPayment.paymentID !== undefined, 'Payment.recordManual()');

    const receipt = await paymentService.generateReceipt(manualPayment.paymentID);
    assert(receipt.receiptNumber.startsWith('REC-'), 'Payment.generateReceipt()');

    const invoice = await paymentService.generateInvoice(manualPayment.paymentID);
    assert(invoice.taxRate === '18% GST' && invoice.totalAmount === 2000, 'Payment.generateInvoice()');

    const refund = await paymentService.refund(manualPayment.paymentID, 'CUSTOMER_REQUEST');
    assert(Number(refund.amount) === -2000, 'Payment.refund() processed');

    // 7. Audit Membership Lifecycle (Extend, Expire, Cancel, Grace Period)
    const memberships = await prisma.membership.findMany({
      where: { membershipID: regResult.member!.membershipID },
    });
    const activeMembership = memberships[0];

    const extended = await membershipService.extend(activeMembership.membershipRecordID, 30);
    assert(extended.status === MembershipStatus.Active, 'Membership.extend()');

    const graceCheck = await membershipService.checkGracePeriod(regResult.member!.membershipID);
    assert(graceCheck.isValid === true, 'Membership.checkGracePeriod() for active member');

    // 8. Audit Attendance Check-in
    const checkInResult = await attendanceService.recordCheckIn({
      membershipID: regResult.member!.membershipID,
      method: 'QR',
    });
    assert(checkInResult.success === true, 'Attendance.recordCheckIn() / Member.checkIn()');

    // Duplicate check-in rejection
    let duplicateRejected = false;
    try {
      await attendanceService.recordCheckIn({
        membershipID: regResult.member!.membershipID,
        method: 'QR',
      });
    } catch (e: any) {
      duplicateRejected = e.message.includes('Duplicate check-in');
    }
    assert(duplicateRejected, 'Attendance.preventDuplicate() blocks check-in within 60 minutes');

    // Check-out
    const checkOut = await attendanceService.recordCheckOut(checkInResult.attendance.attendanceID);
    assert(checkOut.checkOutTimestamp !== null, 'Attendance.recordCheckOut()');

    // 9. Audit Fitness Class & Booking Flow (Seat Available vs Class Full vs Promote)
    const fitnessClass = await fitnessClassService.create({
      name: 'Audit Functional Training',
      category: 'Strength',
      trainerID: 'TR-AUDIT-01',
      schedule: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours in future
      durationMinutes: 60,
      capacity: 1, // Only 1 seat available
    });
    assert(fitnessClass.capacity === 1 && fitnessClass.currentBookings === 0, 'FitnessClass.create()');

    // Member 1 books -> gets seat Booked
    const booking1 = await classBookingService.confirm({
      membershipID: regResult.member!.membershipID,
      classID: fitnessClass.classID,
    });
    assert(booking1.status === BookingStatus.Booked, 'ClassBooking.confirm() with open seat -> Booked');

    // Create another active member to test waitlist
    const regMember2 = await memberService.register({
      fullName: 'Audit User Beta',
      dateOfBirth: '1993-07-21',
      contactNumber: `+9199200${timestamp.toString().slice(-5)}`,
      emailAddress: `audit.beta.${timestamp}@test.com`,
      emergencyContact: '+919900000000',
      planID: actPlan.planID,
      paymentMethod: 'CreditCard',
    });

    // Member 2 books the same full class -> gets Waitlisted
    const booking2 = await classBookingService.confirm({
      membershipID: regMember2.member!.membershipID,
      classID: fitnessClass.classID,
    });
    assert(booking2.status === BookingStatus.Waitlisted, 'ClassBooking.confirm() when full -> Waitlisted');

    // Cancel Member 1 booking (>2 hours before class) -> Member 2 promoted to Booked
    const cancelResult = await classBookingService.cancel(booking1.booking.bookingID);
    assert(cancelResult.cancelledBooking.status === BookingStatus.Cancelled, 'ClassBooking.cancel() >2h before class');
    assert(cancelResult.promotedBooking?.bookingID === booking2.booking.bookingID, 'ClassBooking.promoteFromWaitlist() promotes candidate');
    assert(cancelResult.promotedBooking?.status === BookingStatus.Booked, 'Promoted booking updated to Booked status');

    // Test rejection of cancellation < 2 hours
    const urgentClass = await fitnessClassService.create({
      name: 'Urgent Class Audit',
      category: 'Core',
      trainerID: 'TR-AUDIT-02',
      schedule: new Date(Date.now() + 60 * 60 * 1000), // 1 hour in future (< 2h)
      durationMinutes: 30,
      capacity: 5,
    });
    const urgentBooking = await classBookingService.confirm({
      membershipID: regResult.member!.membershipID,
      classID: urgentClass.classID,
    });
    let urgentCancelRejected = false;
    try {
      await classBookingService.cancel(urgentBooking.booking.bookingID);
    } catch (e: any) {
      urgentCancelRejected = e.message.includes('more than 2 hours');
    }
    assert(urgentCancelRejected, 'ClassBooking.cancel() enforces > 2 hours cancellation rule');

    // 10. Audit 30-minute Auto-expiry logic
    const oldDate = new Date(Date.now() - 40 * 60 * 1000); // 40 minutes ago
    const pendingStaleMember = await prisma.member.create({
      data: {
        fullName: 'Stale Applicant',
        dateOfBirth: new Date('1990-01-01'),
        contactNumber: `+9199300${timestamp.toString().slice(-5)}`,
        emailAddress: `stale.${timestamp}@test.com`,
        emergencyContact: '+919900000000',
        membershipStatus: MembershipStatus.Pending,
        joinDate: oldDate,
      },
    });
    await prisma.membership.create({
      data: {
        membershipID: pendingStaleMember.membershipID,
        planID: actPlan.planID,
        startDate: oldDate,
        endDate: oldDate,
        status: MembershipStatus.Pending,
      },
    });

    const expiredCount = await membershipService.expirePendingRegistrations(30);
    assert(expiredCount >= 1, 'membershipService.expirePendingRegistrations(30) expired stale pending applicant');

    const staleAfter = await prisma.member.findUnique({
      where: { membershipID: pendingStaleMember.membershipID },
    });
    assert(staleAfter?.membershipStatus === MembershipStatus.Cancelled, 'Stale member transitioned to Cancelled');

    // Clean up audit test records
    await prisma.attendance.deleteMany({
      where: {
        membershipID: {
          in: [
            regResult.member!.membershipID,
            regMember2.member!.membershipID,
            pendingStaleMember.membershipID,
            failRegResult.member ? failRegResult.member.membershipID : '',
          ],
        },
      },
    });
    await prisma.classBooking.deleteMany({
      where: { classID: { in: [fitnessClass.classID, urgentClass.classID] } },
    });
    await prisma.fitnessClass.deleteMany({
      where: { classID: { in: [fitnessClass.classID, urgentClass.classID] } },
    });
    await prisma.notification.deleteMany({
      where: {
        recipientID: {
          in: [
            regResult.member!.membershipID,
            regMember2.member!.membershipID,
            failRegResult.member ? failRegResult.member.membershipID : '',
          ],
        },
      },
    });
    await prisma.payment.deleteMany({
      where: {
        membershipID: {
          in: [
            regResult.member!.membershipID,
            regMember2.member!.membershipID,
            failRegResult.member ? failRegResult.member.membershipID : '',
          ],
        },
      },
    });
    await prisma.membership.deleteMany({ where: { planID: testPlan.planID } });
    await prisma.member.deleteMany({
      where: {
        membershipID: {
          in: [
            regResult.member!.membershipID,
            regMember2.member!.membershipID,
            pendingStaleMember.membershipID,
            failRegResult.member ? failRegResult.member.membershipID : '',
          ],
        },
      },
    });
    await prisma.membershipPlan.delete({ where: { planID: testPlan.planID } });

    console.log('\n-------------------------------------------------------------');
    console.log(` AUDIT SUMMARY: ${passed} PASSED | ${failed} FAILED`);
    console.log('-------------------------------------------------------------\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error('Audit execution error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runAudit();
