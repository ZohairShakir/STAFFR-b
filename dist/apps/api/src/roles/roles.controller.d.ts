import { RolesService } from './roles.service';
import { User } from '@prisma/client';
import { CreateRoleDto, UpdateRoleDto } from '@cft/types';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findByProject(projectId: string): unknown;
    addRole(projectId: string, user: User, body: CreateRoleDto): unknown;
    updateRole(roleId: string, user: User, body: UpdateRoleDto): unknown;
    deleteRole(roleId: string, user: User): unknown;
}
//# sourceMappingURL=roles.controller.d.ts.map