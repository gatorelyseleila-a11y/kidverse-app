import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateStaffDto,
  UpdateStaffDto,
  CreateQualificationDto,
  AssignClassroomDto,
  CreateScheduleDto,
  CreateTimeEntryDto,
  StaffFilterDto,
} from './dto/staff.dto';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupérer tous les membres du personnel avec filtres
   */
  async findAll(filters: StaffFilterDto) {
    return this.prisma.staff.findMany({
      where: {
        ...(filters.centerId && { centerId: filters.centerId }),
        ...(filters.position && { position: filters.position }),
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
        ...(filters.classroomId && {
          classrooms: { some: { classroomId: filters.classroomId } },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
            role: true,
          },
        },
        center: {
          select: { id: true, name: true },
        },
        classrooms: {
          include: {
            classroom: { select: { id: true, name: true, color: true } },
          },
        },
        qualifications: {
          orderBy: { issueDate: 'desc' },
        },
      },
      orderBy: [
        { isActive: 'desc' },
        { user: { lastName: 'asc' } },
      ],
    });
  }

  /**
   * Récupérer un membre du personnel par ID
   */
  async findById(id: string) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
            role: true,
            preferredLanguage: true,
            createdAt: true,
          },
        },
        center: true,
        classrooms: {
          include: {
            classroom: true,
          },
        },
        qualifications: {
          orderBy: { issueDate: 'desc' },
        },
        schedules: {
          where: { endDate: null },
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return staff;
  }

  /**
   * Récupérer un membre du personnel par User ID
   */
  async findByUserId(userId: string) {
    return this.prisma.staff.findUnique({
      where: { userId },
      include: {
        user: true,
        center: true,
        classrooms: {
          include: { classroom: true },
        },
      },
    });
  }

  /**
   * Créer un nouveau membre du personnel
   */
  async create(data: CreateStaffDto) {
    // Vérifier que l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Vérifier que l'utilisateur n'est pas déjà staff
    const existingStaff = await this.prisma.staff.findUnique({
      where: { userId: data.userId },
    });

    if (existingStaff) {
      throw new BadRequestException('User is already a staff member');
    }

    // Générer un numéro d'employé si non fourni
    let employeeNumber = data.employeeNumber;
    if (!employeeNumber) {
      const count = await this.prisma.staff.count();
      employeeNumber = `EMP-${String(count + 1).padStart(5, '0')}`;
    }

    return this.prisma.staff.create({
      data: {
        userId: data.userId,
        centerId: data.centerId,
        employeeNumber,
        position: data.position,
        hireDate: new Date(data.hireDate),
        hourlyRate: data.hourlyRate,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        center: { select: { id: true, name: true } },
      },
    });
  }

  /**
   * Mettre à jour un membre du personnel
   */
  async update(id: string, data: UpdateStaffDto) {
    await this.findById(id); // Vérifier l'existence

    return this.prisma.staff.update({
      where: { id },
      data: {
        ...(data.position && { position: data.position }),
        ...(data.hourlyRate !== undefined && { hourlyRate: data.hourlyRate }),
        ...(data.terminationDate && { terminationDate: new Date(data.terminationDate) }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  /**
   * Désactiver un membre du personnel
   */
  async deactivate(id: string) {
    await this.findById(id);

    return this.prisma.staff.update({
      where: { id },
      data: {
        isActive: false,
        terminationDate: new Date(),
      },
    });
  }

  /**
   * Supprimer un membre du personnel
   */
  async delete(id: string) {
    await this.findById(id);

    return this.prisma.staff.delete({
      where: { id },
    });
  }

  // ==========================================
  // QUALIFICATIONS
  // ==========================================

  /**
   * Ajouter une qualification
   */
  async addQualification(staffId: string, data: CreateQualificationDto) {
    await this.findById(staffId);

    return this.prisma.staffQualification.create({
      data: {
        staffId,
        qualificationType: data.qualificationType,
        name: data.name,
        issuer: data.issuer,
        issueDate: new Date(data.issueDate),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        documentUrl: data.documentUrl,
      },
    });
  }

  /**
   * Mettre à jour une qualification
   */
  async updateQualification(qualificationId: string, data: Partial<CreateQualificationDto>) {
    return this.prisma.staffQualification.update({
      where: { id: qualificationId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.issuer && { issuer: data.issuer }),
        ...(data.expiryDate && { expiryDate: new Date(data.expiryDate) }),
        ...(data.documentUrl && { documentUrl: data.documentUrl }),
      },
    });
  }

  /**
   * Vérifier une qualification
   */
  async verifyQualification(qualificationId: string) {
    return this.prisma.staffQualification.update({
      where: { id: qualificationId },
      data: { isVerified: true },
    });
  }

  /**
   * Supprimer une qualification
   */
  async removeQualification(qualificationId: string) {
    return this.prisma.staffQualification.delete({
      where: { id: qualificationId },
    });
  }

  /**
   * Récupérer les qualifications qui expirent bientôt
   */
  async getExpiringQualifications(centerId: string, daysAhead: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return this.prisma.staffQualification.findMany({
      where: {
        staff: { centerId },
        expiryDate: {
          lte: futureDate,
          gte: new Date(),
        },
      },
      include: {
        staff: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
      },
      orderBy: { expiryDate: 'asc' },
    });
  }

  // ==========================================
  // ASSIGNATIONS AUX SALLES
  // ==========================================

  /**
   * Assigner un membre du personnel à une salle
   */
  async assignToClassroom(staffId: string, data: AssignClassroomDto) {
    await this.findById(staffId);

    // Vérifier si déjà assigné
    const existing = await this.prisma.staffClassroom.findUnique({
      where: {
        staffId_classroomId: {
          staffId,
          classroomId: data.classroomId,
        },
      },
    });

    if (existing) {
      // Mettre à jour
      return this.prisma.staffClassroom.update({
        where: { id: existing.id },
        data: {
          isPrimary: data.isPrimary ?? false,
          endDate: null,
        },
      });
    }

    return this.prisma.staffClassroom.create({
      data: {
        staffId,
        classroomId: data.classroomId,
        isPrimary: data.isPrimary ?? false,
      },
    });
  }

  /**
   * Retirer un membre du personnel d'une salle
   */
  async removeFromClassroom(staffId: string, classroomId: string) {
    return this.prisma.staffClassroom.updateMany({
      where: { staffId, classroomId },
      data: { endDate: new Date() },
    });
  }

  /**
   * Récupérer le personnel d'une salle
   */
  async getClassroomStaff(classroomId: string) {
    return this.prisma.staffClassroom.findMany({
      where: {
        classroomId,
        endDate: null,
        staff: { isActive: true },
      },
      include: {
        staff: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  // ==========================================
  // HORAIRES
  // ==========================================

  /**
   * Définir l'horaire d'un membre du personnel
   */
  async setSchedule(staffId: string, schedules: CreateScheduleDto[]) {
    await this.findById(staffId);

    // Supprimer les anciens horaires
    await this.prisma.staffSchedule.deleteMany({
      where: { staffId, endDate: null },
    });

    // Créer les nouveaux
    return this.prisma.staffSchedule.createMany({
      data: schedules.map((schedule) => ({
        staffId,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isRecurring: schedule.isRecurring ?? true,
        endDate: schedule.endDate ? new Date(schedule.endDate) : null,
      })),
    });
  }

  /**
   * Récupérer l'horaire d'un membre du personnel
   */
  async getSchedule(staffId: string) {
    return this.prisma.staffSchedule.findMany({
      where: { staffId, endDate: null },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  // ==========================================
  // POINTAGE
  // ==========================================

  /**
   * Enregistrer une entrée de temps
   */
  async createTimeEntry(staffId: string, data: CreateTimeEntryDto) {
    await this.findById(staffId);

    return this.prisma.timeEntry.create({
      data: {
        staffId,
        date: new Date(data.date),
        clockIn: new Date(data.clockIn),
        clockOut: data.clockOut ? new Date(data.clockOut) : null,
        breakMinutes: data.breakMinutes ?? 0,
        notes: data.notes,
      },
    });
  }

  /**
   * Enregistrer le départ (clock out)
   */
  async clockOut(timeEntryId: string, clockOutTime?: Date) {
    return this.prisma.timeEntry.update({
      where: { id: timeEntryId },
      data: {
        clockOut: clockOutTime || new Date(),
      },
    });
  }

  /**
   * Récupérer les entrées de temps
   */
  async getTimeEntries(staffId: string, startDate: Date, endDate: Date) {
    return this.prisma.timeEntry.findMany({
      where: {
        staffId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Approuver une entrée de temps
   */
  async approveTimeEntry(timeEntryId: string) {
    return this.prisma.timeEntry.update({
      where: { id: timeEntryId },
      data: { isApproved: true },
    });
  }

  /**
   * Calculer les heures travaillées sur une période
   */
  async calculateHoursWorked(staffId: string, startDate: Date, endDate: Date) {
    const entries = await this.getTimeEntries(staffId, startDate, endDate);

    let totalMinutes = 0;

    for (const entry of entries) {
      if (entry.clockIn && entry.clockOut) {
        const worked = (entry.clockOut.getTime() - entry.clockIn.getTime()) / 60000;
        totalMinutes += worked - (entry.breakMinutes || 0);
      }
    }

    const staff = await this.findById(staffId);
    const hourlyRate = staff.hourlyRate ? Number(staff.hourlyRate) : 0;

    return {
      totalHours: Math.round(totalMinutes / 60 * 100) / 100,
      totalMinutes: Math.round(totalMinutes),
      entriesCount: entries.length,
      estimatedPay: Math.round((totalMinutes / 60) * hourlyRate * 100) / 100,
    };
  }

  // ==========================================
  // RATIOS ET CONFORMITÉ
  // ==========================================

  /**
   * Vérifier les ratios éducateur/enfants
   */
  async checkStaffRatios(centerId: string) {
    const classrooms = await this.prisma.classroom.findMany({
      where: { centerId, isActive: true },
      include: {
        children: {
          where: { status: 'ACTIVE' },
        },
        staffAssignments: {
          where: {
            endDate: null,
            staff: { isActive: true },
          },
        },
      },
    });

    return classrooms.map((classroom) => {
      const childCount = classroom.children.length;
      const staffCount = classroom.staffAssignments.length;

      // Ratios légaux au Québec (approximatifs)
      let requiredRatio: number;
      if (classroom.ageGroupMax <= 18) {
        requiredRatio = 5; // 1:5 pour poupons
      } else if (classroom.ageGroupMax <= 36) {
        requiredRatio = 8; // 1:8 pour 18-36 mois
      } else {
        requiredRatio = 10; // 1:10 pour 3+ ans
      }

      const requiredStaff = Math.ceil(childCount / requiredRatio);
      const isCompliant = staffCount >= requiredStaff;

      return {
        classroom: {
          id: classroom.id,
          name: classroom.name,
          ageGroup: `${classroom.ageGroupMin}-${classroom.ageGroupMax} mois`,
        },
        childCount,
        staffCount,
        requiredStaff,
        isCompliant,
        ratio: staffCount > 0 ? `1:${Math.round(childCount / staffCount)}` : 'N/A',
      };
    });
  }
}
