import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { UpdateUserRoleDto } from '../types';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: User): {
        id: string;
        slackId: string;
        name: string;
        email: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    };
    getAll(): Promise<{
        id: string;
        slackId: string;
        name: string;
        email: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }[]>;
    updateRole(actor: User, targetId: string, body: UpdateUserRoleDto): Promise<{
        id: string;
        slackId: string;
        name: string;
        email: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
}
//# sourceMappingURL=users.controller.d.ts.map