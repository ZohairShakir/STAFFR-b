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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const types_1 = require("../types");
const bull_1 = require("@nestjs/bull");
let ProjectsService = class ProjectsService {
    prisma;
    announceQueue;
    constructor(prisma, announceQueue) {
        this.prisma = prisma;
        this.announceQueue = announceQueue;
    }
    async create(managerId, data) {
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
    async findAll(filters) {
        const where = {};
        if (filters.status) {
            where.status = filters.status;
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async update(id, user, data) {
        const project = await this.prisma.project.findUnique({ where: { id } });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        // Owner or Admin only
        if (project.managerId !== user.id && user.role !== types_1.UserRole.ADMIN && user.role !== types_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Not authorized to update this project');
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
    async publish(id, user) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: { roles: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.managerId !== user.id && user.role !== types_1.UserRole.ADMIN && user.role !== types_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Not authorized to publish this project');
        }
        const updated = await this.prisma.project.update({
            where: { id },
            data: { status: client_1.ProjectStatus.OPEN },
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
    async remove(id, user) {
        const project = await this.prisma.project.findUnique({ where: { id } });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        // Admin+ only soft/hard delete
        if (user.role !== types_1.UserRole.ADMIN && user.role !== types_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only admins can delete projects');
        }
        // Standard implementation deletes the project and roles (Prisma cascades should be configured, but standard database constraints will apply. Let's do a transaction)
        return this.prisma.$transaction(async (tx) => {
            // Delete child applications first
            const roles = await tx.role.findMany({ where: { projectId: id } });
            const roleIds = roles.map((r) => r.id);
            await tx.application.deleteMany({ where: { roleId: { in: roleIds } } });
            await tx.announcement.deleteMany({ where: { projectId: id } });
            await tx.role.deleteMany({ where: { projectId: id } });
            return tx.project.delete({ where: { id } });
        });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)('slack-announce')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map