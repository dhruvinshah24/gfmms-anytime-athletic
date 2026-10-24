import { Router, Request, Response } from 'express';
import { memberController } from '../controllers/member.controller';
import prisma from '../config/db';
import QRCode from 'qrcode';

const router = Router();

// GET /members -> list all members
router.get('/', memberController.listMembers);

// POST /members/register -> Member.register()
router.post('/register', memberController.register);

// GET /members/:id/qrcode -> returns QR code data URL and identifier
router.get('/:id/qrcode', async (req: Request, res: Response) => {
  try {
    const member = await prisma.member.findUnique({
      where: { membershipID: req.params.id },
    });
    if (!member) {
      return res.status(404).json({ status: 'error', message: 'Member not found' });
    }
    const qrIdentifier = member.qrCodeIdentifier || `GFMMS-QR-${member.membershipID}`;
    const qrCodeDataURL = await QRCode.toDataURL(qrIdentifier, {
      errorCorrectionLevel: 'M',
      margin: 2,
      scale: 6,
      color: { dark: '#000000', light: '#FFFFFF' },
    });
    return res.json({
      status: 'success',
      data: {
        membershipID: member.membershipID,
        fullName: member.fullName,
        qrCodeIdentifier: qrIdentifier,
        qrCodeDataURL,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /members/:id/login -> Member.login()
router.post('/:id/login', memberController.login);

// GET /members/:id
router.get('/:id', memberController.getMember);

export default router;
