import prisma from '../config/db';
import { MembershipStatus } from '@prisma/client';

export class MembershipService {
  /**
   * Membership.extend()
   * Extends the membership end date by the given durationDays and marks status as Active.
   */
  async extend(membershipRecordID: string, durationDays: number, startDate?: Date) {
    const membership = await prisma.membership.findUnique({
      where: { membershipRecordID },
    });

    if (!membership) {
      throw new Error(`Membership record ${membershipRecordID} not found`);
    }

    const effectiveStartDate = startDate || membership.startDate || new Date();
    // Calculate new end date based on effectiveStartDate or existing endDate if still in future
    const baseDate = membership.endDate && membership.endDate > new Date()
      ? new Date(membership.endDate)
      : new Date(effectiveStartDate);

    const newEndDate = new Date(baseDate);
    newEndDate.setDate(newEndDate.getDate() + durationDays);

    const updated = await prisma.membership.update({
      where: { membershipRecordID },
      data: {
        startDate: effectiveStartDate,
        endDate: newEndDate,
        status: MembershipStatus.Active,
      },
    });

    // Also synchronize Member.membershipStatus to Active
    await prisma.member.update({
      where: { membershipID: membership.membershipID },
      data: { membershipStatus: MembershipStatus.Active },
    });

    return updated;
  }

  /**
   * Membership.expire()
   * Marks the membership record and member status as Expired.
   */
  async expire(membershipRecordID: string) {
    const membership = await prisma.membership.findUnique({
      where: { membershipRecordID },
    });

    if (!membership) {
      throw new Error(`Membership record ${membershipRecordID} not found`);
    }

    const updated = await prisma.membership.update({
      where: { membershipRecordID },
      data: { status: MembershipStatus.Expired },
    });

    await prisma.member.update({
      where: { membershipID: membership.membershipID },
      data: { membershipStatus: MembershipStatus.Expired },
    });

    return updated;
  }

  /**
   * Membership.cancel()
   * Marks the membership record and member status as Cancelled.
   */
  async cancel(membershipRecordID: string) {
    const membership = await prisma.membership.findUnique({
      where: { membershipRecordID },
    });

    if (!membership) {
      throw new Error(`Membership record ${membershipRecordID} not found`);
    }

    const updated = await prisma.membership.update({
      where: { membershipRecordID },
      data: { status: MembershipStatus.Cancelled },
    });

    await prisma.member.update({
      where: { membershipID: membership.membershipID },
      data: { membershipStatus: MembershipStatus.Cancelled },
    });

    return updated;
  }

  /**
   * Membership.checkGracePeriod()
   * Checks whether the member's latest membership is active or within the 3-day grace period.
   * Returns: { isValid: boolean, inGracePeriod: boolean, membership: Membership | null }
   */
  async checkGracePeriod(membershipID: string, graceDays = 3) {
    const memberships = await prisma.membership.findMany({
      where: { membershipID },
      orderBy: { endDate: 'desc' },
      take: 1,
    });

    if (!memberships || memberships.length === 0) {
      return { isValid: false, inGracePeriod: false, membership: null };
    }

    const latestMembership = memberships[0];
    const now = new Date();

    // Check if currently active and endDate is in the future
    if (latestMembership.status === MembershipStatus.Active && latestMembership.endDate >= now) {
      return { isValid: true, inGracePeriod: false, membership: latestMembership };
    }

    // If expired or past endDate, verify if within grace period (up to 3 days after expiry)
    const gracePeriodEnd = new Date(latestMembership.endDate);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + graceDays);

    if (now <= gracePeriodEnd) {
      return { isValid: true, inGracePeriod: true, membership: latestMembership };
    }

    return { isValid: false, inGracePeriod: false, membership: latestMembership };
  }

  /**
   * Auto-expire pending registrations that haven't been completed within 30 minutes.
   */
  async expirePendingRegistrations(windowMinutes = 30) {
    const threshold = new Date(Date.now() - windowMinutes * 60 * 1000);
    const pendingMembers = await prisma.member.findMany({
      where: {
        membershipStatus: MembershipStatus.Pending,
        joinDate: { lte: threshold },
      },
    });

    for (const member of pendingMembers) {
      await prisma.member.update({
        where: { membershipID: member.membershipID },
        data: { membershipStatus: MembershipStatus.Cancelled },
      });

      await prisma.membership.updateMany({
        where: {
          membershipID: member.membershipID,
          status: MembershipStatus.Pending,
        },
        data: { status: MembershipStatus.Cancelled },
      });
    }

    return pendingMembers.length;
  }
}

export const membershipService = new MembershipService();
