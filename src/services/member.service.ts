import prisma from '../config/db';
import {
  MembershipStatus,
  PaymentPurpose,
  PaymentStatus,
  NotificationChannel,
} from '@prisma/client';
import { membershipPlanService } from './membershipPlan.service';
import { membershipService } from './membership.service';
import { paymentService } from './payment.service';
import { notificationService } from './notification.service';
import { attendanceService } from './attendance.service';
import { classBookingService } from './classBooking.service';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode';
import { EmailService } from './email.service';

export interface RegisterMemberDTO {
  fullName: string;
  dateOfBirth: string | Date;
  contactNumber: string;
  emailAddress: string;
  emergencyContact: string;
  planID: string;
  paymentMethod: string;
  password?: string;
  profilePhoto?: string;
  failPayment?: boolean;
}

export interface LoginDTO {
  emailAddress?: string;
  password?: string;
}

export class MemberService {
  /**
   * Member.register()
   * Orchestrates registration flow strictly following the sequence diagram:
   * 1. Check available plans
   * 2. Validate member details (email & contact uniqueness among active members)
   * 3. Process payment:
   *    - IF success: create Membership, extend(), generate qrCodeIdentifier, send WelcomeEmail
   *    - ELSE: cancel membership, mark incomplete, return displayFailureReason (no Active membership)
   */
  async register(dto: RegisterMemberDTO) {
    // 1. System checks availablePlans() - plan must exist and be active
    const plan = await membershipPlanService.getPlanById(dto.planID);
    if (!plan || !plan.activeStatus) {
      return {
        success: false,
        registrationIncomplete: true,
        displayFailureReason: 'Selected membership plan is invalid or currently inactive',
      };
    }

    // Basic detail validation
    if (!dto.fullName || !dto.dateOfBirth || !dto.contactNumber || !dto.emailAddress || !dto.emergencyContact) {
      return {
        success: false,
        registrationIncomplete: true,
        displayFailureReason: 'All registration fields (fullName, dateOfBirth, contactNumber, emailAddress, emergencyContact) are required',
      };
    }

    // 2. Validate that email and contact are not already associated with an existing active Member
    const existingActiveMember = await prisma.member.findFirst({
      where: {
        OR: [{ emailAddress: dto.emailAddress }, { contactNumber: dto.contactNumber }],
        membershipStatus: MembershipStatus.Active,
      },
    });

    if (existingActiveMember) {
      return {
        success: false,
        registrationIncomplete: true,
        displayFailureReason: 'Email address or contact number is already associated with an active member account',
      };
    }

    // Hash password if provided
    const passwordHash = dto.password ? bcrypt.hashSync(dto.password, 10) : null;

    // Create pending member record
    const member = await prisma.member.create({
      data: {
        fullName: dto.fullName,
        dateOfBirth: new Date(dto.dateOfBirth),
        contactNumber: dto.contactNumber,
        emailAddress: dto.emailAddress,
        emergencyContact: dto.emergencyContact,
        profilePhoto: dto.profilePhoto || null,
        membershipStatus: MembershipStatus.Pending,
        joinDate: new Date(),
        passwordHash,
      },
    });

    // Create initial pending Membership record
    const today = new Date();
    const membership = await prisma.membership.create({
      data: {
        membershipID: member.membershipID,
        planID: plan.planID,
        startDate: today,
        endDate: today,
        status: MembershipStatus.Pending,
        autoRenewFlag: false,
      },
    });

    // 3. Process online payment
    const payment = await paymentService.processOnline({
      membershipID: member.membershipID,
      amount: plan.price,
      paymentMethod: dto.paymentMethod,
      paymentPurpose: PaymentPurpose.Registration,
      failPayment: dto.failPayment,
    });

    // Alternate branch: Payment Success vs Invalid/Payment Failed
    if (payment.status === PaymentStatus.Success) {
      // 3.c Membership.extend() using plan's durationDays -> set startDate/endDate, status = Active
      const extendedMembership = await membershipService.extend(
        membership.membershipRecordID,
        plan.durationDays,
        today
      );

      // 3.d Generate membershipID's qrCodeIdentifier and real QR Code Data URL
      const qrCodeIdentifier = `GFMMS-QR-${member.membershipID}`;
      let qrCodeDataURL = '';
      try {
        qrCodeDataURL = await QRCode.toDataURL(qrCodeIdentifier, {
          errorCorrectionLevel: 'M',
          margin: 2,
          scale: 6,
          color: { dark: '#000000', light: '#FFFFFF' },
        });
      } catch (err: any) {
        console.warn('QR Code generation failed:', err.message);
      }

      const activeMember = await prisma.member.update({
        where: { membershipID: member.membershipID },
        data: {
          membershipStatus: MembershipStatus.Active,
          qrCodeIdentifier: qrCodeIdentifier,
        },
      });

      // 3.e Notification.send() a "WelcomeEmail" containing membershipID + QR code
      const welcomeContent = `Welcome to Anytime Fitness, ${activeMember.fullName}! Your Membership ID is ${activeMember.membershipID}. Your QR code identifier is ${qrCodeIdentifier}. Plan: ${plan.name} (${plan.durationDays} days).`;
      await notificationService.send({
        recipientID: activeMember.membershipID,
        category: 'WelcomeEmail',
        channel: NotificationChannel.Email,
        content: welcomeContent,
      });

      // Send real branded email with attached QR Code and Invoice asynchronously
      EmailService.sendWelcomeEmail({
        fullName: activeMember.fullName,
        emailAddress: activeMember.emailAddress,
        qrCodeIdentifier,
        qrCodeDataURL,
        planName: plan.name,
        endDate: extendedMembership.endDate,
        membershipID: activeMember.membershipID,
      }).catch((e) => console.error('[EmailService] Welcome email failed:', e.message));

      EmailService.sendInvoiceEmail({
        emailAddress: activeMember.emailAddress,
        fullName: activeMember.fullName,
        invoiceNumber: `INV-${payment.paymentID.substring(0, 8).toUpperCase()}`,
        amount: plan.price.toString(),
        planName: plan.name,
        paymentMethod: dto.paymentMethod,
        transactionRef: payment.transactionReferenceNumber,
        paymentDate: payment.timestamp,
        periodStart: extendedMembership.startDate,
        periodEnd: extendedMembership.endDate,
      }).catch((e) => console.error('[EmailService] Invoice email failed:', e.message));

      return {
        success: true,
        member: activeMember,
        membership: extendedMembership,
        payment,
        qrCodeIdentifier,
        qrCodeDataURL,
      };
    } else {
      // Payment Failed: Membership.cancel() / mark registration incomplete
      await membershipService.cancel(membership.membershipRecordID);

      const failedMember = await prisma.member.update({
        where: { membershipID: member.membershipID },
        data: { membershipStatus: MembershipStatus.Cancelled },
      });

      return {
        success: false,
        registrationIncomplete: true,
        displayFailureReason: 'Payment processing failed. Membership has not been activated.',
        member: failedMember,
        payment,
      };
    }
  }

