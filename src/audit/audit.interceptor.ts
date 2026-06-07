import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
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
    if (entityName.startsWith('PROJECT')) entityName = 'PROJECT';
    else if (entityName.startsWith('ROLE')) entityName = 'ROLE';
    else if (entityName.startsWith('APPLICATION')) entityName = 'APPLICATION';
    else if (entityName.startsWith('USER')) entityName = 'USER';

    const entityId = id || 'NEW';

    let beforeState: any = null;

    // Capture "before" state if it's an update or delete
    if (id && ['PATCH', 'PUT', 'DELETE'].includes(method)) {
      try {
        if (entityName === 'PROJECT') {
          beforeState = await this.prisma.project.findUnique({ where: { id } });
        } else if (entityName === 'ROLE') {
          beforeState = await this.prisma.role.findUnique({ where: { id } });
        } else if (entityName === 'APPLICATION') {
          beforeState = await this.prisma.application.findUnique({ where: { id } });
        } else if (entityName === 'USER') {
          beforeState = await this.prisma.user.findUnique({ where: { id } });
        }
      } catch (err) {
        // Suppress errors during state capture so as not to break the actual request
        console.error('AuditInterceptor: Failed to fetch before state', err);
      }
    }

    return next.handle().pipe(
      tap({
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
                diff: diff as any,
              },
            });
          } catch (auditErr) {
            console.error('Failed to write audit log:', auditErr);
          }
        },
      }),
    );
  }
}
