import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, filters?: {
        entity?: string;
        actorId?: string;
    }): unknown;
}
//# sourceMappingURL=audit.service.d.ts.map