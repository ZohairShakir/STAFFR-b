import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { UpdateUserRoleDto } from '@cft/types';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: User): {
        name: string;
        id: string;
        slackId: string;
        email: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    };
    getAll(): Promise<{
        name: string;
        id: string;
        slackId: string;
        email: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }[]>;
    updateRole(actor: User, targetId: string, body: UpdateUserRoleDto): Promise<{
        name: string;
        id: string;
        slackId: string;
        email: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
}
//# sourceMappingURL=users.controller.d.ts.map