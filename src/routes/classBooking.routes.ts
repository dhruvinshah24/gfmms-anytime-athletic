import { Router } from 'express';
import { classBookingController } from '../controllers/classBooking.controller';

const router = Router();

// POST /bookings/:bookingId/cancel -> ClassBooking.cancel()
router.post('/:bookingId/cancel', classBookingController.cancel);

// POST /bookings/classes/:classId/promote -> ClassBooking.promoteFromWaitlist()
router.post('/classes/:classId/promote', classBookingController.promoteFromWaitlist);

export default router;
