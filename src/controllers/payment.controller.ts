import { Request, Response } from 'express';
import { paymentService } from '../services/payment.service';

export class PaymentController {
  async processOnline(req: Request, res: Response) {
    try {
      const payment = await paymentService.processOnline(req.body);
      return res.status(200).json({ status: 'success', data: payment });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async recordManual(req: Request, res: Response) {
    try {
      const payment = await paymentService.recordManual(req.body);
      return res.status(201).json({ status: 'success', data: payment });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async generateReceipt(req: Request, res: Response) {
    try {
      const receipt = await paymentService.generateReceipt(req.params.id);
      return res.status(200).json({ status: 'success', data: receipt });
    } catch (error: any) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
  }

  async generateInvoice(req: Request, res: Response) {
    try {
      const invoice = await paymentService.generateInvoice(req.params.id);
      return res.status(200).json({ status: 'success', data: invoice });
    } catch (error: any) {
      return res.status(404).json({ status: 'error', message: error.message });
    }
  }

  async refund(req: Request, res: Response) {
    try {
      const { reasonCode } = req.body;
      const refundRecord = await paymentService.refund(req.params.id, reasonCode);
      return res.status(200).json({ status: 'success', data: refundRecord });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

export const paymentController = new PaymentController();
