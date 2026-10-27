import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'ironpeak-super-secret-jwt-key-2026-gfmms';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// POST /auth/owner/login
router.post('/owner/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const ownerEmail = process.env.OWNER_EMAIL || 'dynamitedhruvin@gmail.com';
    const ownerHash = process.env.OWNER_PASSWORD_HASH;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    if (email.toLowerCase().trim() !== ownerEmail.toLowerCase().trim()) {
      return res.status(401).json({ status: 'error', message: 'Invalid owner credentials' });
    }

    let isValid = false;
    if (ownerHash) {
      isValid = bcrypt.compareSync(password, ownerHash);
    }
    // Also accept passwords "Anytime@2026" and "IronPeak@2026"
    if (!isValid && (password === 'Anytime@2026' || password === 'IronPeak@2026')) {
      isValid = true;
    }

    if (!isValid) {
      return res.status(401).json({ status: 'error', message: 'Invalid owner credentials' });
    }

    const token = jwt.sign({ role: 'owner', email: ownerEmail }, JWT_SECRET, {
      expiresIn: '24h',
    });

    return res.json({
      status: 'success',
      data: {
        token,
        role: 'owner',
        user: {
          name: 'Anytime Fitness Club Owner',
          email: ownerEmail,
          role: 'owner',
        },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /auth/demo-accounts — Returns verified credentials for quick demo testing
router.get('/demo-accounts', async (req: Request, res: Response) => {
  try {
    const ownerEmail = process.env.OWNER_EMAIL || 'dynamitedhruvin@gmail.com';
    const members = await prisma.member.findMany({
      take: 6,
      orderBy: { joinDate: 'desc' },
      include: {
        memberships: {
          orderBy: { endDate: 'desc' },
          take: 1,
          include: { plan: true },
        },
      },
    });

    return res.json({
      status: 'success',
      data: {
        owner: {
          email: ownerEmail,
          role: 'owner',
          defaultPassword: 'IronPeak@2026',
        },
        members: members.map((m) => ({
          membershipID: m.membershipID,
          fullName: m.fullName,
          emailAddress: m.emailAddress,
          membershipStatus: m.membershipStatus,
          qrCodeIdentifier: m.qrCodeIdentifier,
          planName: m.memberships[0]?.plan?.name || 'Standard Plan',
          defaultPassword: 'Anytime@2026',
        })),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /auth/me — Reload current authenticated user's state from database
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }

    if (decoded.role === 'owner') {
      const ownerEmail = process.env.OWNER_EMAIL || 'dynamitedhruvin@gmail.com';
      return res.json({
        status: 'success',
        data: {
          role: 'owner',
          user: {
            name: 'Anytime Fitness Club Owner',
            email: ownerEmail,
            role: 'owner',
          },
        },
      });
    }

    const member = await prisma.member.findUnique({
      where: { membershipID: decoded.membershipID },
      include: {
        memberships: {
          orderBy: { endDate: 'desc' },
          take: 1,
          include: { plan: true },
        },
        attendances: {
          orderBy: { checkInTimestamp: 'desc' },
          take: 10,
        },
        payments: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
        classBookings: {
          orderBy: { bookingTimestamp: 'desc' },
          take: 10,
          include: { fitnessClass: true },
        },
      },
    });

    if (!member) {
      return res.status(404).json({ status: 'error', message: 'Member profile not found' });
    }

    return res.json({
      status: 'success',
      data: {
        role: 'member',
        member: {
          membershipID: member.membershipID,
          fullName: member.fullName,
          emailAddress: member.emailAddress,
          contactNumber: member.contactNumber,
          membershipStatus: member.membershipStatus,
          qrCodeIdentifier: member.qrCodeIdentifier,
          joinDate: member.joinDate,
          activeMembership: member.memberships[0] || null,
          recentAttendances: member.attendances,
          recentPayments: member.payments,
          recentBookings: member.classBookings,
        },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /auth/member/login
router.post('/member/login', async (req: Request, res: Response) => {
  try {
    const { emailAddress, membershipID, password } = req.body;

    if (!emailAddress && !membershipID) {
      return res.status(400).json({ status: 'error', message: 'Email or Membership ID is required' });
    }

    const member = await prisma.member.findFirst({
      where: {
        OR: [
          ...(emailAddress ? [{ emailAddress: emailAddress.trim() }] : []),
          ...(membershipID ? [{ membershipID: membershipID.trim() }] : []),
          ...(membershipID ? [{ qrCodeIdentifier: membershipID.trim() }] : []),
        ],
      },
      include: {
        memberships: {
          orderBy: { endDate: 'desc' },
          take: 1,
          include: { plan: true },
        },
        attendances: {
          orderBy: { checkInTimestamp: 'desc' },
          take: 5,
        },
        payments: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
        classBookings: {
          orderBy: { bookingTimestamp: 'desc' },
          take: 5,
          include: { fitnessClass: true },
        },
      },
    });

    if (!member) {
      return res.status(401).json({ status: 'error', message: 'Member account not found' });
    }

    // If password provided and member has passwordHash, check it
    if (password && member.passwordHash) {
      const isValid = bcrypt.compareSync(password, member.passwordHash);
      if (!isValid && password !== 'Anytime@2026' && password !== 'IronPeak@2026') {
        return res.status(401).json({ status: 'error', message: 'Invalid password' });
      }
    }

    const token = jwt.sign(
      { role: 'member', membershipID: member.membershipID, email: member.emailAddress },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      status: 'success',
      data: {
        token,
        role: 'member',
        member: {
          membershipID: member.membershipID,
          fullName: member.fullName,
          emailAddress: member.emailAddress,
          contactNumber: member.contactNumber,
          membershipStatus: member.membershipStatus,
          qrCodeIdentifier: member.qrCodeIdentifier,
          joinDate: member.joinDate,
          activeMembership: member.memberships[0] || null,
          recentAttendances: member.attendances,
          recentPayments: member.payments,
          recentBookings: member.classBookings,
        },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /auth/google — 1-Click Instant Google Sign-In
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { email, name, picture } = req.body;
    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Google account email is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const ownerEmail = (process.env.OWNER_EMAIL || 'dynamitedhruvin@gmail.com').toLowerCase().trim();

    // If owner signs in with Google
    if (cleanEmail === ownerEmail) {
      const token = jwt.sign({ role: 'owner', email: cleanEmail }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({
        status: 'success',
        data: {
          token,
          role: 'owner',
          user: {
            name: name || 'Anytime Fitness Club Owner',
            email: cleanEmail,
            role: 'owner',
            picture: picture || null,
          },
        },
      });
    }

    // Look for existing member by email
    let member = await prisma.member.findUnique({
      where: { emailAddress: cleanEmail },
      include: {
        memberships: {
          orderBy: { endDate: 'desc' },
          take: 1,
          include: { plan: true },
        },
        attendances: {
          orderBy: { checkInTimestamp: 'desc' },
          take: 5,
        },
        payments: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
        classBookings: {
          orderBy: { bookingTimestamp: 'desc' },
          take: 5,
          include: { fitnessClass: true },
        },
      },
    });

    // If member does not exist, auto-create a profile from Google
    if (!member) {
      const newMember = await prisma.member.create({
        data: {
          fullName: name || 'Google Athlete',
          emailAddress: cleanEmail,
          contactNumber: '+9198765' + Math.floor(10000 + Math.random() * 90000),
          emergencyContact: '+919876500000',
          dateOfBirth: new Date('1998-01-01'),
          profilePhoto: picture || null,
          membershipStatus: 'Pending',
          joinDate: new Date(),
        },
      });

      member = await prisma.member.findUnique({
        where: { membershipID: newMember.membershipID },
        include: {
          memberships: {
            orderBy: { endDate: 'desc' },
            take: 1,
            include: { plan: true },
          },
          attendances: { take: 5 },
          payments: { take: 5 },
          classBookings: { take: 5, include: { fitnessClass: true } },
        },
      });
    }

    const token = jwt.sign(
      { role: 'member', membershipID: member!.membershipID, email: member!.emailAddress },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      status: 'success',
      data: {
        token,
        role: 'member',
        member: {
          membershipID: member!.membershipID,
          fullName: member!.fullName,
          emailAddress: member!.emailAddress,
          contactNumber: member!.contactNumber,
          membershipStatus: member!.membershipStatus,
          qrCodeIdentifier: member!.qrCodeIdentifier,
          joinDate: member!.joinDate,
          activeMembership: member!.memberships[0] || null,
          recentAttendances: member!.attendances,
          recentPayments: member!.payments,
          recentBookings: member!.classBookings,
          isNewGoogleUser: !member!.memberships.length,
        },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
