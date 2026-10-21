import { Request, Response } from 'express';
import { attendanceService } from '../services/attendance.service';

export class AttendanceController {
  async checkIn(req: Request, res: Response) {
    try {
      const { membershipID, method } = req.body;
      if (!membershipID) {
        return res.status(400).json({ status: 'error', message: 'membershipID is required' });
      }

      const result = await attendanceService.recordCheckIn({
        membershipID,
        method: method || 'QR',
      });

      return res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      const isDenied = error.message?.includes('checkInDenied');
      const isDuplicate = error.message?.includes('Duplicate check-in');
      const statusCode = isDenied || isDuplicate ? 403 : 400;

      return res.status(statusCode).json({
        status: 'error',
        message: error.message || 'Check-in failed',
      });
    }
  }

  async checkOut(req: Request, res: Response) {
    try {
      const result = await attendanceService.recordCheckOut(req.params.id);
      return res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getMemberAttendance(req: Request, res: Response) {
    try {
      const attendances = await attendanceService.getMemberAttendance(req.params.membershipID);
      return res.status(200).json({ status: 'success', data: attendances });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export const attendanceController = new AttendanceController();
