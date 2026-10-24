import { Router } from 'express';
import { classBookingController } from '../controllers/classBooking.controller';
import { fitnessClassController } from '../controllers/fitnessClass.controller';

const router = Router();

// POST /bookings -> ClassBooking.create() / FitnessClass.bookClass()
router.post('/', (req, res) => {
  const classId = req.body?.classID || req.body?.classId;
  (req.params as any).classId = classId;
  return fitnessClassController.bookClass(req, res);
});

// POST /bookings/:bookingId/cancel -> ClassBooking.cancel()
router.post('/:bookingId/cancel', classBookingController.cancel);

// POST /bookings/classes/:classId/promote -> ClassBooking.promoteFromWaitlist()
router.post('/classes/:classId/promote', classBookingController.promoteFromWaitlist);

export default router;
