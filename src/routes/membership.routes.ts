import { Router } from 'express';
import { membershipController } from '../controllers/membership.controller';

const router = Router();

// Membership: extend(), expire(), cancel(), checkGracePeriod()
router.patch('/:id/extend', membershipController.extend);
router.patch('/:id/expire', membershipController.expire);
router.patch('/:id/cancel', membershipController.cancel);
router.get('/check-grace/:membershipID', membershipController.checkGracePeriod);

export default router;
