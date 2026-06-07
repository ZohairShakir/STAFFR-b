import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../types';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findMe(id: string): Promise<{
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string | null;
        avatar: string | null;
        createdAt: Date;
    } | null>;
    findAll(): Promise<{
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string | null;
        avatar: string | null;
        createdAt: Date;
    }[]>;
    updateRole(actorRole: UserRole, targetUserId: string, newRole: UserRole): Promise<{
        role: import("@prisma/client").$Enums.UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string | null;
        avatar: string | null;
        createdAt: Date;
    }>;
}
//# sourceMappingURL=users.service.d.ts.map