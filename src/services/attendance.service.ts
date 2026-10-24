import prisma from '../config/db';
import {
  Attendance,
  BookingStatus,
  CheckInMethod,
  MembershipStatus,
} from '@prisma/client';
import { membershipService } from './membership.service';
import { EmailService } from './email.service';

export interface CheckInDTO {
  membershipID: string;
  method: CheckInMethod | string;
}

export class AttendanceService {
  /**
   * Attendance.checkGracePeriod()
   * Delegated verification of membership validity / grace period.
   */
  async checkGracePeriod(membershipID: string) {
    return membershipService.checkGracePeriod(membershipID);
  }

  /**
   * Attendance.verifyMemberStatus()
   * Verifies member and membership status. Accepts membershipID or qrCodeIdentifier.
   */
  async verifyMemberStatus(membershipID: string) {
    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { membershipID },
          { qrCodeIdentifier: membershipID },
        ],
      },
    });

    if (!member) {
      return {
        statusActive: false,
        reason: 'Member not found',
      };
    }

    // Direct Active check or 3-day grace period check
    const graceCheck = await this.checkGracePeriod(member.membershipID);
    if (!graceCheck.isValid) {
      return {
        statusActive: false,
        reason: 'checkInDenied – please renew',
        member,
      };
    }

    return {
      statusActive: true,
      inGracePeriod: graceCheck.inGracePeriod,
      member,
      membership: graceCheck.membership,
    };
  }

  /**
   * Attendance.preventDuplicate()
   * Rejects second check-in for the same member within a 60-minute window.
   */
  async preventDuplicate(membershipID: string, windowMinutes = 60) {
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

    const recentAttendance = await prisma.attendance.findFirst({
      where: {
        membershipID,
        checkInTimestamp: {
          gte: windowStart,
        },
      },
      orderBy: { checkInTimestamp: 'desc' },
    });

    if (recentAttendance) {
      return {
        isDuplicate: true,
        lastCheckIn: recentAttendance.checkInTimestamp,
      };
    }

    return {
      isDuplicate: false,
    };
  }

  /**
   * Attendance.recordCheckIn() / Member.checkIn()
   * Core check-in flow matching sequence diagram:
   * 1. checkGracePeriod() + verifyMemberStatus()
   * 2. preventDuplicate() (60-minute window)
   * 3. [opt] Look for ClassBooking within 15 minutes of class start
   * 4. Create Attendance row (link ClassBooking if found and mark Attended)
   */
  async recordCheckIn(dto: CheckInDTO) {
    const checkInMethod: CheckInMethod =
      dto.method?.toUpperCase() === 'QR' ? CheckInMethod.QR : CheckInMethod.Manual;

    // 1. Verify Member Status & Grace Period
    const statusCheck = await this.verifyMemberStatus(dto.membershipID);
    if (!statusCheck.statusActive) {
      throw new Error('checkInDenied – please renew');
    }

    const resolvedMemberID = statusCheck.member?.membershipID || dto.membershipID;

    // 2. Prevent Duplicate Check-In (60 minutes)
    const duplicateCheck = await this.preventDuplicate(resolvedMemberID, 60);
    if (duplicateCheck.isDuplicate) {
      throw new Error(
        'Duplicate check-in: Member already checked in within the last 60 minutes'
      );
    }

    const now = new Date();
    let linkedClassBookingID: string | null = null;
    let autoAttendedBooking = null;

    // 3. [opt] Check if member has a ClassBooking starting within 15 minutes of this check-in
    // Look for Booked class where schedule is within [-15m, +15m] of checkInTimestamp
    const fifteenMinutesInMs = 15 * 60 * 1000;
    const windowStart = new Date(now.getTime() - fifteenMinutesInMs);
    const windowEnd = new Date(now.getTime() + fifteenMinutesInMs);

    const upcomingBooking = await prisma.classBooking.findFirst({
      where: {
        membershipID: resolvedMemberID,
        status: BookingStatus.Booked,
        fitnessClass: {
          schedule: {
            gte: windowStart,
            lte: windowEnd,
          },
        },
      },
      include: {
        fitnessClass: true,
      },
    });

    if (upcomingBooking) {
      linkedClassBookingID = upcomingBooking.bookingID;

      // Mark the booking as auto-attended
      autoAttendedBooking = await prisma.classBooking.update({
        where: { bookingID: upcomingBooking.bookingID },
        data: { status: BookingStatus.Attended },
      });
    }

    // 4. Create Attendance row
    const attendance = await prisma.attendance.create({
      data: {
        membershipID: resolvedMemberID,
        checkInTimestamp: now,
        checkInMethod: checkInMethod,
        linkedClassBookingID: linkedClassBookingID,
      },
    });

    // Notify Owner via Email asynchronously
    EmailService.sendCheckinAlertToOwner({
      memberName: statusCheck.member?.fullName || 'Gym Member',
      memberID: resolvedMemberID,
      checkInTime: now,
      method: checkInMethod,
      linkedClass: upcomingBooking?.fitnessClass?.name || null,
    }).catch((err) => console.error('[EmailService] Owner check-in alert error:', err.message));

    return {
      success: true,
      attendance,
      linkedClassBookingID,
      autoAttendedBooking,
      message: linkedClassBookingID
        ? 'Check-in successful and class booking marked as attended'
        : 'Check-in successful',
    };
  }

  /**
   * Attendance.recordCheckOut()
   * Marks checkout timestamp on the active attendance record.
   */
  async recordCheckOut(attendanceID: string) {
    const attendance = await prisma.attendance.findUnique({
      where: { attendanceID },
    });

    if (!attendance) {
      throw new Error(`Attendance record ${attendanceID} not found`);
    }

    const updated = await prisma.attendance.update({
      where: { attendanceID },
      data: { checkOutTimestamp: new Date() },
    });

    return updated;
  }

  /**
   * Helper: get attendance history for member
   */
  async getMemberAttendance(membershipID: string) {
    return prisma.attendance.findMany({
      where: { membershipID },
      orderBy: { checkInTimestamp: 'desc' },
      include: {
        linkedClassBooking: {
          include: { fitnessClass: true },
        },
      },
    });
  }
}

export const attendanceService = new AttendanceService();
