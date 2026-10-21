import { Request, Response } from 'express';
import { membershipService } from '../services/membership.service';

export class MembershipController {
  async extend(req: Request, res: Response) {
    try {
      const { durationDays, startDate } = req.body;
      const result = await membershipService.extend(
        req.params.id,
        durationDays,
        startDate ? new Date(startDate) : undefined
      );
      return res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async expire(req: Request, res: Response) {
    try {
      const result = await membershipService.expire(req.params.id);
      return res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const result = await membershipService.cancel(req.params.id);
      return res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async checkGracePeriod(req: Request, res: Response) {
    try {
      const { membershipID } = req.params;
      const result = await membershipService.checkGracePeriod(membershipID);
      return res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

export const membershipController = new MembershipController();
