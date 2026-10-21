import prisma from '../config/db';
import { BookingStatus, NotificationChannel } from '@prisma/client';
import { notificationService } from './notification.service';

export interface CreateFitnessClassDTO {
  name: string;
  category: string;
  trainerID: string;
  schedule: string | Date;
  durationMinutes: number;
  capacity: number;
  isRecurring?: boolean;
  weeklyPattern?: string;
}

export class FitnessClassService {
  /**
   * FitnessClass.create()
   * Creates a new scheduled fitness class.
   */
  async create(dto: CreateFitnessClassDTO) {
    if (dto.capacity <= 0) {
      throw new Error('Class capacity must be greater than zero');
    }
    if (dto.durationMinutes <= 0) {
      throw new Error('Duration must be greater than zero');
    }

    const fitnessClass = await prisma.fitnessClass.create({
      data: {
        name: dto.name,
        category: dto.category,
        trainerID: dto.trainerID,
        schedule: new Date(dto.schedule),
        durationMinutes: dto.durationMinutes,
        capacity: dto.capacity,
        currentBookings: 0,
        isRecurring: dto.isRecurring ?? false,
        weeklyPattern: dto.weeklyPattern ?? null,
      },
    });

    return fitnessClass;
  }

  /**
   * FitnessClass.cancel()
   * Cancels a scheduled class and sends notifications to all booked/waitlisted members.
   */
  async cancel(classID: string, reason = 'Class cancelled by administration') {
    const fitnessClass = await prisma.fitnessClass.findUnique({
      where: { classID },
      include: {
        bookings: {
          where: {
            status: { in: [BookingStatus.Booked, BookingStatus.Waitlisted] },
          },
        },
      },
    });

    if (!fitnessClass) {
      throw new Error(`Fitness class ${classID} not found`);
    }

    // Notify all affected members
    for (const booking of fitnessClass.bookings) {
      await notificationService.send({
        recipientID: booking.membershipID,
        category: 'ClassCancelled',
        channel: NotificationChannel.SMS,
        content: `Your booked class "${fitnessClass.name}" scheduled for ${fitnessClass.schedule.toISOString()} has been cancelled. Reason: ${reason}`,
      });
    }

    // Update bookings to Cancelled
    await prisma.classBooking.updateMany({
      where: {
        classID,
        status: { in: [BookingStatus.Booked, BookingStatus.Waitlisted] },
      },
      data: { status: BookingStatus.Cancelled },
    });

    return {
      success: true,
      message: `Fitness class ${fitnessClass.name} cancelled`,
      notifiedMembersCount: fitnessClass.bookings.length,
    };
  }

  /**
   * FitnessClass.getWaitlist()
   * Retrieves ordered waitlist queue for this class.
   */
  async getWaitlist(classID: string) {
    return prisma.classBooking.findMany({
      where: {
        classID,
        status: BookingStatus.Waitlisted,
      },
      orderBy: { bookingTimestamp: 'asc' },
      include: {
        member: {
          select: {
            membershipID: true,
            fullName: true,
            emailAddress: true,
            contactNumber: true,
          },
        },
      },
    });
  }

  /**
   * Helper: get class by ID
   */
  async getClassById(classID: string) {
    return prisma.fitnessClass.findUnique({
      where: { classID },
      include: {
        bookings: {
          orderBy: { bookingTimestamp: 'asc' },
        },
      },
    });
  }

  /**
   * Helper: list classes
   */
  async listClasses() {
    return prisma.fitnessClass.findMany({
      orderBy: { schedule: 'asc' },
    });
  }
}

export const fitnessClassService = new FitnessClassService();
