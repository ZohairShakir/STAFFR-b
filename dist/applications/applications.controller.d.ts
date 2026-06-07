import { ApplicationsService } from './applications.service';
import { User } from '@prisma/client';
import { CreateApplicationDto, UpdateApplicationStatusDto } from '@cft/types';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    create(user: User, body: CreateApplicationDto): Promise<{
        user: {
            name: string;
            id: string;
            slackId: string;
            email: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        role: {
            project: {
                manager: {
                    name: string;
                    id: string;
                    slackId: string;
                    email: string;
                    avatar: string | null;
                    role: import("@prisma/client").$Enums.UserRole;
                    createdAt: Date;
                };
            } & {
                status: import("@prisma/client").$Enums.ProjectStatus;
                id: string;
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
        roleId: string;
        note: string | null;
        source: import("@prisma/client").$Enums.ApplicationSource;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        id: string;
        createdAt: Date;
        reviewedAt: Date | null;
        updatedAt: Date;
        userId: string;
        reviewedBy: string | null;
    }>;
    findAll(user: User, status?: string, projectId?: string, roleId?: string): Promise<({
        user: {
            name: string;
            id: string;
            slackId: string;
            email: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        role: {
            project: {
                manager: {
                    name: string;
                    id: string;
                    slackId: string;
                    email: string;
                    avatar: string | null;
                    role: import("@prisma/client").$Enums.UserRole;
                    createdAt: Date;
                };
            } & {
                status: import("@prisma/client").$Enums.ProjectStatus;
                id: string;
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
            name: string;
            id: string;
            slackId: string;
            email: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        } | null;
    } & {
        roleId: string;
        note: string | null;
        source: import("@prisma/client").$Enums.ApplicationSource;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        id: string;
        createdAt: Date;
        reviewedAt: Date | null;
        updatedAt: Date;
        userId: string;
        reviewedBy: string | null;
    })[]>;
    findOne(id: string, user: User): Promise<{
        user: {
            name: string;
            id: string;
            slackId: string;
            email: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        role: {
            project: {
                manager: {
                    name: string;
                    id: string;
                    slackId: string;
                    email: string;
                    avatar: string | null;
                    role: import("@prisma/client").$Enums.UserRole;
                    createdAt: Date;
                };
            } & {
                status: import("@prisma/client").$Enums.ProjectStatus;
                id: string;
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
            name: string;
            id: string;
            slackId: string;
            email: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        } | null;
    } & {
        roleId: string;
        note: string | null;
        source: import("@prisma/client").$Enums.ApplicationSource;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        id: string;
        createdAt: Date;
        reviewedAt: Date | null;
        updatedAt: Date;
        userId: string;
        reviewedBy: string | null;
    }>;
    updateStatus(id: string, reviewer: User, body: UpdateApplicationStatusDto): Promise<any>;
    withdraw(id: string, user: User): Promise<any>;
}
//# sourceMappingURL=applications.controller.d.ts.map