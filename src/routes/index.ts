import { Router } from 'express';
import memberRoutes from './member.routes';
import membershipRoutes from './membership.routes';
import membershipPlanRoutes from './membershipPlan.routes';
import paymentRoutes from './payment.routes';
import notificationRoutes from './notification.routes';
import attendanceRoutes from './attendance.routes';
import fitnessClassRoutes from './fitnessClass.routes';
import classBookingRoutes from './classBooking.routes';

const router = Router();

// Module A Routes
router.use('/members', memberRoutes);
router.use('/memberships', membershipRoutes);
router.use('/plans', membershipPlanRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);

// Module B Routes
router.use('/attendance', attendanceRoutes);
router.use('/classes', fitnessClassRoutes);
router.use('/bookings', classBookingRoutes);

export default router;
