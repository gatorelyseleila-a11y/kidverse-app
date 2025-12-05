import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async checkIn(childId: string, checkedInBy: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.attendance.upsert({
      where: {
        childId_date: {
          childId,
          date: today,
        },
      },
      update: {
        checkInTime: new Date(),
        checkedInBy,
      },
      create: {
        childId,
        date: today,
        checkInTime: new Date(),
        checkedInBy,
        status: 'PRESENT',
      },
    });
  }

  async checkOut(childId: string, checkedOutBy: string, authorizedPickupId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.attendance.update({
      where: {
        childId_date: {
          childId,
          date: today,
        },
      },
      data: {
        checkOutTime: new Date(),
        checkedOutBy,
        authorizedPickupId,
      },
    });
  }

  async getTodayAttendance(centerId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.attendance.findMany({
      where: {
        date: today,
        child: { centerId },
      },
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            classroom: { select: { name: true } },
          },
        },
        authorizedPickup: true,
      },
      orderBy: { checkInTime: 'desc' },
    });
  }

  async getChildAttendanceHistory(childId: string, startDate: Date, endDate: Date) {
    return this.prisma.attendance.findMany({
      where: {
        childId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });
  }
}


