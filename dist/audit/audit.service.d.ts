import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, filters?: {
        entity?: string;
        actorId?: string;
    }): Promise<{
        data: ({
            actor: {
                id: string;
                createdAt: Date;
                name: string;
                slackId: string;
                email: string;
                avatar: string | null;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            actorId: string;
            entity: string;
            entityId: string;
            action: string;
            diff: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
//# sourceMappingURL=audit.service.d.ts.map