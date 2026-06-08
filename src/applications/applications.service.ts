import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, ApplicationSource, User } from '@prisma/client';
import { CreateApplicationDto, UserRole, hasRole } from '../types';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';


@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('notify') private readonly notifyQueue: Queue,
  ) {}

  async create(user: User, data: CreateApplicationDto) {
    const role = await this.prisma.role.findUnique({
      where: { id: data.roleId },
      include: { project: true },
    });

    if (!role) {
      throw new NotFoundException('Target role not found');
    }

    if (role.project.status !== 'OPEN') {
      throw new BadRequestException('This project is not accepting applications');
    }

    // Check if role openings are already filled
    if (role.filled >= role.openings) {
      throw new BadRequestException('Role openings are already completely filled');
    }

    // Check if user has already applied for this role
    const existing = await this.prisma.application.findFirst({
      where: {
        userId: user.id,
        roleId: data.roleId,
      },
    });

    if (existing) {
      throw new BadRequestException('You have already applied for this role');
    }

    // Create the Application record
    const application = await this.prisma.application.create({
      data: {
        userId: user.id,
        roleId: data.roleId,
        note: data.note,
        source: data.source as ApplicationSource,
        status: ApplicationStatus.PENDING,
      },
      include: {
        user: true,
        role: {
          include: {
            project: {
              include: {
                manager: true,
              },
            },
          },
        },
      },
    });

    // Notify the manager via DM (via the BullMQ worker)
    await this.notifyQueue.add('new-application', { applicationStatic: application });

    return application;
  }

  async findAll(user: User, filters: { status?: string; projectId?: string; roleId?: string }) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status as ApplicationStatus;
    }
    if (filters.roleId) {
      where.roleId = filters.roleId;
    }
    if (filters.projectId) {
      where.role = { projectId: filters.projectId };
    }

    // Team members can only see their own applications
    if (user.role === UserRole.TEAM_MEMBER) {
      where.userId = user.id;
    } else if (user.role === UserRole.PROJECT_MANAGER) {
      // Project managers can see their own applications or applications on projects they manage
      where.OR = [
        { userId: user.id },
        {
          role: {
            project: {
              managerId: user.id,
            },
          },
        },
      ];
    } // Admins/Super Admins see all

    return this.prisma.application.findMany({
      where,
      include: {
        user: true,
        role: {
          include: {
            project: {
              include: {
                manager: true,
              },
            },
          },
        },
        reviewer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user: User) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        user: true,
        role: {
          include: {
            project: {
              include: {
                manager: true,
              },
            },
          },
        },
        reviewer: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Authorization checks
    if (user.role === UserRole.TEAM_MEMBER && application.userId !== user.id) {
      throw new ForbiddenException('Not authorized to access this application');
    }

    if (
      user.role === UserRole.PROJECT_MANAGER &&
      application.userId !== user.id &&
      application.role.project.managerId !== user.id
    ) {
      throw new ForbiddenException('Not authorized to access this application');
    }

    return application;
  }

  async updateStatus(id: string, reviewer: User, newStatus: ApplicationStatus) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const isProjectManager = application.role.project.managerId === reviewer.id;
    const isAdminOrAbove = hasRole(reviewer.role as UserRole, UserRole.ADMIN);

    if (!isProjectManager && !isAdminOrAbove) {
      throw new ForbiddenException('Only the project manager or an administrator can review applications');
    }

    const updated = await this.prisma.$transaction(async (tx: any) => {
      // If updating status to ACCEPTED, increment role's filled slot count
      if (newStatus === ApplicationStatus.ACCEPTED && application.status !== ApplicationStatus.ACCEPTED) {
        const currentRole = await tx.role.findUnique({ where: { id: application.roleId } });
        if (currentRole && currentRole.filled < currentRole.openings) {
          await tx.role.update({
            where: { id: application.roleId },
            data: { filled: { increment: 1 } },
          });
        }
      }

      // If changing from ACCEPTED back to something else, decrement role's filled count
      if (application.status === ApplicationStatus.ACCEPTED && newStatus !== ApplicationStatus.ACCEPTED) {
        await tx.role.update({
          where: { id: application.roleId },
          data: { filled: { decrement: 1 } },
        });
      }

      return tx.application.update({
        where: { id },
        data: {
          status: newStatus,
          reviewedBy: reviewer.id,
          reviewedAt: new Date(),
        },
        include: {
          user: true,
          role: {
            include: {
              project: {
                include: {
                  manager: true,
                },
              },
            },
          },
        },
      });
    });

    try {
      await this.notifyQueue.add('status-change', {
        applicationId: updated.id,
        status: newStatus,
      });
    } catch {
      // Status update should succeed even if the notification queue is unavailable
    }

    return updated;
  }

  async withdraw(id: string, user: User) {
    const application = await this.prisma.application.findUnique({ where: { id } });
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.userId !== user.id) {
      throw new ForbiddenException('You can only withdraw your own applications');
    }

    return this.prisma.$transaction(async (tx: any) => {

      // If withdrawing an ACCEPTED application, decrement filled count
      if (application.status === ApplicationStatus.ACCEPTED) {
        await tx.role.update({
          where: { id: application.roleId },
          data: { filled: { decrement: 1 } },
        });
      }

      return tx.application.update({
        where: { id },
        data: { status: ApplicationStatus.WITHDRAWN },
      });
    });
  }
}
