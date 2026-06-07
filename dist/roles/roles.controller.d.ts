import { RolesService } from './roles.service';
import { User } from '@prisma/client';
import { CreateRoleDto, UpdateRoleDto } from '@cft/types';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
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
    addRole(projectId: string, user: User, body: CreateRoleDto): Promise<{
        id: string;
        projectId: string;
        title: string;
        skills: string[];
        experience: string;
        openings: number;
        filled: number;
    }>;
    updateRole(roleId: string, user: User, body: UpdateRoleDto): Promise<{
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
//# sourceMappingURL=roles.controller.d.ts.map