import prisma from '../config/db';
import { PaymentPurpose, PaymentStatus, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export interface ProcessPaymentDTO {
  membershipID: string;
  amount: number | Prisma.Decimal;
  paymentMethod: string;
  paymentPurpose: PaymentPurpose;
  failPayment?: boolean;
}

export interface RecordManualDTO {
  membershipID: string;
  amount: number | Prisma.Decimal;
  paymentMethod: string;
  paymentPurpose: PaymentPurpose;
  transactionReferenceNumber?: string;
}

export class PaymentService {
  /**
   * Payment.processOnline()
   * Processes online payments through integrated payment gateway (credit card, debit card, UPI).
   * Supports failure simulation for testing.
   */
  async processOnline(dto: ProcessPaymentDTO) {
    const isFailed = dto.failPayment === true || dto.paymentMethod.toUpperCase() === 'FAIL';
    const status = isFailed ? PaymentStatus.Failed : PaymentStatus.Success;
    const transactionRef = `TXN-ONL-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        membershipID: dto.membershipID,
        amount: new Prisma.Decimal(dto.amount),
        paymentMethod: dto.paymentMethod,
        paymentPurpose: dto.paymentPurpose,
        status: status,
        timestamp: new Date(),
        transactionReferenceNumber: transactionRef,
      },
    });

    return payment;
  }

  /**
   * Payment.recordManual()
   * Records cash or card payments collected at the front desk by Receptionist.
   */
  async recordManual(dto: RecordManualDTO) {
    const transactionRef =
      dto.transactionReferenceNumber ||
      `TXN-MAN-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        membershipID: dto.membershipID,
        amount: new Prisma.Decimal(dto.amount),
        paymentMethod: dto.paymentMethod,
        paymentPurpose: dto.paymentPurpose,
        status: PaymentStatus.Success,
        timestamp: new Date(),
        transactionReferenceNumber: transactionRef,
      },
    });

    return payment;
  }

  /**
   * Payment.generateReceipt()
   * Generates a digital receipt for a completed payment.
   */
  async generateReceipt(paymentID: string) {
    const payment = await prisma.payment.findUnique({
      where: { paymentID },
      include: {
        member: {
          select: {
            fullName: true,
            emailAddress: true,
            contactNumber: true,
          },
        },
      },
    });

    if (!payment) {
      throw new Error(`Payment ${paymentID} not found`);
    }

    return {
      receiptNumber: `REC-${payment.paymentID.substring(0, 8).toUpperCase()}`,
      paymentID: payment.paymentID,
      transactionReference: payment.transactionReferenceNumber,
      member: payment.member,
      amountPaid: payment.amount,
      paymentMethod: payment.paymentMethod,
      purpose: payment.paymentPurpose,
      status: payment.status,
      timestamp: payment.timestamp,
    };
  }

  /**
   * Payment.generateInvoice()
   * Generates a downloadable invoice structure with applicable tax details.
   */
  async generateInvoice(paymentID: string) {
    const payment = await prisma.payment.findUnique({
      where: { paymentID },
      include: {
        member: {
          select: {
            fullName: true,
            emailAddress: true,
            contactNumber: true,
          },
        },
      },
    });

    if (!payment) {
      throw new Error(`Payment ${paymentID} not found`);
    }

    const baseAmount = Number(payment.amount);
    const taxRate = 0.18; // 18% GST / applicable tax
    const taxableAmount = +(baseAmount / (1 + taxRate)).toFixed(2);
    const taxAmount = +(baseAmount - taxableAmount).toFixed(2);

    return {
      invoiceNumber: `INV-${payment.paymentID.substring(0, 8).toUpperCase()}`,
      invoiceDate: payment.timestamp,
      paymentID: payment.paymentID,
      billedTo: payment.member,
      subtotal: taxableAmount,
      taxRate: '18% GST',
      taxAmount: taxAmount,
      totalAmount: baseAmount,
      currency: 'INR',
      paymentStatus: payment.status,
      transactionReference: payment.transactionReferenceNumber,
    };
  }

  /**
   * Payment.refund()
   * Processes a refund against a completed payment with a required reason code.
   */
  async refund(paymentID: string, reasonCode: string) {
    if (!reasonCode || reasonCode.trim() === '') {
      throw new Error('Refund requires a valid reason code');
    }

    const payment = await prisma.payment.findUnique({
      where: { paymentID },
    });

    if (!payment) {
      throw new Error(`Payment ${paymentID} not found`);
    }

    if (payment.status !== PaymentStatus.Success) {
      throw new Error('Only successful payments can be refunded');
    }

    // Create a refund payment record representing the reversal
    const refundRecord = await prisma.payment.create({
      data: {
        membershipID: payment.membershipID,
        amount: new Prisma.Decimal(-Number(payment.amount)),
        paymentMethod: payment.paymentMethod,
        paymentPurpose: payment.paymentPurpose,
        status: PaymentStatus.Success,
        timestamp: new Date(),
        transactionReferenceNumber: `REF-${reasonCode}-${payment.transactionReferenceNumber}`,
      },
    });

    return refundRecord;
  }
  /**
   * Helper: list all payments
   */
  async listPayments() {
    return prisma.payment.findMany({
      orderBy: { timestamp: 'desc' },
      include: {
        member: {
          select: {
            fullName: true,
            emailAddress: true,
          },
        },
      },
    });
  }
}

export const paymentService = new PaymentService();
