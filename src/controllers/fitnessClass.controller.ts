import { Request, Response } from 'express';
import { fitnessClassService } from '../services/fitnessClass.service';
import { classBookingService } from '../services/classBooking.service';

export class FitnessClassController {
  async create(req: Request, res: Response) {
    try {
      const fitnessClass = await fitnessClassService.create(req.body);
      return res.status(201).json({ status: 'success', data: fitnessClass });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const classes = await fitnessClassService.listClasses();
      return res.status(200).json({ status: 'success', data: classes });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const fitnessClass = await fitnessClassService.getClassById(req.params.classId);
      if (!fitnessClass) {
        return res.status(404).json({ status: 'error', message: 'Class not found' });
      }
      return res.status(200).json({ status: 'success', data: fitnessClass });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async cancelClass(req: Request, res: Response) {
    try {
      const { reason } = req.body;
      const result = await fitnessClassService.cancel(req.params.classId, reason);
      return res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getWaitlist(req: Request, res: Response) {
    try {
      const waitlist = await fitnessClassService.getWaitlist(req.params.classId);
      return res.status(200).json({ status: 'success', data: waitlist });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async bookClass(req: Request, res: Response) {
    try {
      const { membershipID } = req.body;
      const classID = req.params.classId;

      if (!membershipID) {
        return res.status(400).json({ status: 'error', message: 'membershipID is required' });
      }

      const result = await classBookingService.confirm({
        membershipID,
        classID,
      });

      return res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to book class',
      });
    }
  }
}

export const fitnessClassController = new FitnessClassController();
