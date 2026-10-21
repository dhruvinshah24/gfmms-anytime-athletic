import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';

const router = Router();

// GET /payments -> list all payments
router.get('/', paymentController.listPayments);

// Payment: processOnline(), recordManual(), generateReceipt(), generateInvoice(), refund()
router.post('/online', paymentController.processOnline);
router.post('/manual', paymentController.recordManual);
router.get('/:id/receipt', paymentController.generateReceipt);
router.get('/:id/invoice', paymentController.generateInvoice);
router.post('/:id/refund', paymentController.refund);

export default router;
