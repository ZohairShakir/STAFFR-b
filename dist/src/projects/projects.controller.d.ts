import { ProjectsService } from './projects.service';
import { User } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from '../types';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(user: User, body: CreateProjectDto): Promise<{
        roles: {
            id: string;
            title: string;
            projectId: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        }[];
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
    }>;
    findAll(status?: string, managerId?: string, skill?: string): Promise<({
        roles: ({
            _count: {
                applications: number;
            };
        } & {
            id: string;
            title: string;
            projectId: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        })[];
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
    })[]>;
    findOne(id: string): Promise<{
        roles: ({
            applications: ({
                user: {
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
            projectId: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        })[];
        manager: {
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
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
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        managerId: string;
        slackChannelId: string | null;
        deadline: Date | null;
        updatedAt: Date;
    }>;
    update(id: string, user: User, body: UpdateProjectDto): Promise<{
        roles: {
            id: string;
            title: string;
            projectId: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        }[];
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
    }>;
    publish(id: string, user: User): Promise<{
        roles: {
            id: string;
            title: string;
            projectId: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        }[];
        manager: {
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            slackId: string;
            name: string;
            email: string | null;
            avatar: string | null;
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
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        managerId: string;
        slackChannelId: string | null;
        deadline: Date | null;
        updatedAt: Date;
    }>;
    remove(id: string, user: User): Promise<any>;
}
//# sourceMappingURL=projects.controller.d.ts.map