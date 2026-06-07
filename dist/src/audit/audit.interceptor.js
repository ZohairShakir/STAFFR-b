"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditInterceptor = class AuditInterceptor {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, user, body } = request;
        // We only audit mutating operations
        if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
            return next.handle();
        }
        // Capture actorId. If authentication hasn't resolved (e.g. login endpoint itself), we might skip or record system
        const actorId = user?.id;
        if (!actorId) {
            return next.handle();
        }
        // Determine entity type and ID from the URL path. E.g. /projects/123 -> entity: Project, entityId: 123
        const pathParts = url.split('?')[0].split('/');
        // Standard routing is usually /api/<resource>/<id> or /<resource>/<id>
        const resource = pathParts[1] === 'api' ? pathParts[2] : pathParts[1];
        const id = pathParts[1] === 'api' ? pathParts[3] : pathParts[2];
        let entityName = resource ? resource.toUpperCase() : 'UNKNOWN';
        // Normalize entity names
        if (entityName.startsWith('PROJECT'))
            entityName = 'PROJECT';
        else if (entityName.startsWith('ROLE'))
            entityName = 'ROLE';
        else if (entityName.startsWith('APPLICATION'))
            entityName = 'APPLICATION';
        else if (entityName.startsWith('USER'))
            entityName = 'USER';
        const entityId = id || 'NEW';
        let beforeState = null;
        // Capture "before" state if it's an update or delete
        if (id && ['PATCH', 'PUT', 'DELETE'].includes(method)) {
            try {
                if (entityName === 'PROJECT') {
                    beforeState = await this.prisma.project.findUnique({ where: { id } });
                }
                else if (entityName === 'ROLE') {
                    beforeState = await this.prisma.role.findUnique({ where: { id } });
                }
                else if (entityName === 'APPLICATION') {
                    beforeState = await this.prisma.application.findUnique({ where: { id } });
                }
                else if (entityName === 'USER') {
                    beforeState = await this.prisma.user.findUnique({ where: { id } });
                }
            }
            catch (err) {
                // Suppress errors during state capture so as not to break the actual request
                console.error('AuditInterceptor: Failed to fetch before state', err);
            }
        }
        return next.handle().pipe((0, rxjs_1.tap)({
            next: async (afterData) => {
                try {
                    let actualEntityId = entityId;
                    if (actualEntityId === 'NEW' && afterData?.id) {
                        actualEntityId = afterData.id;
                    }
                    const diff = {
                        before: beforeState,
                        after: method === 'DELETE' ? null : afterData || body,
                    };
                    await this.prisma.auditLog.create({
                        data: {
                            actorId,
                            entity: entityName,
                            entityId: actualEntityId,
                            action: method,
                            diff: diff,
                        },
                    });
                }
                catch (auditErr) {
                    console.error('Failed to write audit log:', auditErr);
                }
            },
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map