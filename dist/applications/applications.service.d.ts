import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, User } from '@prisma/client';
import { CreateApplicationDto } from '@cft/types';
import { Queue } from 'bull';
export declare class ApplicationsService {
    private readonly prisma;
    private readonly notifyQueue;
    constructor(prisma: PrismaService, notifyQueue: Queue);
    create(user: User, data: CreateApplicationDto): Promise<{
        user: {
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
            name: string;
            slackId: string;
            email: string;
            avatar: string | null;
        };
        role: {
            project: {
                manager: {
                    id: string;
                    createdAt: Date;
                    role: import("@prisma/client").$Enums.UserRole;
                    name: string;
                    slackId: string;
                    email: string;
                    avatar: string | null;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.ProjectStatus;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
                managerId: string;
                slackChannelId: string | null;
                deadline: Date | null;
            };
        } & {
            id: string;
            projectId: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        note: string | null;
        source: import("@prisma/client").$Enums.ApplicationSource;
        reviewedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        roleId: string;
        reviewedBy: string | null;
    }>;
    findAll(user: User, filters: {
        status?: string;
        projectId?: string;
        roleId?: string;
    }): Promise<({
        user: {
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
            name: string;
            slackId: string;
            email: string;
            avatar: string | null;
        };
        role: {
            project: {
                manager: {
                    id: string;
                    createdAt: Date;
                    role: import("@prisma/client").$Enums.UserRole;
                    name: string;
                    slackId: string;
                    email: string;
                    avatar: string | null;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.ProjectStatus;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
                managerId: string;
                slackChannelId: string | null;
                deadline: Date | null;
            };
        } & {
            id: string;
            projectId: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        };
        reviewer: {
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
            name: string;
            slackId: string;
            email: string;
            avatar: string | null;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        note: string | null;
        source: import("@prisma/client").$Enums.ApplicationSource;
        reviewedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        roleId: string;
        reviewedBy: string | null;
    })[]>;
    findOne(id: string, user: User): Promise<{
        user: {
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
            name: string;
            slackId: string;
            email: string;
            avatar: string | null;
        };
        role: {
            project: {
                manager: {
                    id: string;
                    createdAt: Date;
                    role: import("@prisma/client").$Enums.UserRole;
                    name: string;
                    slackId: string;
                    email: string;
                    avatar: string | null;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.ProjectStatus;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
                managerId: string;
                slackChannelId: string | null;
                deadline: Date | null;
            };
        } & {
            id: string;
            projectId: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        };
        reviewer: {
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
            name: string;
            slackId: string;
            email: string;
            avatar: string | null;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        note: string | null;
        source: import("@prisma/client").$Enums.ApplicationSource;
        reviewedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        roleId: string;
        reviewedBy: string | null;
    }>;
    updateStatus(id: string, reviewer: User, newStatus: ApplicationStatus): Promise<any>;
    withdraw(id: string, user: User): Promise<any>;
}
//# sourceMappingURL=applications.service.d.ts.map