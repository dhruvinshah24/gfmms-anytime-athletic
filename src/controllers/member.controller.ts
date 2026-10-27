import { Request, Response } from 'express';
import { memberService } from '../services/member.service';

export class MemberController {
  async register(req: Request, res: Response) {
    try {
      const result = await memberService.register(req.body);
      if (!result.success) {
        return res.status(400).json({
          status: 'error',
          code: (result as any).code || 'REGISTRATION_FAILED',
          registrationIncomplete: result.registrationIncomplete,
          failureReason: result.displayFailureReason,
          details: result,
        });
      }
      return res.status(201).json({
        status: 'success',
        message: 'Member registered successfully and membership activated',
        data: result,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({
          status: 'error',
          code: 'DUPLICATE_ENTRY',
          registrationIncomplete: true,
          failureReason:
            'An athlete account with this email address or contact number is already registered. Please sign in to access your pass.',
        });
      }
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error during registration',
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const membershipID = req.params.id;
      const result = await memberService.login(membershipID, req.body);
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      return res.status(401).json({
        status: 'error',
        message: error.message || 'Authentication failed',
      });
    }
  }

  async listMembers(req: Request, res: Response) {
    try {
      const members = await memberService.listMembers();
      return res.status(200).json({ status: 'success', data: members });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getMember(req: Request, res: Response) {
    try {
      const member = await memberService.getMemberById(req.params.id);
      if (!member) {
        return res.status(404).json({ status: 'error', message: 'Member not found' });
      }
      return res.status(200).json({ status: 'success', data: member });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export const memberController = new MemberController();
