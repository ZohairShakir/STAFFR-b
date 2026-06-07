import { ApplicationsService } from './applications.service';
import { User } from '@prisma/client';
import { CreateApplicationDto, UpdateApplicationStatusDto } from '@cft/types';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    create(user: User, body: CreateApplicationDto): unknown;
    findAll(user: User, status?: string, projectId?: string, roleId?: string): unknown;
    findOne(id: string, user: User): unknown;
    updateStatus(id: string, reviewer: User, body: UpdateApplicationStatusDto): unknown;
    withdraw(id: string, user: User): unknown;
}
//# sourceMappingURL=applications.controller.d.ts.map