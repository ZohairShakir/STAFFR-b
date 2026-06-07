import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from '@cft/types';
import { User } from '@prisma/client';
export declare class RolesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByProject(projectId: string): Promise<({
        _count: {
            applications: number;
        };
    } & {
        id: string;
        projectId: string;
        title: string;
        skills: string[];
        experience: string;
        openings: number;
        filled: number;
    })[]>;
    addRole(projectId: string, user: User, data: CreateRoleDto): Promise<{
        id: string;
        projectId: string;
        title: string;
        skills: string[];
        experience: string;
        openings: number;
        filled: number;
    }>;
    updateRole(roleId: string, user: User, data: UpdateRoleDto): Promise<{
        id: string;
        projectId: string;
        title: string;
        skills: string[];
        experience: string;
        openings: number;
        filled: number;
    }>;
    deleteRole(roleId: string, user: User): Promise<any>;
}
//# sourceMappingURL=roles.service.d.ts.map