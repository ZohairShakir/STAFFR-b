import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getHiringFunnel() {
    // Collect count per project and application status
    const projects = await this.prisma.project.findMany({
      select: {
        id: true,
        title: true,
        roles: {
          select: {
            applications: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    return projects.map((p: any) => {
      const allApps = p.roles.flatMap((r: any) => r.applications);
      const funnel = {
        projectId: p.id,
        projectTitle: p.title,
        pending: allApps.filter((a: any) => a.status === 'PENDING').length,
        reviewing: allApps.filter((a: any) => a.status === 'REVIEWING').length,
        accepted: allApps.filter((a: any) => a.status === 'ACCEPTED').length,
        rejected: allApps.filter((a: any) => a.status === 'REJECTED').length,
        withdrawn: allApps.filter((a: any) => a.status === 'WITHDRAWN').length,
      };
      return funnel;
    });
  }

  async getFillRate() {
    const roles = await this.prisma.role.findMany({
      include: {
        project: {
          select: {
            title: true,
          },
        },
      },
    });

    return roles.map((r: any) => ({
      projectId: r.projectId,
      projectTitle: r.project.title,
      roleId: r.id,
      roleTitle: r.title,
      openings: r.openings,
      filled: r.filled,
      fillRate: r.openings > 0 ? (r.filled / r.openings) * 100 : 0,
    }));
  }

  async getTimeToHire() {
    // Average days from PENDING (createdAt) to ACCEPTED (reviewedAt)
    const projects = await this.prisma.project.findMany({
      select: {
        id: true,
        title: true,
        roles: {
          select: {
            applications: {
              where: {
                status: 'ACCEPTED',
                reviewedAt: { not: null },
              },
              select: {
                createdAt: true,
                reviewedAt: true,
              },
            },
          },
        },
      },
    });

    return projects.map((p: any) => {
      const acceptedApps = p.roles.flatMap((r: any) => r.applications);
      if (acceptedApps.length === 0) {
        return {
          projectId: p.id,
          projectTitle: p.title,
          avgDaysToHire: 0,
        };
      }

      const totalDiff = acceptedApps.reduce((acc: number, app: any) => {
        const start = new Date(app.createdAt).getTime();
        const end = new Date(app.reviewedAt!).getTime();
        return acc + (end - start);
      }, 0);

      const avgDays = totalDiff / acceptedApps.length / (1000 * 60 * 60 * 24);

      return {
        projectId: p.id,
        projectTitle: p.title,
        avgDaysToHire: Math.round(avgDays * 10) / 10,
      };
    });
  }
}
