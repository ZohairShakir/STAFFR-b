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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const types_1 = require("../types");
const bull_1 = require("@nestjs/bull");
let ApplicationsService = class ApplicationsService {
    prisma;
    notifyQueue;
    constructor(prisma, notifyQueue) {
        this.prisma = prisma;
        this.notifyQueue = notifyQueue;
    }
    async create(user, data) {
        const role = await this.prisma.role.findUnique({
            where: { id: data.roleId },
            include: { project: true },
        });
        if (!role) {
            throw new common_1.NotFoundException('Target role not found');
        }
        // Check if role openings are already filled
        if (role.filled >= role.openings) {
            throw new common_1.BadRequestException('Role openings are already completely filled');
        }
        // Check if user has already applied for this role
        const existing = await this.prisma.application.findFirst({
            where: {
                userId: user.id,
                roleId: data.roleId,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('You have already applied for this role');
        }
        // Create the Application record
        const application = await this.prisma.application.create({
            data: {
                userId: user.id,
                roleId: data.roleId,
                note: data.note,
                source: data.source,
                status: client_1.ApplicationStatus.PENDING,
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
    async findAll(user, filters) {
        const where = {};
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.roleId) {
            where.roleId = filters.roleId;
        }
        if (filters.projectId) {
            where.role = { projectId: filters.projectId };
        }
        // Team members can only see their own applications
        if (user.role === types_1.UserRole.TEAM_MEMBER) {
            where.userId = user.id;
        }
        else if (user.role === types_1.UserRole.PROJECT_MANAGER) {
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
    async findOne(id, user) {
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
            throw new common_1.NotFoundException('Application not found');
        }
        // Authorization checks
        if (user.role === types_1.UserRole.TEAM_MEMBER && application.userId !== user.id) {
            throw new common_1.ForbiddenException('Not authorized to access this application');
        }
        if (user.role === types_1.UserRole.PROJECT_MANAGER &&
            application.userId !== user.id &&
            application.role.project.managerId !== user.id) {
            throw new common_1.ForbiddenException('Not authorized to access this application');
        }
        return application;
    }
    async updateStatus(id, reviewer, newStatus) {
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
            throw new common_1.NotFoundException('Application not found');
        }
        // Reviewer must be manager of the project or Admin+
        if (application.role.project.managerId !== reviewer.id &&
            reviewer.role !== types_1.UserRole.ADMIN &&
            reviewer.role !== types_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only the project manager or an administrator can review applications');
        }
        return this.prisma.$transaction(async (tx) => {
            // If updating status to ACCEPTED, increment role's filled slot count
            if (newStatus === client_1.ApplicationStatus.ACCEPTED && application.status !== client_1.ApplicationStatus.ACCEPTED) {
                const currentRole = await tx.role.findUnique({ where: { id: application.roleId } });
                if (currentRole && currentRole.filled < currentRole.openings) {
                    await tx.role.update({
                        where: { id: application.roleId },
                        data: { filled: { increment: 1 } },
                    });
                }
            }
            // If changing from ACCEPTED back to something else, decrement role's filled count
            if (application.status === client_1.ApplicationStatus.ACCEPTED && newStatus !== client_1.ApplicationStatus.ACCEPTED) {
                await tx.role.update({
                    where: { id: application.roleId },
                    data: { filled: { decrement: 1 } },
                });
            }
            const updated = await tx.application.update({
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
            // Dispatch notification queue task to send Slack DM to applicant
            await this.notifyQueue.add('status-change', {
                applicationId: updated.id,
                status: newStatus,
            });
            return updated;
        });
    }
    async withdraw(id, user) {
        const application = await this.prisma.application.findUnique({ where: { id } });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (application.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only withdraw your own applications');
        }
        return this.prisma.$transaction(async (tx) => {
            // If withdrawing an ACCEPTED application, decrement filled count
            if (application.status === client_1.ApplicationStatus.ACCEPTED) {
                await tx.role.update({
                    where: { id: application.roleId },
                    data: { filled: { decrement: 1 } },
                });
            }
            return tx.application.update({
                where: { id },
                data: { status: client_1.ApplicationStatus.WITHDRAWN },
            });
        });
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)('notify')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map