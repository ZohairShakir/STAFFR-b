import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(page?: number, limit?: number, entity?: string, actorId?: string): Promise<{
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
//# sourceMappingURL=audit.controller.d.ts.map