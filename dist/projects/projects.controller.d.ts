import { ProjectsService } from './projects.service';
import { User } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from '@cft/types';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(user: User, body: CreateProjectDto): Promise<{
        manager: {
            name: string;
            id: string;
            slackId: string;
            email: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        roles: {
            id: string;
            projectId: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        }[];
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
    }>;
    findAll(status?: string, managerId?: string, skill?: string): Promise<({
        manager: {
            name: string;
            id: string;
            slackId: string;
            email: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        roles: ({
            _count: {
                applications: number;
            };
        } & {
            id: string;
            projectId: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        })[];
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
    })[]>;
    findOne(id: string): Promise<{
        manager: {
            name: string;
            id: string;
            slackId: string;
            email: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        roles: ({
            applications: ({
                user: {
                    name: string;
                    id: string;
                    slackId: string;
                    email: string;
                    avatar: string | null;
                    role: import("@prisma/client").$Enums.UserRole;
                    createdAt: Date;
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
            })[];
            _count: {
                applications: number;
            };
        } & {
            id: string;
            projectId: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
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
        status: import("@prisma/client").$Enums.ProjectStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        managerId: string;
        slackChannelId: string | null;
        deadline: Date | null;
    }>;
    update(id: string, user: User, body: UpdateProjectDto): Promise<{
        manager: {
            name: string;
            id: string;
            slackId: string;
            email: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        roles: {
            id: string;
            projectId: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
        }[];
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
    }>;
    publish(id: string, user: User): Promise<{
        manager: {
            name: string;
            id: string;
            slackId: string;
            email: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        roles: {
            id: string;
            projectId: string;
            title: string;
            skills: string[];
            experience: string;
            openings: number;
            filled: number;
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
        status: import("@prisma/client").$Enums.ProjectStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        managerId: string;
        slackChannelId: string | null;
        deadline: Date | null;
    }>;
    remove(id: string, user: User): Promise<any>;
}
//# sourceMappingURL=projects.controller.d.ts.map