import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from '../types';
import { Queue } from 'bull';
export declare class ProjectsService {
    private readonly prisma;
    private readonly announceQueue;
    constructor(prisma: PrismaService, announceQueue: Queue);
    create(managerId: string, data: CreateProjectDto): Promise<{
        roles: {
            id: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            projectId: string;
            filled: number;
        }[];
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
    }>;
    findAll(filters: {
        status?: string;
        managerId?: string;
        skill?: string;
    }): Promise<({
        roles: ({
            _count: {
                applications: number;
            };
        } & {
            id: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            projectId: string;
            filled: number;
        })[];
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
    })[]>;
    findOne(id: string): Promise<{
        roles: ({
            applications: ({
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
            })[];
            _count: {
                applications: number;
            };
        } & {
            id: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            projectId: string;
            filled: number;
        })[];
        manager: {
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        announcements: {
            id: string;
            projectId: string;
            slackTs: string;
            channelId: string;
            sentAt: Date;
            messageJson: import("@prisma/client/runtime/library").JsonValue;
        }[];
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
    }>;
    update(id: string, user: User, data: UpdateProjectDto): Promise<{
        roles: {
            id: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            projectId: string;
            filled: number;
        }[];
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
    }>;
    publish(id: string, user: User): Promise<{
        roles: {
            id: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            projectId: string;
            filled: number;
        }[];
        manager: {
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        announcements: {
            id: string;
            projectId: string;
            slackTs: string;
            channelId: string;
            sentAt: Date;
            messageJson: import("@prisma/client/runtime/library").JsonValue;
        }[];
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
    }>;
    remove(id: string, user: User): Promise<any>;
}
//# sourceMappingURL=projects.service.d.ts.map