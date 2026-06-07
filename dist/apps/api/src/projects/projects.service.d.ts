import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from '@cft/types';
import { Queue } from 'bull';
export declare class ProjectsService {
    private readonly prisma;
    private readonly announceQueue;
    constructor(prisma: PrismaService, announceQueue: Queue);
    create(managerId: string, data: CreateProjectDto): unknown;
    findAll(filters: {
        status?: string;
        managerId?: string;
        skill?: string;
    }): unknown;
    findOne(id: string): unknown;
    update(id: string, user: User, data: UpdateProjectDto): unknown;
    publish(id: string, user: User): unknown;
    remove(id: string, user: User): unknown;
}
//# sourceMappingURL=projects.service.d.ts.map