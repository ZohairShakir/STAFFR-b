import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, User } from '@prisma/client';
import { CreateApplicationDto } from '../types';
import { Queue } from 'bull';
export declare class ApplicationsService {
    private readonly prisma;
    private readonly notifyQueue;
    constructor(prisma: PrismaService, notifyQueue: Queue);
    create(user: User, data: CreateApplicationDto): Promise<{
        user: {
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
            createdAt: Date;
        };
        role: {
            project: {
                manager: {
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
                title: string;
                description: string;
                status: import("@prisma/client").$Enums.ProjectStatus;
                managerId: string;
                slackChannelId: string | null;
                deadline: Date | null;
                updatedAt: Date;
            };
        } & {
            id: string;
            title: string;
            projectId: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        updatedAt: Date;
        roleId: string;
        note: string | null;
        source: import("@prisma/client").$Enums.ApplicationSource;
        userId: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
    findAll(user: User, filters: {
        status?: string;
        projectId?: string;
        roleId?: string;
    }): Promise<({
        user: {
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
            createdAt: Date;
        };
        role: {
            project: {
                manager: {
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
                title: string;
                description: string;
                status: import("@prisma/client").$Enums.ProjectStatus;
                managerId: string;
                slackChannelId: string | null;
                deadline: Date | null;
                updatedAt: Date;
            };
        } & {
            id: string;
            title: string;
            projectId: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        };
        reviewer: {
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
            createdAt: Date;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        updatedAt: Date;
        roleId: string;
        note: string | null;
        source: import("@prisma/client").$Enums.ApplicationSource;
        userId: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    })[]>;
    findOne(id: string, user: User): Promise<{
        user: {
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
            createdAt: Date;
        };
        role: {
            project: {
                manager: {
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
                title: string;
                description: string;
                status: import("@prisma/client").$Enums.ProjectStatus;
                managerId: string;
                slackChannelId: string | null;
                deadline: Date | null;
                updatedAt: Date;
            };
        } & {
            id: string;
            title: string;
            projectId: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        };
        reviewer: {
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
            createdAt: Date;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        updatedAt: Date;
        roleId: string;
        note: string | null;
        source: import("@prisma/client").$Enums.ApplicationSource;
        userId: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    }>;
    updateStatus(id: string, reviewer: User, newStatus: ApplicationStatus): Promise<any>;
    withdraw(id: string, user: User): Promise<any>;
}
//# sourceMappingURL=applications.service.d.ts.map