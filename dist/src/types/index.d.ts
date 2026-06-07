import { z } from 'zod';
export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    PROJECT_MANAGER = "PROJECT_MANAGER",
    TEAM_MEMBER = "TEAM_MEMBER"
}
export declare enum ProjectStatus {
    DRAFT = "DRAFT",
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    CLOSED = "CLOSED"
}
export declare enum ApplicationStatus {
    PENDING = "PENDING",
    REVIEWING = "REVIEWING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    WITHDRAWN = "WITHDRAWN"
}
export declare enum ApplicationSource {
    WEB = "WEB",
    SLACK = "SLACK"
}
export declare const ROLE_HIERARCHY: Record<UserRole, number>;
export declare function hasRole(userRole: UserRole, requiredRole: UserRole): boolean;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    slackId: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    role: z.ZodNativeEnum<typeof UserRole>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    role: UserRole;
    id: string;
    slackId: string;
    name: string;
    email: string;
    createdAt: string;
    avatar?: string | null | undefined;
}, {
    role: UserRole;
    id: string;
    slackId: string;
    name: string;
    email: string;
    createdAt: string;
    avatar?: string | null | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export declare const UpdateUserRoleSchema: z.ZodObject<{
    role: z.ZodNativeEnum<typeof UserRole>;
}, "strip", z.ZodTypeAny, {
    role: UserRole;
}, {
    role: UserRole;
}>;
export type UpdateUserRoleDto = z.infer<typeof UpdateUserRoleSchema>;
export declare const CreateRoleSchema: z.ZodObject<{
    title: z.ZodString;
    skills: z.ZodArray<z.ZodString, "many">;
    experience: z.ZodString;
    openings: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    title: string;
    skills: string[];
    experience: string;
    openings: number;
}, {
    title: string;
    skills: string[];
    experience: string;
    openings: number;
}>;
export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
export declare const UpdateRoleSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    experience: z.ZodOptional<z.ZodString>;
    openings: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    skills?: string[] | undefined;
    experience?: string | undefined;
    openings?: number | undefined;
}, {
    title?: string | undefined;
    skills?: string[] | undefined;
    experience?: string | undefined;
    openings?: number | undefined;
}>;
export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;
export declare const RoleSchema: z.ZodObject<{
    id: z.ZodString;
    projectId: z.ZodString;
    title: z.ZodString;
    skills: z.ZodArray<z.ZodString, "many">;
    experience: z.ZodString;
    openings: z.ZodNumber;
    filled: z.ZodNumber;
    _count: z.ZodOptional<z.ZodObject<{
        applications: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        applications: number;
    }, {
        applications: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    projectId: string;
    skills: string[];
    experience: string;
    openings: number;
    filled: number;
    _count?: {
        applications: number;
    } | undefined;
}, {
    id: string;
    title: string;
    projectId: string;
    skills: string[];
    experience: string;
    openings: number;
    filled: number;
    _count?: {
        applications: number;
    } | undefined;
}>;
export type Role = z.infer<typeof RoleSchema>;
export declare const CreateProjectSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    deadline: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    slackChannelId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    roles: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        skills: z.ZodArray<z.ZodString, "many">;
        experience: z.ZodString;
        openings: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        title: string;
        skills: string[];
        experience: string;
        openings: number;
    }, {
        title: string;
        skills: string[];
        experience: string;
        openings: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    roles: {
        title: string;
        skills: string[];
        experience: string;
        openings: number;
    }[];
    slackChannelId?: string | null | undefined;
    deadline?: string | null | undefined;
}, {
    title: string;
    description: string;
    roles: {
        title: string;
        skills: string[];
        experience: string;
        openings: number;
    }[];
    slackChannelId?: string | null | undefined;
    deadline?: string | null | undefined;
}>;
export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
export declare const UpdateProjectSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    deadline: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    slackChannelId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof ProjectStatus>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    status?: ProjectStatus | undefined;
    slackChannelId?: string | null | undefined;
    deadline?: string | null | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    status?: ProjectStatus | undefined;
    slackChannelId?: string | null | undefined;
    deadline?: string | null | undefined;
}>;
export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;
export declare const ProjectSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    status: z.ZodNativeEnum<typeof ProjectStatus>;
    managerId: z.ZodString;
    manager: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        slackId: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        role: z.ZodNativeEnum<typeof UserRole>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    }, {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    }>>;
    slackChannelId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    deadline: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    roles: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        title: z.ZodString;
        skills: z.ZodArray<z.ZodString, "many">;
        experience: z.ZodString;
        openings: z.ZodNumber;
        filled: z.ZodNumber;
        _count: z.ZodOptional<z.ZodObject<{
            applications: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            applications: number;
        }, {
            applications: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        projectId: string;
        skills: string[];
        experience: string;
        openings: number;
        filled: number;
        _count?: {
            applications: number;
        } | undefined;
    }, {
        id: string;
        title: string;
        projectId: string;
        skills: string[];
        experience: string;
        openings: number;
        filled: number;
        _count?: {
            applications: number;
        } | undefined;
    }>, "many">>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    _count: z.ZodOptional<z.ZodObject<{
        applications: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        applications: number;
    }, {
        applications: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    title: string;
    description: string;
    status: ProjectStatus;
    managerId: string;
    updatedAt: string;
    _count?: {
        applications: number;
    } | undefined;
    slackChannelId?: string | null | undefined;
    deadline?: string | null | undefined;
    roles?: {
        id: string;
        title: string;
        projectId: string;
        skills: string[];
        experience: string;
        openings: number;
        filled: number;
        _count?: {
            applications: number;
        } | undefined;
    }[] | undefined;
    manager?: {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    } | undefined;
}, {
    id: string;
    createdAt: string;
    title: string;
    description: string;
    status: ProjectStatus;
    managerId: string;
    updatedAt: string;
    _count?: {
        applications: number;
    } | undefined;
    slackChannelId?: string | null | undefined;
    deadline?: string | null | undefined;
    roles?: {
        id: string;
        title: string;
        projectId: string;
        skills: string[];
        experience: string;
        openings: number;
        filled: number;
        _count?: {
            applications: number;
        } | undefined;
    }[] | undefined;
    manager?: {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    } | undefined;
}>;
export type Project = z.infer<typeof ProjectSchema>;
export declare const CreateApplicationSchema: z.ZodObject<{
    roleId: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
    source: z.ZodDefault<z.ZodNativeEnum<typeof ApplicationSource>>;
}, "strip", z.ZodTypeAny, {
    roleId: string;
    source: ApplicationSource;
    note?: string | undefined;
}, {
    roleId: string;
    note?: string | undefined;
    source?: ApplicationSource | undefined;
}>;
export type CreateApplicationDto = z.infer<typeof CreateApplicationSchema>;
export declare const UpdateApplicationStatusSchema: z.ZodObject<{
    status: z.ZodNativeEnum<typeof ApplicationStatus>;
}, "strip", z.ZodTypeAny, {
    status: ApplicationStatus;
}, {
    status: ApplicationStatus;
}>;
export type UpdateApplicationStatusDto = z.infer<typeof UpdateApplicationStatusSchema>;
export declare const ApplicationSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    user: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        slackId: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        role: z.ZodNativeEnum<typeof UserRole>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    }, {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    }>>;
    roleId: z.ZodString;
    role: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        projectId: z.ZodString;
        title: z.ZodString;
        skills: z.ZodArray<z.ZodString, "many">;
        experience: z.ZodString;
        openings: z.ZodNumber;
        filled: z.ZodNumber;
        _count: z.ZodOptional<z.ZodObject<{
            applications: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            applications: number;
        }, {
            applications: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        projectId: string;
        skills: string[];
        experience: string;
        openings: number;
        filled: number;
        _count?: {
            applications: number;
        } | undefined;
    }, {
        id: string;
        title: string;
        projectId: string;
        skills: string[];
        experience: string;
        openings: number;
        filled: number;
        _count?: {
            applications: number;
        } | undefined;
    }>>;
    status: z.ZodNativeEnum<typeof ApplicationStatus>;
    note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    source: z.ZodNativeEnum<typeof ApplicationSource>;
    reviewedBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reviewer: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        slackId: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        role: z.ZodNativeEnum<typeof UserRole>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    }, {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    }>>>;
    reviewedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    status: ApplicationStatus;
    updatedAt: string;
    roleId: string;
    source: ApplicationSource;
    userId: string;
    user?: {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    } | undefined;
    role?: {
        id: string;
        title: string;
        projectId: string;
        skills: string[];
        experience: string;
        openings: number;
        filled: number;
        _count?: {
            applications: number;
        } | undefined;
    } | undefined;
    note?: string | null | undefined;
    reviewedBy?: string | null | undefined;
    reviewer?: {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    } | null | undefined;
    reviewedAt?: string | null | undefined;
}, {
    id: string;
    createdAt: string;
    status: ApplicationStatus;
    updatedAt: string;
    roleId: string;
    source: ApplicationSource;
    userId: string;
    user?: {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    } | undefined;
    role?: {
        id: string;
        title: string;
        projectId: string;
        skills: string[];
        experience: string;
        openings: number;
        filled: number;
        _count?: {
            applications: number;
        } | undefined;
    } | undefined;
    note?: string | null | undefined;
    reviewedBy?: string | null | undefined;
    reviewer?: {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    } | null | undefined;
    reviewedAt?: string | null | undefined;
}>;
export type Application = z.infer<typeof ApplicationSchema>;
export declare const AnnouncementSchema: z.ZodObject<{
    id: z.ZodString;
    projectId: z.ZodString;
    slackTs: z.ZodString;
    channelId: z.ZodString;
    sentAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    projectId: string;
    slackTs: string;
    channelId: string;
    sentAt: string;
}, {
    id: string;
    projectId: string;
    slackTs: string;
    channelId: string;
    sentAt: string;
}>;
export type Announcement = z.infer<typeof AnnouncementSchema>;
export declare const AuditLogSchema: z.ZodObject<{
    id: z.ZodString;
    actorId: z.ZodString;
    actor: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        slackId: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        role: z.ZodNativeEnum<typeof UserRole>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    }, {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    }>>;
    entity: z.ZodString;
    entityId: z.ZodString;
    action: z.ZodString;
    diff: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    actorId: string;
    entity: string;
    entityId: string;
    action: string;
    actor?: {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    } | undefined;
    diff?: Record<string, unknown> | null | undefined;
}, {
    id: string;
    createdAt: string;
    actorId: string;
    entity: string;
    entityId: string;
    action: string;
    actor?: {
        role: UserRole;
        id: string;
        slackId: string;
        name: string;
        email: string;
        createdAt: string;
        avatar?: string | null | undefined;
    } | undefined;
    diff?: Record<string, unknown> | null | undefined;
}>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
export declare const PaginationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export interface HiringFunnelReport {
    projectId: string;
    projectTitle: string;
    pending: number;
    reviewing: number;
    accepted: number;
    rejected: number;
    withdrawn: number;
}
export interface FillRateReport {
    projectId: string;
    projectTitle: string;
    roleId: string;
    roleTitle: string;
    openings: number;
    filled: number;
    fillRate: number;
}
export interface TimeToHireReport {
    avgDaysToHire: number;
}
export type WsEventName = 'project.updated' | 'application.created' | 'application.statusChanged';
export interface WsEvent<T = unknown> {
    event: WsEventName;
    data: T;
}
export interface SlackChannel {
    id: string;
    name: string;
    is_private: boolean;
    num_members: number;
}
//# sourceMappingURL=index.d.ts.map