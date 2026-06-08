import { RolesService } from './roles.service';
import { User } from '@prisma/client';
import { CreateRoleDto, UpdateRoleDto } from '../types';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findByProject(projectId: string): Promise<({
        _count: {
            applications: number;
        };
    } & {
        id: string;
        title: string;
        skills: string[];
        experience: string;
        openings: number;
        projectId: string;
        filled: number;
    })[]>;
    addRole(projectId: string, user: User, body: CreateRoleDto): Promise<{
        id: string;
        title: string;
        skills: string[];
        experience: string;
        openings: number;
        projectId: string;
        filled: number;
    }>;
    updateRole(roleId: string, user: User, body: UpdateRoleDto): Promise<{
        id: string;
        title: string;
        skills: string[];
        experience: string;
        openings: number;
        projectId: string;
        filled: number;
    }>;
    deleteRole(roleId: string, user: User): Promise<any>;
}
//# sourceMappingURL=roles.controller.d.ts.map