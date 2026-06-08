import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../types';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findMe(id: string): Promise<{
        id: string;
        slackId: string;
        name: string;
        email: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    } | null>;
    findAll(): Promise<{
        id: string;
        slackId: string;
        name: string;
        email: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }[]>;
    updateRole(actorRole: UserRole, targetUserId: string, newRole: UserRole): Promise<{
        id: string;
        slackId: string;
        name: string;
        email: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
}
//# sourceMappingURL=users.service.d.ts.map