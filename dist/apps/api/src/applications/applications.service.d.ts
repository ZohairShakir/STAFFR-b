import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, User } from '@prisma/client';
import { CreateApplicationDto } from '@cft/types';
import { Queue } from 'bull';
export declare class ApplicationsService {
    private readonly prisma;
    private readonly notifyQueue;
    constructor(prisma: PrismaService, notifyQueue: Queue);
    create(user: User, data: CreateApplicationDto): unknown;
    findAll(user: User, filters: {
        status?: string;
        projectId?: string;
        roleId?: string;
    }): unknown;
    findOne(id: string, user: User): unknown;
    updateStatus(id: string, reviewer: User, newStatus: ApplicationStatus): unknown;
    withdraw(id: string, user: User): unknown;
}
//# sourceMappingURL=applications.service.d.ts.map