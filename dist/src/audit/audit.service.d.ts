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
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
                slackId: string;
                name: string;
                email: string | null;
                avatar: string | null;
                createdAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            actorId: string;
            entity: string;
            entityId: string;
            action: string;
            diff: import("@prisma/client/runtime/library").JsonValue | null;
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