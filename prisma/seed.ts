import { PrismaClient, MembershipStatus, PaymentPurpose, PaymentStatus, BookingStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

  console.log('--- Seeding Anytime Fitness Membership Plans ---');

  // 1. 1-Month Flex Pass
  const plan1Month = await prisma.membershipPlan.create({
    data: {
      name: '1-Month Anytime Flex Pass',
      durationDays: 30,
      price: 2499.0,
      featureEntitlements: [
        '24/7 Unlimited Club Access',
        'Cardio & Functional Turf Rig',
        'Free Weights & Machine Zone',
        'Anytime Fitness Mobile App Access',
        'Private Shower & Locker Facilities',
      ],
      activeStatus: true,
    },
  });

  // 2. 3-Month Transformation Pass
  const plan3Month = await prisma.membershipPlan.create({
    data: {
      name: '3-Month Body Transformation',
      durationDays: 90,
      price: 6499.0,
      featureEntitlements: [
        '24/7 Global Club Access (5,000+ Clubs)',
        'Unlimited Group Fitness Classes (Spin, HIIT, Yoga)',
        'Complimentary Fitness Assessment & Body Scan',
        'Dedicated Trainer Goal-Setting Session',
        'High-Speed Shower & Steam Amenities',
      ],
      activeStatus: true,
    },
  });

  // 3. 6-Month Performance Elite Pass
  const plan6Month = await prisma.membershipPlan.create({
    data: {
      name: '6-Month Performance Elite',
      durationDays: 180,
      price: 10999.0,
      featureEntitlements: [
        '24/7 Worldwide Access Network',
        'All Group Fitness & Strength Classes',
        '2 Complimentary 1-on-1 Personal Training Sessions',
        'Custom Nutrition & Workout Guidance',
        'Sauna, Cold Towels & Wellness Lounge',
        '10% Pro-Shop & Supplement Discount',
      ],
      activeStatus: true,
    },
  });

  // 4. 12-Month Anytime All-Access (Annual Champion)
  const premiumPlan = await prisma.membershipPlan.create({
    data: {
      name: '12-Month Anytime All-Access (Best Value)',
      durationDays: 365,
      price: 18999.0,
      featureEntitlements: [
        '24/7 Global Access Worldwide (Unlimited)',
        'VIP Priority Class Reservations',
        '4 Complimentary Personal Training Sessions',
        'Free Monthly Guest Passes (2/month)',
        'Full Recovery, Sauna & Steam Suite',
        'Digital Workout Tracking & Heart Rate Sync',
        'Save 40% vs Monthly Rates',
      ],
      activeStatus: true,
    },
  });

  console.log(`Created 4 Plans:
  - ${plan1Month.name} (₹${plan1Month.price})
  - ${plan3Month.name} (₹${plan3Month.price})
  - ${plan6Month.name} (₹${plan6Month.price})
  - ${premiumPlan.name} (₹${premiumPlan.price})`);

  console.log('--- Seeding Group Fitness Classes ---');
  const now = Date.now();

  // Spinning Class (Capacity: 2, 1 Current Booking for exact spec test compatibility)
  const classSchedule = new Date(now + 4 * 60 * 60 * 1000);
  const spinningClass = await prisma.fitnessClass.create({
    data: {
      name: 'High Intensity Spinning',
      category: 'Cardio',
      trainerID: 'TR-101-ELENA-ROSTOVA',
      schedule: classSchedule,
      durationMinutes: 45,
      capacity: 2,
      currentBookings: 1,
      isRecurring: true,
      weeklyPattern: 'Mon, Wed, Fri 07:00',
    },
  });

  // HIIT Ignition
  const hiitClass = await prisma.fitnessClass.create({
    data: {
      name: 'HIIT Ignition & Metabolic Burn',
      category: 'HIIT',
      trainerID: 'TR-102-MARCUS-VANCE',
      schedule: new Date(now + 6 * 60 * 60 * 1000),
      durationMinutes: 50,
      capacity: 15,
      currentBookings: 8,
      isRecurring: true,
      weeklyPattern: 'Tue, Thu, Sat 08:30',
    },
  });

  // Anytime Vinyasa Yoga
  const yogaClass = await prisma.fitnessClass.create({
    data: {
      name: 'Anytime Power Vinyasa Yoga',
      category: 'Mind & Body',
      trainerID: 'TR-103-PRIYA-SHARMA',
      schedule: new Date(now + 8 * 60 * 60 * 1000),
      durationMinutes: 60,
      capacity: 20,
      currentBookings: 14,
      isRecurring: true,
      weeklyPattern: 'Daily 06:30 & 18:30',
    },
  });

  // Heavy Bag Boxing & Conditioning
  const boxingClass = await prisma.fitnessClass.create({
    data: {
      name: 'Anytime Boxing & Strike Conditioning',
      category: 'Cardio',
      trainerID: 'TR-104-TYSON-COLE',
      schedule: new Date(now + 10 * 60 * 60 * 1000),
      durationMinutes: 45,
      capacity: 12,
      currentBookings: 5,
      isRecurring: true,
      weeklyPattern: 'Mon, Wed 19:00',
    },
  });

  console.log(`Created 4 Classes:
  - ${spinningClass.name} (Capacity: 2, Booked: 1)
  - ${hiitClass.name} (Capacity: 15, Booked: 8)
  - ${yogaClass.name} (Capacity: 20, Booked: 14)
  - ${boxingClass.name} (Capacity: 12, Booked: 5)`);

  console.log('--- Seeding Members ---');
  const defaultPasswordHash = bcrypt.hashSync('Anytime@2026', 10);

  // Member 1: Alice Johnson (Active, booked in Spinning)
  const member1 = await prisma.member.create({
    data: {
      fullName: 'Alice Johnson',
      dateOfBirth: new Date('1995-04-12'),
      contactNumber: '+919876543210',
      emailAddress: 'alice.johnson@example.com',
      emergencyContact: '+919876543211',
      qrCodeIdentifier: 'AF-QR-ALICE001',
      membershipStatus: MembershipStatus.Active,
      joinDate: new Date('2026-01-10'),
      passwordHash: defaultPasswordHash,
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
      transactionReferenceNumber: 'TXN-AF-ALICE-01',
    },
  });

  // Booking for Alice (occupying seat 1 of 2 in spinning)
  await prisma.classBooking.create({
    data: {
      membershipID: member1.membershipID,
      classID: spinningClass.classID,
      status: BookingStatus.Booked,
      bookingTimestamp: new Date(),
    },
  });

  // Member 2: Bob Smith (Active on 3-Month Plan)
  const member2 = await prisma.member.create({
    data: {
      fullName: 'Bob Smith',
      dateOfBirth: new Date('1992-08-23'),
      contactNumber: '+919876543220',
      emailAddress: 'bob.smith@example.com',
      emergencyContact: '+919876543221',
      qrCodeIdentifier: 'AF-QR-BOB002',
      membershipStatus: MembershipStatus.Active,
      joinDate: new Date('2026-02-15'),
      passwordHash: defaultPasswordHash,
    },
  });

  const member2End = new Date();
  member2End.setDate(member2End.getDate() + 90);

  await prisma.membership.create({
    data: {
      membershipID: member2.membershipID,
      planID: plan3Month.planID,
      startDate: member1Start,
      endDate: member2End,
      status: MembershipStatus.Active,
      autoRenewFlag: false,
    },
  });

  await prisma.payment.create({
    data: {
      membershipID: member2.membershipID,
      amount: plan3Month.price,
      paymentMethod: 'UPI',
      paymentPurpose: PaymentPurpose.Registration,
      status: PaymentStatus.Success,
      transactionReferenceNumber: 'TXN-AF-BOB-02',
    },
  });

  // Member 3: Charlie Expired
  const expiredPast = new Date();
  expiredPast.setDate(expiredPast.getDate() - 60);

  const member3 = await prisma.member.create({
    data: {
      fullName: 'Charlie Davis',
      dateOfBirth: new Date('1988-11-05'),
      contactNumber: '+919876543230',
      emailAddress: 'charlie.davis@example.com',
      emergencyContact: '+919876543231',
      qrCodeIdentifier: 'AF-QR-CHARLIE003',
      membershipStatus: MembershipStatus.Expired,
      joinDate: new Date('2025-01-01'),
      passwordHash: defaultPasswordHash,
    },
  });

  await prisma.membership.create({
    data: {
      membershipID: member3.membershipID,
      planID: plan1Month.planID,
      startDate: new Date('2025-01-01'),
      endDate: expiredPast,
      status: MembershipStatus.Expired,
      autoRenewFlag: false,
    },
  });

  console.log(`Created 3 Members:
  - Alice Johnson (${member1.membershipID}) -> Active (Annual)
  - Bob Smith (${member2.membershipID}) -> Active (3-Month)
  - Charlie Davis (${member3.membershipID}) -> Expired (1-Month)`);

  console.log('--- Anytime Fitness Seed Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
