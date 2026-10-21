import { PrismaClient, MembershipStatus, PaymentPurpose, PaymentStatus, BookingStatus, NotificationChannel, DeliveryStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning previous seed data ---');
  await prisma.attendance.deleteMany();
  await prisma.classBooking.deleteMany();
  await prisma.fitnessClass.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.member.deleteMany();
  await prisma.membershipPlan.deleteMany();

  console.log('--- Seeding Membership Plan ---');
  const premiumPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Annual Premium Fitness Plan',
      durationDays: 365,
      price: 12000.0,
      featureEntitlements: [
        'All-Access Gym Floor',
        'Locker & Sauna Facilities',
        'Unlimited Group Fitness Classes',
        'Complimentary Fitness Assessment',
      ],
      activeStatus: true,
    },
  });
  console.log(`Created Plan: ${premiumPlan.name} (ID: ${premiumPlan.planID})`);

  console.log('--- Seeding Fitness Class (Near Capacity: Capacity 2, 1 Current Booking) ---');
  // Schedule class 4 hours in the future
  const classSchedule = new Date(Date.now() + 4 * 60 * 60 * 1000);
  const spinningClass = await prisma.fitnessClass.create({
    data: {
      name: 'High Intensity Spinning',
      category: 'Cardio',
      trainerID: 'TR-101-JOHN-DOE',
      schedule: classSchedule,
      durationMinutes: 45,
      capacity: 2,
      currentBookings: 1,
      isRecurring: true,
      weeklyPattern: 'Mon, Wed, Fri 07:00',
    },
  });
  console.log(
    `Created Fitness Class: ${spinningClass.name} (Capacity: ${spinningClass.capacity}, Current Bookings: ${spinningClass.currentBookings}, ID: ${spinningClass.classID})`
  );

  console.log('--- Seeding Members ---');
  // Member 1: Active member with initial booking filling 1 seat
  const member1 = await prisma.member.create({
    data: {
      fullName: 'Alice Johnson',
      dateOfBirth: new Date('1995-04-12'),
      contactNumber: '+919876543210',
      emailAddress: 'alice.johnson@example.com',
      emergencyContact: '+919876543211',
      qrCodeIdentifier: 'GFMMS-QR-ALICE001',
      membershipStatus: MembershipStatus.Active,
      joinDate: new Date('2026-01-10'),
    },
  });

  const member1Start = new Date();
  const member1End = new Date();
  member1End.setDate(member1End.getDate() + 365);

  await prisma.membership.create({
    data: {
      membershipID: member1.membershipID,
      planID: premiumPlan.planID,
      startDate: member1Start,
      endDate: member1End,
      status: MembershipStatus.Active,
      autoRenewFlag: true,
    },
  });

  await prisma.payment.create({
    data: {
      membershipID: member1.membershipID,
      amount: premiumPlan.price,
      paymentMethod: 'CreditCard',
      paymentPurpose: PaymentPurpose.Registration,
      status: PaymentStatus.Success,
      transactionReferenceNumber: 'TXN-SEED-ALICE-01',
    },
  });

  // Booking for Alice (occupying seat 1 of 2)
  await prisma.classBooking.create({
    data: {
      membershipID: member1.membershipID,
      classID: spinningClass.classID,
      status: BookingStatus.Booked,
      bookingTimestamp: new Date(),
    },
  });

  console.log(`Created Active Member 1: ${member1.fullName} (ID: ${member1.membershipID}, Seat Booked in Spinning)`);

  // Member 2: Active member ready to book the remaining seat or check in
  const member2 = await prisma.member.create({
    data: {
      fullName: 'Bob Smith',
      dateOfBirth: new Date('1992-08-23'),
      contactNumber: '+919876543220',
      emailAddress: 'bob.smith@example.com',
      emergencyContact: '+919876543221',
      qrCodeIdentifier: 'GFMMS-QR-BOB002',
      membershipStatus: MembershipStatus.Active,
      joinDate: new Date('2026-02-15'),
    },
  });

  await prisma.membership.create({
    data: {
      membershipID: member2.membershipID,
      planID: premiumPlan.planID,
      startDate: member1Start,
      endDate: member1End,
      status: MembershipStatus.Active,
      autoRenewFlag: false,
    },
  });

  await prisma.payment.create({
    data: {
      membershipID: member2.membershipID,
      amount: premiumPlan.price,
      paymentMethod: 'UPI',
      paymentPurpose: PaymentPurpose.Registration,
      status: PaymentStatus.Success,
      transactionReferenceNumber: 'TXN-SEED-BOB-02',
    },
  });

  console.log(`Created Active Member 2: ${member2.fullName} (ID: ${member2.membershipID})`);

  // Member 3: Expired Member (for testing/demoing check-in denial)
  const expiredPast = new Date();
  expiredPast.setDate(expiredPast.getDate() - 60);
  const member3 = await prisma.member.create({
    data: {
      fullName: 'Charlie Expired',
      dateOfBirth: new Date('1988-11-05'),
      contactNumber: '+919876543230',
      emailAddress: 'charlie.expired@example.com',
      emergencyContact: '+919876543231',
      qrCodeIdentifier: 'GFMMS-QR-CHARLIE003',
      membershipStatus: MembershipStatus.Expired,
      joinDate: new Date('2025-01-01'),
    },
  });

  await prisma.membership.create({
    data: {
      membershipID: member3.membershipID,
      planID: premiumPlan.planID,
      startDate: new Date('2025-01-01'),
      endDate: expiredPast,
      status: MembershipStatus.Expired,
      autoRenewFlag: false,
    },
  });

  console.log(`Created Expired Member 3: ${member3.fullName} (ID: ${member3.membershipID})`);

  console.log('--- Seed Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
