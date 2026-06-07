import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { UpdateUserRoleDto } from '@cft/types';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: User): User;
    getAll(): unknown;
    updateRole(actor: User, targetId: string, body: UpdateUserRoleDto): unknown;
}
//# sourceMappingURL=users.controller.d.ts.map