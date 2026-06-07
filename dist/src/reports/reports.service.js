"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
        return projects.map((p) => {
            const allApps = p.roles.flatMap((r) => r.applications);
            const funnel = {
                projectId: p.id,
                projectTitle: p.title,
                pending: allApps.filter((a) => a.status === 'PENDING').length,
                reviewing: allApps.filter((a) => a.status === 'REVIEWING').length,
                accepted: allApps.filter((a) => a.status === 'ACCEPTED').length,
                rejected: allApps.filter((a) => a.status === 'REJECTED').length,
                withdrawn: allApps.filter((a) => a.status === 'WITHDRAWN').length,
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
        return roles.map((r) => ({
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
        return projects.map((p) => {
            const acceptedApps = p.roles.flatMap((r) => r.applications);
            if (acceptedApps.length === 0) {
                return {
                    projectId: p.id,
                    projectTitle: p.title,
                    avgDaysToHire: 0,
                };
            }
            const totalDiff = acceptedApps.reduce((acc, app) => {
                const start = new Date(app.createdAt).getTime();
                const end = new Date(app.reviewedAt).getTime();
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map