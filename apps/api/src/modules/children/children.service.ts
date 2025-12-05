import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ChildStatus, AllergySeverity, Gender } from '@prisma/client';

@Injectable()
export class ChildrenService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options?: { 
    centerId?: string; 
    classroomId?: string;
    status?: ChildStatus;
    parentId?: string;
  }) {
    return this.prisma.child.findMany({
      where: {
        ...(options?.centerId && { centerId: options.centerId }),
        ...(options?.classroomId && { classroomId: options.classroomId }),
        ...(options?.status && { status: options.status }),
        ...(options?.parentId && {
          parents: { some: { parentId: options.parentId } },
        }),
      },
      include: {
        classroom: { select: { id: true, name: true } },
        parents: {
          include: {
            parent: {
              select: { id: true, firstName: true, lastName: true, phone: true },
            },
          },
        },
        allergies: true,
      },
      orderBy: { lastName: 'asc' },
    });
  }

  async findById(id: string) {
    const child = await this.prisma.child.findUnique({
      where: { id },
      include: {
        center: { select: { id: true, name: true } },
        classroom: true,
        parents: {
          include: {
            parent: {
              select: { 
                id: true, 
                email: true, 
                firstName: true, 
                lastName: true, 
                phone: true,
              },
            },
          },
        },
        emergencyContacts: true,
        allergies: true,
        medications: true,
        vaccinations: true,
        authorizedPickups: true,
      },
    });

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    return child;
  }

  async create(data: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: Gender;
    centerId: string;
    classroomId?: string;
    enrollmentDate?: Date;
    photoUrl?: string;
    notes?: string;
  }) {
    return this.prisma.child.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        enrollmentDate: data.enrollmentDate || new Date(),
        status: ChildStatus.ACTIVE,
        photoUrl: data.photoUrl,
        notes: data.notes,
        center: { connect: { id: data.centerId } },
        ...(data.classroomId && { classroom: { connect: { id: data.classroomId } } }),
      },
      include: {
        classroom: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, data: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    classroomId?: string;
    photoUrl?: string;
    notes?: string;
    status?: ChildStatus;
  }) {
    return this.prisma.child.update({
      where: { id },
      data: {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
        ...(data.gender && { gender: data.gender }),
        ...(data.photoUrl && { photoUrl: data.photoUrl }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.status && { status: data.status }),
        ...(data.classroomId && { classroom: { connect: { id: data.classroomId } } }),
      },
      include: {
        classroom: { select: { id: true, name: true } },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.child.delete({
      where: { id },
    });
  }

  async assignParent(childId: string, parentId: string, relationship: string, isPrimary = false) {
    return this.prisma.childParent.create({
      data: {
        childId,
        parentId,
        relationship,
        isPrimary,
      },
    });
  }

  async addAllergy(childId: string, data: {
    allergen: string;
    severity: AllergySeverity;
    reactions?: string;
    treatment?: string;
  }) {
    return this.prisma.allergy.create({
      data: {
        childId,
        allergen: data.allergen,
        severity: data.severity,
        reactions: data.reactions,
        treatment: data.treatment,
      },
    });
  }

  async addEmergencyContact(childId: string, data: {
    name: string;
    relationship: string;
    phone: string;
    priority: number;
  }) {
    return this.prisma.emergencyContact.create({
      data: {
        childId,
        ...data,
      },
    });
  }
}
