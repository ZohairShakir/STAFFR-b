import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { UpdateUserRoleDto } from '../types';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: User): {
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string | null;
        avatar: string | null;
        createdAt: Date;
    };
    getAll(): Promise<{
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string | null;
        avatar: string | null;
        createdAt: Date;
    }[]>;
    updateRole(actor: User, targetId: string, body: UpdateUserRoleDto): Promise<{
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string | null;
        avatar: string | null;
        createdAt: Date;
    }>;
}
//# sourceMappingURL=users.controller.d.ts.map