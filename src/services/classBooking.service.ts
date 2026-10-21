import prisma from '../config/db';
import { BookingStatus, MembershipStatus, NotificationChannel } from '@prisma/client';
import { notificationService } from './notification.service';

export interface BookClassDTO {
  membershipID: string;
  classID: string;
}

export class ClassBookingService {
  /**
   * ClassBooking.confirm()
   * Checks member status, checks capacity:
   * - IF seat available: status = Booked, increment currentBookings, send BookingConfirmation
   * - ELSE: status = Waitlisted, send WaitlistConfirmation
   */
  async confirm(dto: BookClassDTO) {
    // Check member existence and status
    const member = await prisma.member.findUnique({
      where: { membershipID: dto.membershipID },
    });

    if (!member) {
      throw new Error(`Member ${dto.membershipID} not found`);
    }

    if (member.membershipStatus !== MembershipStatus.Active) {
      throw new Error(`Member does not have an active membership. Current status: ${member.membershipStatus}`);
    }

    // Check fitness class existence
    const fitnessClass = await prisma.fitnessClass.findUnique({
      where: { classID: dto.classID },
    });

    if (!fitnessClass) {
      throw new Error(`Fitness class ${dto.classID} not found`);
    }

    // Check if member already has an active booking or waitlist for this class
    const existingBooking = await prisma.classBooking.findFirst({
      where: {
        membershipID: dto.membershipID,
        classID: dto.classID,
        status: { in: [BookingStatus.Booked, BookingStatus.Waitlisted] },
      },
    });

    if (existingBooking) {
      throw new Error(
        `Member already has a booking/waitlist entry for this class with status ${existingBooking.status}`
      );
    }

    // Capacity check: currentBookings vs capacity
    if (fitnessClass.currentBookings < fitnessClass.capacity) {
      // Seat available branch
      const booking = await prisma.classBooking.create({
        data: {
          membershipID: dto.membershipID,
          classID: dto.classID,
          status: BookingStatus.Booked,
          bookingTimestamp: new Date(),
        },
      });

      // Increment currentBookings
      await prisma.fitnessClass.update({
        where: { classID: dto.classID },
        data: { currentBookings: { increment: 1 } },
      });

      // Notification.send() a "BookingConfirmation"
      const content = `Booking Confirmed: You have a confirmed seat for "${fitnessClass.name}" scheduled at ${fitnessClass.schedule.toISOString()}. Booking ID: ${booking.bookingID}.`;
      await notificationService.send({
        recipientID: dto.membershipID,
        category: 'BookingConfirmation',
        channel: NotificationChannel.Email,
        content,
      });

      return {
        booking,
        status: BookingStatus.Booked,
        message: 'Seat confirmed in fitness class',
      };
    } else {
      // Class full branch -> Waitlisted
      const booking = await prisma.classBooking.create({
        data: {
          membershipID: dto.membershipID,
          classID: dto.classID,
          status: BookingStatus.Waitlisted,
          bookingTimestamp: new Date(),
        },
      });

      // Notification.send() a "WaitlistConfirmation"
      const content = `Waitlist Confirmed: "${fitnessClass.name}" is currently full. You have been added to the waitlist. We will notify you if a seat opens up. Booking ID: ${booking.bookingID}.`;
      await notificationService.send({
        recipientID: dto.membershipID,
        category: 'WaitlistConfirmation',
        channel: NotificationChannel.Email,
        content,
      });

      return {
        booking,
        status: BookingStatus.Waitlisted,
        message: 'Class is full; placed on waitlist',
      };
    }
  }

  /**
   * ClassBooking.cancel()
   * Cancels an existing booking:
   * - Only allowed if more than 2 hours before class start time
   * - status = Cancelled, decrement currentBookings
   * - promoteFromWaitlist()
   */
  async cancel(bookingID: string) {
    const booking = await prisma.classBooking.findUnique({
      where: { bookingID },
      include: {
        fitnessClass: true,
      },
    });

    if (!booking) {
      throw new Error(`Booking ${bookingID} not found`);
    }

    if (booking.status === BookingStatus.Cancelled) {
      throw new Error('Booking has already been cancelled');
    }

    const classStartTime = new Date(booking.fitnessClass.schedule).getTime();
    const now = Date.now();
    const twoHoursInMs = 2 * 60 * 60 * 1000;

    // Time validation: reject if less than 2 hours before class start
    if (classStartTime - now < twoHoursInMs) {
      throw new Error(
        'Cancellation rejected: Bookings can only be cancelled more than 2 hours before the class start time.'
      );
    }

    const wasBooked = booking.status === BookingStatus.Booked;

    // Update status to Cancelled
    const updatedBooking = await prisma.classBooking.update({
      where: { bookingID },
      data: { status: BookingStatus.Cancelled },
    });

    let promotedBooking = null;

    if (wasBooked) {
      // Decrement currentBookings
      await prisma.fitnessClass.update({
        where: { classID: booking.classID },
        data: { currentBookings: { decrement: 1 } },
      });

      // Promote earliest waitlisted booking
      promotedBooking = await this.promoteFromWaitlist(booking.classID);
    }

    return {
      success: true,
      cancelledBooking: updatedBooking,
      promotedBooking,
      message: 'Booking cancelled successfully',
    };
  }

  /**
   * ClassBooking.promoteFromWaitlist()
   * If any Waitlisted booking exists for this class, promote the earliest one to Booked
   * and send it a "WaitlistConfirmation" notification offering the seat.
   */
  async promoteFromWaitlist(classID: string) {
    const earliestWaitlisted = await prisma.classBooking.findFirst({
      where: {
        classID,
        status: BookingStatus.Waitlisted,
      },
      orderBy: { bookingTimestamp: 'asc' },
      include: {
        fitnessClass: true,
      },
    });

    if (!earliestWaitlisted) {
      return null;
    }

    // Promote to Booked
    const promoted = await prisma.classBooking.update({
      where: { bookingID: earliestWaitlisted.bookingID },
      data: { status: BookingStatus.Booked },
    });

    // Increment currentBookings
    await prisma.fitnessClass.update({
      where: { classID },
      data: { currentBookings: { increment: 1 } },
    });

    // Send WaitlistConfirmation notification offering the seat
    const content = `Great news! A seat opened up for "${earliestWaitlisted.fitnessClass.name}" scheduled at ${earliestWaitlisted.fitnessClass.schedule.toISOString()}. Your waitlist position has been promoted to Booked! Booking ID: ${promoted.bookingID}.`;
    await notificationService.send({
      recipientID: promoted.membershipID,
      category: 'WaitlistConfirmation',
      channel: NotificationChannel.Email,
      content,
    });

    return promoted;
  }
}

export const classBookingService = new ClassBookingService();
