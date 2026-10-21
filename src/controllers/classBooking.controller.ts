import { Request, Response } from 'express';
import { classBookingService } from '../services/classBooking.service';

export class ClassBookingController {
  async cancel(req: Request, res: Response) {
    try {
      const result = await classBookingService.cancel(req.params.bookingId);
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to cancel booking',
      });
    }
  }

  async promoteFromWaitlist(req: Request, res: Response) {
    try {
      const promoted = await classBookingService.promoteFromWaitlist(req.params.classId);
      return res.status(200).json({
        status: 'success',
        data: promoted,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to promote from waitlist',
      });
    }
  }
}

export const classBookingController = new ClassBookingController();
