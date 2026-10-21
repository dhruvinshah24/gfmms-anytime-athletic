import { Router } from 'express';
import { fitnessClassController } from '../controllers/fitnessClass.controller';

const router = Router();

// FitnessClass: create(), cancel(), getWaitlist()
router.post('/', fitnessClassController.create);
router.get('/', fitnessClassController.list);
router.get('/:classId', fitnessClassController.getById);
router.post('/:classId/cancel', fitnessClassController.cancelClass);
router.get('/:classId/waitlist', fitnessClassController.getWaitlist);

// POST /classes/:classId/book -> Member.bookClass() / ClassBooking.confirm()
router.post('/:classId/book', fitnessClassController.bookClass);

export default router;
