import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(page?: number, limit?: number, entity?: string, actorId?: string): Promise<{
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
//# sourceMappingURL=audit.controller.d.ts.map