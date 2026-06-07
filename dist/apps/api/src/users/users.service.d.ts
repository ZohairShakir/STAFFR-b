import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@cft/types';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findMe(id: string): unknown;
    findAll(): unknown;
    updateRole(actorRole: UserRole, targetUserId: string, newRole: UserRole): unknown;
}
//# sourceMappingURL=users.service.d.ts.map