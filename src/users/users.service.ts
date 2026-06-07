import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findMe(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateRole(actorRole: UserRole, targetUserId: string, newRole: UserRole) {
    // Only SUPER_ADMIN can assign/update roles
    if (actorRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admins can assign user roles');
    }

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });
  }
}
