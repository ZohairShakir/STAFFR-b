import { ApplicationsService } from './applications.service';
import { User } from '@prisma/client';
import { CreateApplicationDto, UpdateApplicationStatusDto } from '../types';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    create(user: User, body: CreateApplicationDto): Promise<{
        role: {
            project: {
                manager: {
                    id: string;
                    slackId: string;
                    name: string;
                    email: string | null;
                    avatar: string | null;
                    role: import("@prisma/client").$Enums.UserRole;
                    createdAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.ProjectStatus;
                title: string;
                description: string;
                deadline: Date | null;
                slackChannelId: string | null;
                managerId: string;
                updatedAt: Date;
            };
        } & {
            id: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            projectId: string;
            filled: number;
        };
        user: {
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
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
    findAll(user: User, status?: string, projectId?: string, roleId?: string): Promise<({
        role: {
            project: {
                manager: {
                    id: string;
                    slackId: string;
                    name: string;
                    email: string | null;
                    avatar: string | null;
                    role: import("@prisma/client").$Enums.UserRole;
                    createdAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.ProjectStatus;
                title: string;
                description: string;
                deadline: Date | null;
                slackChannelId: string | null;
                managerId: string;
                updatedAt: Date;
            };
        } & {
            id: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            projectId: string;
            filled: number;
        };
        user: {
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        reviewer: {
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
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
        role: {
            project: {
                manager: {
                    id: string;
                    slackId: string;
                    name: string;
                    email: string | null;
                    avatar: string | null;
                    role: import("@prisma/client").$Enums.UserRole;
                    createdAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.ProjectStatus;
                title: string;
                description: string;
                deadline: Date | null;
                slackChannelId: string | null;
                managerId: string;
                updatedAt: Date;
            };
        } & {
            id: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            projectId: string;
            filled: number;
        };
        user: {
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        reviewer: {
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
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
    updateStatus(id: string, reviewer: User, body: UpdateApplicationStatusDto): Promise<any>;
    withdraw(id: string, user: User): Promise<any>;
}
//# sourceMappingURL=applications.controller.d.ts.map