import { Router } from 'express';
import { memberController } from '../controllers/member.controller';

const router = Router();

// GET /members -> list all members
router.get('/', memberController.listMembers);

// POST /members/register -> Member.register()
router.post('/register', memberController.register);

// POST /members/:id/login -> Member.login()
router.post('/:id/login', memberController.login);

// GET /members/:id
router.get('/:id', memberController.getMember);

export default router;
