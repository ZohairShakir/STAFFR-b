import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from '@cft/types';
import { User } from '@prisma/client';
export declare class RolesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByProject(projectId: string): unknown;
    addRole(projectId: string, user: User, data: CreateRoleDto): unknown;
    updateRole(roleId: string, user: User, data: UpdateRoleDto): unknown;
    deleteRole(roleId: string, user: User): unknown;
}
//# sourceMappingURL=roles.service.d.ts.map