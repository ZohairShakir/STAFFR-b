import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectStatus, User } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto, UserRole } from '../types';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';


@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('slack-announce') private readonly announceQueue: Queue,
  ) {}

  async create(managerId: string, data: CreateProjectDto) {
    const { roles, ...projectData } = data;

    return this.prisma.project.create({
      data: {
        ...projectData,
        deadline: projectData.deadline ? new Date(projectData.deadline) : null,
        managerId,
        roles: {
          create: roles.map((role) => ({
            title: role.title,
            skills: role.skills,
            experience: role.experience,
            openings: role.openings,
          })),
        },
      },
      include: {
        roles: true,
        manager: true,
      },
    });
  }

  async findAll(filters: { status?: string; managerId?: string; skill?: string }) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status as ProjectStatus;
    }
    if (filters.managerId) {
      where.managerId = filters.managerId;
    }
    if (filters.skill) {
      where.roles = {
        some: {
          skills: {
            has: filters.skill,
          },
        },
      };
    }

    return this.prisma.project.findMany({
      where,
      include: {
        manager: true,
        roles: {
          include: {
            _count: {
              select: { applications: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        manager: true,
        roles: {
          include: {
            applications: {
              include: {
                user: true,
              },
            },
            _count: {
              select: { applications: true },
            },
          },
        },
        announcements: true,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, user: User, data: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Owner or Admin only
    if (project.managerId !== user.id && user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Not authorized to update this project');
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      },
      include: {
        roles: true,
        manager: true,
      },
    });
  }

  async publish(id: string, user: User) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.managerId !== user.id && user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Not authorized to publish this project');
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: { status: ProjectStatus.OPEN },
      include: {
        roles: true,
        manager: true,
        announcements: true,
      },
    });

    // Queue Slack announcement if channel is picked and not already announced
    if (updated.slackChannelId && updated.announcements.length === 0) {
      await this.announceQueue.add('announce', { projectId: updated.id });
    }

    return updated;
  }

  async remove(id: string, user: User) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Admin+ only soft/hard delete
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only admins can delete projects');
    }

    // Standard implementation deletes the project and roles (Prisma cascades should be configured, but standard database constraints will apply. Let's do a transaction)
    return this.prisma.$transaction(async (tx: any) => {
      // Delete child applications first
      const roles = await tx.role.findMany({ where: { projectId: id } });
      const roleIds = roles.map((r: any) => r.id);
      await tx.application.deleteMany({ where: { roleId: { in: roleIds } } });
      await tx.announcement.deleteMany({ where: { projectId: id } });
      await tx.role.deleteMany({ where: { projectId: id } });
      return tx.project.delete({ where: { id } });
    });
  }
}
