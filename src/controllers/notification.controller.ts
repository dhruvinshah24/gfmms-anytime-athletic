import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';

export class NotificationController {
  async send(req: Request, res: Response) {
    try {
      const notification = await notificationService.send(req.body);
      return res.status(201).json({ status: 'success', data: notification });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async retry(req: Request, res: Response) {
    try {
      const updated = await notificationService.retry(req.params.id);
      return res.status(200).json({ status: 'success', data: updated });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async logDelivery(req: Request, res: Response) {
    try {
      const log = await notificationService.logDelivery(req.params.id);
      return res.status(200).json({ status: 'success', data: log });
    } catch (error: any) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
  }

  async getByRecipient(req: Request, res: Response) {
    try {
      const notifications = await notificationService.getByRecipient(req.params.recipientId);
      return res.status(200).json({ status: 'success', data: notifications });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export const notificationController = new NotificationController();
