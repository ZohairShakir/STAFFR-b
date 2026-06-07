import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from '@cft/types';
import { Queue } from 'bull';
export declare class ProjectsService {
    private readonly prisma;
    private readonly announceQueue;
    constructor(prisma: PrismaService, announceQueue: Queue);
    create(managerId: string, data: CreateProjectDto): Promise<{
        manager: {
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
            name: string;
            slackId: string;
            email: string;
            avatar: string | null;
        };
        roles: {
            id: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
            projectId: string;
        }[];
    } & {
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        slackChannelId: string | null;
        deadline: Date | null;
        createdAt: Date;
        updatedAt: Date;
        managerId: string;
    }>;
    findAll(filters: {
        status?: string;
        managerId?: string;
        skill?: string;
    }): Promise<({
        manager: {
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
            name: string;
            slackId: string;
            email: string;
            avatar: string | null;
        };
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
            filled: number;
            projectId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        slackChannelId: string | null;
        deadline: Date | null;
        createdAt: Date;
        updatedAt: Date;
        managerId: string;
    })[]>;
    findOne(id: string): Promise<{
        manager: {
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
            name: string;
            slackId: string;
            email: string;
            avatar: string | null;
        };
        roles: ({
            applications: ({
                user: {
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
                status: import("@prisma/client").$Enums.ApplicationStatus;
                createdAt: Date;
                updatedAt: Date;
                note: string | null;
                source: import("@prisma/client").$Enums.ApplicationSource;
                reviewedAt: Date | null;
                userId: string;
                reviewedBy: string | null;
                roleId: string;
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
            filled: number;
            projectId: string;
        })[];
        announcements: {
            id: string;
            projectId: string;
            slackTs: string;
            channelId: string;
            messageJson: import("@prisma/client/runtime/library").JsonValue;
            sentAt: Date;
        }[];
    } & {
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        slackChannelId: string | null;
        deadline: Date | null;
        createdAt: Date;
        updatedAt: Date;
        managerId: string;
    }>;
    update(id: string, user: User, data: UpdateProjectDto): Promise<{
        manager: {
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
            name: string;
            slackId: string;
            email: string;
            avatar: string | null;
        };
        roles: {
            id: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
            projectId: string;
        }[];
    } & {
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        slackChannelId: string | null;
        deadline: Date | null;
        createdAt: Date;
        updatedAt: Date;
        managerId: string;
    }>;
    publish(id: string, user: User): Promise<{
        manager: {
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.UserRole;
            name: string;
            slackId: string;
            email: string;
            avatar: string | null;
        };
        roles: {
            id: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
            projectId: string;
        }[];
        announcements: {
            id: string;
            projectId: string;
            slackTs: string;
            channelId: string;
            messageJson: import("@prisma/client/runtime/library").JsonValue;
            sentAt: Date;
        }[];
    } & {
        id: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        slackChannelId: string | null;
        deadline: Date | null;
        createdAt: Date;
        updatedAt: Date;
        managerId: string;
    }>;
    remove(id: string, user: User): Promise<any>;
}
//# sourceMappingURL=projects.service.d.ts.map