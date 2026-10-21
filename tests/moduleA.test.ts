import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/db';
import { MembershipStatus, PaymentStatus } from '@prisma/client';

describe('Module A: Member Registration & Membership Management', () => {
  let activePlanId: string;
  let inactivePlanId: string;

  beforeAll(async () => {
    // Clean test database tables
    await prisma.attendance.deleteMany();
    await prisma.classBooking.deleteMany();
    await prisma.fitnessClass.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.member.deleteMany();
    await prisma.membershipPlan.deleteMany();

    // Create an active plan
    const plan = await prisma.membershipPlan.create({
      data: {
        name: 'Standard Monthly Plan',
        durationDays: 30,
        price: 2500.0,
        featureEntitlements: ['Gym Floor', 'Locker Room'],
        activeStatus: true,
      },
    });
    activePlanId = plan.planID;

    // Create an inactive plan
    const inactivePlan = await prisma.membershipPlan.create({
      data: {
        name: 'Discontinued Promo Plan',
        durationDays: 15,
        price: 1000.0,
        featureEntitlements: ['Gym Floor'],
        activeStatus: false,
      },
    });
    inactivePlanId = inactivePlan.planID;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Scenario 1: Register with valid details + successful payment
  it('should register with valid details + successful payment -> membership Active, QR generated, welcome notification logged', async () => {
    const registerPayload = {
      fullName: 'Vikram Malhotra',
      dateOfBirth: '1998-05-20',
      contactNumber: '+919123456789',
      emailAddress: 'vikram.malhotra@test.com',
      emergencyContact: '+919123456780',
      planID: activePlanId,
      paymentMethod: 'CreditCard',
    };

    const res = await request(app)
      .post('/members/register')
      .send(registerPayload)
      .expect(201);

    expect(res.body.status).toBe('success');
    expect(res.body.data.member.membershipStatus).toBe(MembershipStatus.Active);
    expect(res.body.data.qrCodeIdentifier).toBeDefined();
    expect(res.body.data.qrCodeIdentifier).toContain('GFMMS-QR-');
    expect(res.body.data.membership.status).toBe(MembershipStatus.Active);
    expect(res.body.data.payment.status).toBe(PaymentStatus.Success);

    // Verify WelcomeEmail notification logged in database
    const notification = await prisma.notification.findFirst({
      where: {
        recipientID: res.body.data.member.membershipID,
        category: 'WelcomeEmail',
      },
    });
    expect(notification).not.toBeNull();
    expect(notification?.content).toContain(res.body.data.qrCodeIdentifier);
  });

  // Scenario 2: Register with payment failure
  it('should register with payment failure -> no Active membership created, failure reason returned', async () => {
    const failedPayload = {
      fullName: 'Rahul Sharma',
      dateOfBirth: '1996-10-15',
      contactNumber: '+919988776655',
      emailAddress: 'rahul.failed@test.com',
      emergencyContact: '+919988776650',
      planID: activePlanId,
      paymentMethod: 'FAIL', // Triggers simulated payment failure
    };

    const res = await request(app)
      .post('/members/register')
      .send(failedPayload)
      .expect(400);

    expect(res.body.status).toBe('error');
    expect(res.body.registrationIncomplete).toBe(true);
    expect(res.body.failureReason).toContain('Payment processing failed');

    // Confirm that no Active member exists with this email
    const memberInDb = await prisma.member.findUnique({
      where: { emailAddress: 'rahul.failed@test.com' },
      include: { memberships: true },
    });
    expect(memberInDb?.membershipStatus).not.toBe(MembershipStatus.Active);
    expect(memberInDb?.membershipStatus).toBe(MembershipStatus.Cancelled);
    expect(memberInDb?.memberships[0].status).toBe(MembershipStatus.Cancelled);
  });

  // Additional Module A operation tests
  it('should allow member to login with membershipID', async () => {
    const member = await prisma.member.findUnique({
      where: { emailAddress: 'vikram.malhotra@test.com' },
    });

    const res = await request(app)
      .post(`/members/${member?.membershipID}/login`)
      .send({ emailAddress: 'vikram.malhotra@test.com' })
      .expect(200);

    expect(res.body.status).toBe('success');
    expect(res.body.data.authenticated).toBe(true);
    expect(res.body.data.member.membershipID).toBe(member?.membershipID);
  });

  it('should manage membership plans (activate, deactivate, updatePrice)', async () => {
    // Update price
    const priceRes = await request(app)
      .patch(`/plans/${activePlanId}/price`)
      .send({ price: 3000 })
      .expect(200);
    expect(Number(priceRes.body.data.price)).toBe(3000);

    // Deactivate
    const deactRes = await request(app)
      .patch(`/plans/${activePlanId}/deactivate`)
      .expect(200);
    expect(deactRes.body.data.activeStatus).toBe(false);

    // Reactivate
    const actRes = await request(app)
      .patch(`/plans/${activePlanId}/activate`)
      .expect(200);
    expect(actRes.body.data.activeStatus).toBe(true);
  });

  it('should process payments, generate receipt, invoice and refund', async () => {
    const member = await prisma.member.findUnique({
      where: { emailAddress: 'vikram.malhotra@test.com' },
    });

    // Record manual payment
    const manualPayment = await request(app)
      .post('/payments/manual')
      .send({
        membershipID: member?.membershipID,
        amount: 1500,
        paymentMethod: 'Cash',
        paymentPurpose: 'Renewal',
      })
      .expect(201);

    const paymentId = manualPayment.body.data.paymentID;

    // Generate receipt
    const receiptRes = await request(app)
      .get(`/payments/${paymentId}/receipt`)
      .expect(200);
    expect(receiptRes.body.data.receiptNumber).toBeDefined();

    // Generate invoice
    const invoiceRes = await request(app)
      .get(`/payments/${paymentId}/invoice`)
      .expect(200);
    expect(invoiceRes.body.data.taxRate).toBe('18% GST');

    // Refund
    const refundRes = await request(app)
      .post(`/payments/${paymentId}/refund`)
      .send({ reasonCode: 'CUSTOMER_REQUEST' })
      .expect(200);
    expect(Number(refundRes.body.data.amount)).toBe(-1500);
  });
});
