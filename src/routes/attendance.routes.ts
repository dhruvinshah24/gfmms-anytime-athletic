import { Router } from 'express';
import { attendanceController } from '../controllers/attendance.controller';

const router = Router();

// POST /attendance/checkin -> Member.checkIn() / Attendance.recordCheckIn()
router.post('/checkin', attendanceController.checkIn);

// POST /attendance/:id/checkout and POST /attendance/checkout -> Attendance.recordCheckOut()
router.post('/checkout', attendanceController.checkOut);
router.post('/:id/checkout', attendanceController.checkOut);

// GET /attendance/member/:membershipID
router.get('/member/:membershipID', attendanceController.getMemberAttendance);

export default router;
