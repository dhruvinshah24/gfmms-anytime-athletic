import prisma from '../config/db';
import { NotificationChannel, DeliveryStatus } from '@prisma/client';

export interface SendNotificationDTO {
  recipientID: string;
  category: string;
  channel: NotificationChannel;
  content: string;
  simulateFailure?: boolean;
}

export class NotificationService {
  /**
   * Notification.send()
   * Creates notification entry, logs to console, sets delivery status.
   */
  async send(dto: SendNotificationDTO) {
    const deliveryStatus = dto.simulateFailure ? DeliveryStatus.Failed : DeliveryStatus.Sent;

    console.log(
      `[NotificationService.send] To: ${dto.recipientID} | Channel: ${dto.channel} | Category: ${dto.category} | Status: ${deliveryStatus}`
    );
    console.log(`[Notification Content]: ${dto.content}`);

    const notification = await prisma.notification.create({
      data: {
        recipientID: dto.recipientID,
        category: dto.category,
        channel: dto.channel,
        content: dto.content,
        deliveryStatus: deliveryStatus,
        timestamp: new Date(),
      },
    });

    return notification;
  }

  /**
   * Notification.retry()
   * Retries delivery of a failed or retrying notification.
   */
  async retry(notificationID: string) {
    const notification = await prisma.notification.findUnique({
      where: { notificationID },
    });

    if (!notification) {
      throw new Error(`Notification ${notificationID} not found`);
    }

    console.log(
      `[NotificationService.retry] Retrying notification ${notificationID} to ${notification.recipientID}`
    );

    // After retry attempt, simulate successful delivery
    const updated = await prisma.notification.update({
      where: { notificationID },
      data: {
        deliveryStatus: DeliveryStatus.Sent,
        timestamp: new Date(),
      },
    });

    return updated;
  }

  /**
   * Notification.logDelivery()
   * Retrieves and formats delivery logs for a given notification or recipient.
   */
  async logDelivery(notificationID: string) {
    const notification = await prisma.notification.findUnique({
      where: { notificationID },
    });

    if (!notification) {
      throw new Error(`Notification ${notificationID} not found`);
    }

    return {
      notificationID: notification.notificationID,
      recipientID: notification.recipientID,
      category: notification.category,
      channel: notification.channel,
      deliveryStatus: notification.deliveryStatus,
      timestamp: notification.timestamp,
    };
  }

  /**
   * Retrieve all notifications for a recipient
   */
  async getByRecipient(recipientID: string) {
    return prisma.notification.findMany({
      where: { recipientID },
      orderBy: { timestamp: 'desc' },
    });
  }
}

export const notificationService = new NotificationService();
