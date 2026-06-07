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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const types_1 = require("../types");
let RolesService = class RolesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByProject(projectId) {
        return this.prisma.role.findMany({
            where: { projectId },
            include: {
                _count: {
                    select: { applications: true },
                },
            },
        });
    }
    async addRole(projectId, user, data) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.managerId !== user.id && user.role !== types_1.UserRole.ADMIN && user.role !== types_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Not authorized to add roles to this project');
        }
        return this.prisma.role.create({
            data: {
                ...data,
                projectId,
            },
        });
    }
    async updateRole(roleId, user, data) {
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
            include: { project: true },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        if (role.project.managerId !== user.id &&
            user.role !== types_1.UserRole.ADMIN &&
            user.role !== types_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Not authorized to update this role');
        }
        return this.prisma.role.update({
            where: { id: roleId },
            data,
        });
    }
    async deleteRole(roleId, user) {
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
            include: { project: true },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        if (role.project.managerId !== user.id &&
            user.role !== types_1.UserRole.ADMIN &&
            user.role !== types_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Not authorized to delete this role');
        }
        return this.prisma.$transaction(async (tx) => {
            // Delete child applications first
            await tx.application.deleteMany({ where: { roleId } });
            return tx.role.delete({ where: { id: roleId } });
        });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map