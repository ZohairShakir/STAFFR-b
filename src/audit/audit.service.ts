import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, filters?: { entity?: string; actorId?: string }) {
    const where: any = {};

    if (filters?.entity) {
      where.entity = filters.entity;
    }
    if (filters?.actorId) {
      where.actorId = filters.actorId;
    }

    const total = await this.prisma.auditLog.count({ where });
    const totalPages = Math.ceil(total / limit);

    const data = await this.prisma.auditLog.findMany({
      where,
      include: {
        actor: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}
