import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto, UserRole } from '../types';
import { User } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProject(projectId: string) {
    return this.prisma.role.findMany({
      where: { projectId },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });
  }

  async addRole(projectId: string, user: User, data: CreateRoleDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.managerId !== user.id && user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Not authorized to add roles to this project');
    }

    return this.prisma.role.create({
      data: {
        ...data,
        projectId,
      },
    });
  }

  async updateRole(roleId: string, user: User, data: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: { project: true },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (
      role.project.managerId !== user.id &&
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Not authorized to update this role');
    }

    return this.prisma.role.update({
      where: { id: roleId },
      data,
    });
  }

  async deleteRole(roleId: string, user: User) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: { project: true },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (
      role.project.managerId !== user.id &&
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Not authorized to delete this role');
    }

    return this.prisma.$transaction(async (tx: any) => {
      // Delete child applications first
      await tx.application.deleteMany({ where: { roleId } });
      return tx.role.delete({ where: { id: roleId } });
    });
  }
}
