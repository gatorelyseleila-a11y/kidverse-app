import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CentersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.center.findMany({
      include: {
        _count: {
          select: {
            children: true,
            staff: true,
            classrooms: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const center = await this.prisma.center.findUnique({
      where: { id },
      include: {
        classrooms: true,
        licenses: true,
        _count: {
          select: {
            children: true,
            staff: true,
          },
        },
      },
    });

    if (!center) {
      throw new NotFoundException('Center not found');
    }

    return center;
  }

  async create(data: {
    name: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
    email: string;
    capacity: number;
    openingTime?: string;
    closingTime?: string;
  }) {
    return this.prisma.center.create({ data });
  }

  async update(id: string, data: Partial<{
    name: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    phone: string;
    email: string;
    capacity: number;
    openingTime: string;
    closingTime: string;
    isActive: boolean;
  }>) {
    return this.prisma.center.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.center.delete({
      where: { id },
    });
  }

  async getStats(id: string) {
    const center = await this.findById(id);
    
    const [childrenCount, staffCount, todayAttendance] = await Promise.all([
      this.prisma.child.count({ where: { centerId: id, status: 'ACTIVE' } }),
      this.prisma.staff.count({ where: { centerId: id, isActive: true } }),
      this.prisma.attendance.count({
        where: {
          child: { centerId: id },
          date: new Date(),
          checkInTime: { not: null },
          checkOutTime: null,
        },
      }),
    ]);

    return {
      center,
      stats: {
        totalChildren: childrenCount,
        totalStaff: staffCount,
        presentToday: todayAttendance,
        occupancyRate: center.capacity > 0 
          ? Math.round((todayAttendance / center.capacity) * 100) 
          : 0,
      },
    };
  }
}


