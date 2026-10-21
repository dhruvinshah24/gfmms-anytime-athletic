import prisma from '../config/db';
import { Prisma } from '@prisma/client';

export interface CreatePlanDTO {
  name: string;
  durationDays: number;
  price: number;
  featureEntitlements: string[];
  activeStatus?: boolean;
}

export class MembershipPlanService {
  /**
   * MembershipPlan.activate()
   * Activates a membership plan so it becomes available for new registrations and renewals.
   */
  async activate(planID: string) {
    return prisma.membershipPlan.update({
      where: { planID },
      data: { activeStatus: true },
    });
  }

  /**
   * MembershipPlan.deactivate()
   * Deactivates a membership plan.
   */
  async deactivate(planID: string) {
    return prisma.membershipPlan.update({
      where: { planID },
      data: { activeStatus: false },
    });
  }

  /**
   * MembershipPlan.updatePrice()
   * Updates the price of an existing plan.
   */
  async updatePrice(planID: string, newPrice: number) {
    if (newPrice < 0) {
      throw new Error('Price cannot be negative');
    }
    return prisma.membershipPlan.update({
      where: { planID },
      data: { price: new Prisma.Decimal(newPrice) },
    });
  }

  /**
   * System query: availablePlans()
   * Retrieves all active membership plans.
   */
  async getAvailablePlans() {
    return prisma.membershipPlan.findMany({
      where: { activeStatus: true },
    });
  }

  /**
   * Helper: get plan by ID
   */
  async getPlanById(planID: string) {
    return prisma.membershipPlan.findUnique({
      where: { planID },
    });
  }

  /**
   * Helper: create a plan (used by admin and seed script)
   */
  async createPlan(dto: CreatePlanDTO) {
    return prisma.membershipPlan.create({
      data: {
        name: dto.name,
        durationDays: dto.durationDays,
        price: new Prisma.Decimal(dto.price),
        featureEntitlements: dto.featureEntitlements,
        activeStatus: dto.activeStatus ?? true,
      },
    });
  }
}

export const membershipPlanService = new MembershipPlanService();
