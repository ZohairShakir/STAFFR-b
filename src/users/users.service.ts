import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../gateway/events.gateway';
import { UserRole } from '../types';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async findMe(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Prefer the newest record when duplicate accounts exist (legacy seed + Slack OAuth).
    const byKey = new Map<string, (typeof users)[number]>();
    for (const user of users) {
      const key = user.email?.toLowerCase() || user.slackId;
      if (!byKey.has(key)) {
        byKey.set(key, user);
      }
    }

    return Array.from(byKey.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async updateRole(actorRole: UserRole, targetUserId: string, newRole: UserRole) {
    if (actorRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admins can assign user roles');
    }

    const target = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    // Emit event to notify the user about role change
    this.eventsGateway.emitEvent('user.roleUpdated', {
      userId: targetUserId,
      newRole: newRole,
    });

    return updatedUser;
  }
}
