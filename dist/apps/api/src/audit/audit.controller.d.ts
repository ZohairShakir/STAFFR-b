import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(page?: number, limit?: number, entity?: string, actorId?: string): unknown;
}
//# sourceMappingURL=audit.controller.d.ts.map