  /**
   * Member.login()
   * Verifies member existence and credentials.
   */
  async login(membershipID: string, dto?: LoginDTO) {
    const member = await prisma.member.findUnique({
      where: { membershipID },
      include: {
        memberships: {
          orderBy: { endDate: 'desc' },
          take: 1,
          include: { plan: true },
        },
      },
    });

    if (!member) {
      throw new Error(`Member with ID ${membershipID} not found`);
    }

    if (dto?.emailAddress && member.emailAddress !== dto.emailAddress) {
      throw new Error('Invalid email address for this membership');
    }

    return {
      authenticated: true,
      member: {
        membershipID: member.membershipID,
        fullName: member.fullName,
        emailAddress: member.emailAddress,
        membershipStatus: member.membershipStatus,
        qrCodeIdentifier: member.qrCodeIdentifier,
        activeMembership: member.memberships[0] || null,
      },
    };
  }

  /**
   * Member.checkIn()
   * Initiates check-in for the member via AttendanceService
   */
  async checkIn(membershipID: string, method: 'QR' | 'Manual' | string) {
    return attendanceService.recordCheckIn({ membershipID, method });
  }

  /**
   * Member.bookClass()
   * Initiates class booking for the member via ClassBookingService
   */
  async bookClass(membershipID: string, classID: string) {
    return classBookingService.confirm({ membershipID, classID });
  }

  /**
   * List all members (for dashboard and administrative views)
   */
  async listMembers() {
    return prisma.member.findMany({
      orderBy: { joinDate: 'desc' },
      include: {
        memberships: {
          orderBy: { endDate: 'desc' },
          take: 1,
          include: { plan: true },
        },
        attendances: {
          orderBy: { checkInTimestamp: 'desc' },
          take: 5,
        },
      },
    });
  }

  /**
   * Get member by ID
   */
  async getMemberById(membershipID: string) {
    return prisma.member.findUnique({
      where: { membershipID },
      include: {
        memberships: {
          orderBy: { endDate: 'desc' },
          include: { plan: true },
        },
        payments: {
          orderBy: { timestamp: 'desc' },
        },
        attendances: {
          orderBy: { checkInTimestamp: 'desc' },
          include: {
            linkedClassBooking: {
              include: { fitnessClass: true },
            },
          },
        },
        classBookings: {
          orderBy: { bookingTimestamp: 'desc' },
          include: { fitnessClass: true },
        },
      },
    });
  }
}

export const memberService = new MemberService();
