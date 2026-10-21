import { Request, Response } from 'express';
import { membershipPlanService } from '../services/membershipPlan.service';

export class MembershipPlanController {
  async getAvailablePlans(req: Request, res: Response) {
    try {
      const plans = await membershipPlanService.getAvailablePlans();
      return res.status(200).json({ status: 'success', data: plans });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async createPlan(req: Request, res: Response) {
    try {
      const plan = await membershipPlanService.createPlan(req.body);
      return res.status(201).json({ status: 'success', data: plan });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async activate(req: Request, res: Response) {
    try {
      const updated = await membershipPlanService.activate(req.params.id);
      return res.status(200).json({ status: 'success', data: updated });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async deactivate(req: Request, res: Response) {
    try {
      const updated = await membershipPlanService.deactivate(req.params.id);
      return res.status(200).json({ status: 'success', data: updated });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async updatePrice(req: Request, res: Response) {
    try {
      const { price } = req.body;
      const updated = await membershipPlanService.updatePrice(req.params.id, Number(price));
      return res.status(200).json({ status: 'success', data: updated });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

export const membershipPlanController = new MembershipPlanController();
