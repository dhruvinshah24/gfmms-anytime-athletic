import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import prisma from '../config/db';

const router = Router();

// GET /notifications -> list all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
    return res.status(200).json({ status: 'success', data: notifications });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// Notification: send(), retry(), logDelivery()
router.post('/send', notificationController.send);
router.post('/:id/retry', notificationController.retry);
router.get('/:id/log', notificationController.logDelivery);
router.get('/recipient/:recipientId', notificationController.getByRecipient);

export default router;
