import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';

const router = Router();

// Notification: send(), retry(), logDelivery()
router.post('/send', notificationController.send);
router.post('/:id/retry', notificationController.retry);
router.get('/:id/log', notificationController.logDelivery);
router.get('/recipient/:recipientId', notificationController.getByRecipient);

export default router;
