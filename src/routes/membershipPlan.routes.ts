import { Router } from 'express';
import { membershipPlanController } from '../controllers/membershipPlan.controller';

const router = Router();

// MembershipPlan: activate(), deactivate(), updatePrice()
router.get('/', membershipPlanController.getAvailablePlans);
router.post('/', membershipPlanController.createPlan);
router.patch('/:id/activate', membershipPlanController.activate);
router.patch('/:id/deactivate', membershipPlanController.deactivate);
router.patch('/:id/price', membershipPlanController.updatePrice);

export default router;
