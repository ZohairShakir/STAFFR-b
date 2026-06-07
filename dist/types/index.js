"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationQuerySchema = exports.AuditLogSchema = exports.AnnouncementSchema = exports.ApplicationSchema = exports.UpdateApplicationStatusSchema = exports.CreateApplicationSchema = exports.ProjectSchema = exports.UpdateProjectSchema = exports.CreateProjectSchema = exports.RoleSchema = exports.UpdateRoleSchema = exports.CreateRoleSchema = exports.UpdateUserRoleSchema = exports.UserSchema = exports.ROLE_HIERARCHY = exports.ApplicationSource = exports.ApplicationStatus = exports.ProjectStatus = exports.UserRole = void 0;
exports.hasRole = hasRole;
const zod_1 = require("zod");
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["PROJECT_MANAGER"] = "PROJECT_MANAGER";
    UserRole["TEAM_MEMBER"] = "TEAM_MEMBER";
})(UserRole || (exports.UserRole = UserRole = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["DRAFT"] = "DRAFT";
    ProjectStatus["OPEN"] = "OPEN";
    ProjectStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ProjectStatus["CLOSED"] = "CLOSED";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "PENDING";
    ApplicationStatus["REVIEWING"] = "REVIEWING";
    ApplicationStatus["ACCEPTED"] = "ACCEPTED";
    ApplicationStatus["REJECTED"] = "REJECTED";
    ApplicationStatus["WITHDRAWN"] = "WITHDRAWN";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var ApplicationSource;
(function (ApplicationSource) {
    ApplicationSource["WEB"] = "WEB";
    ApplicationSource["SLACK"] = "SLACK";
})(ApplicationSource || (exports.ApplicationSource = ApplicationSource = {}));
exports.ROLE_HIERARCHY = {
    [UserRole.SUPER_ADMIN]: 4,
    [UserRole.ADMIN]: 3,
    [UserRole.PROJECT_MANAGER]: 2,
    [UserRole.TEAM_MEMBER]: 1,
};
function hasRole(userRole, requiredRole) {
    return exports.ROLE_HIERARCHY[userRole] >= exports.ROLE_HIERARCHY[requiredRole];
}
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    slackId: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    avatar: zod_1.z.string().url().nullable().optional(),
    role: zod_1.z.nativeEnum(UserRole),
    createdAt: zod_1.z.string().datetime(),
});
exports.UpdateUserRoleSchema = zod_1.z.object({
    role: zod_1.z.nativeEnum(UserRole),
});
exports.CreateRoleSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(100),
    skills: zod_1.z.array(zod_1.z.string().min(1)).min(1),
    experience: zod_1.z.string().min(2).max(200),
    openings: zod_1.z.number().int().positive(),
});
exports.UpdateRoleSchema = exports.CreateRoleSchema.partial();
exports.RoleSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    projectId: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    skills: zod_1.z.array(zod_1.z.string()),
    experience: zod_1.z.string(),
    openings: zod_1.z.number().int(),
    filled: zod_1.z.number().int(),
    _count: zod_1.z
        .object({
        applications: zod_1.z.number().int(),
    })
        .optional(),
});
exports.CreateProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(150),
    description: zod_1.z.string().min(10).max(2000),
    deadline: zod_1.z.string().datetime().optional().nullable(),
    slackChannelId: zod_1.z.string().optional().nullable(),
    roles: zod_1.z.array(exports.CreateRoleSchema).min(1),
});
exports.UpdateProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(150).optional(),
    description: zod_1.z.string().min(10).max(2000).optional(),
    deadline: zod_1.z.string().datetime().optional().nullable(),
    slackChannelId: zod_1.z.string().optional().nullable(),
    status: zod_1.z.nativeEnum(ProjectStatus).optional(),
});
exports.ProjectSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    status: zod_1.z.nativeEnum(ProjectStatus),
    managerId: zod_1.z.string().uuid(),
    manager: exports.UserSchema.optional(),
    slackChannelId: zod_1.z.string().nullable().optional(),
    deadline: zod_1.z.string().datetime().nullable().optional(),
    roles: zod_1.z.array(exports.RoleSchema).optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    _count: zod_1.z
        .object({
        applications: zod_1.z.number().int(),
    })
        .optional(),
});
exports.CreateApplicationSchema = zod_1.z.object({
    roleId: zod_1.z.string().uuid(),
    note: zod_1.z.string().max(1000).optional(),
    source: zod_1.z.nativeEnum(ApplicationSource).default(ApplicationSource.WEB),
});
exports.UpdateApplicationStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(ApplicationStatus),
});
exports.ApplicationSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    user: exports.UserSchema.optional(),
    roleId: zod_1.z.string().uuid(),
    role: exports.RoleSchema.optional(),
    status: zod_1.z.nativeEnum(ApplicationStatus),
    note: zod_1.z.string().nullable().optional(),
    source: zod_1.z.nativeEnum(ApplicationSource),
    reviewedBy: zod_1.z.string().uuid().nullable().optional(),
    reviewer: exports.UserSchema.optional().nullable(),
    reviewedAt: zod_1.z.string().datetime().nullable().optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.AnnouncementSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    projectId: zod_1.z.string().uuid(),
    slackTs: zod_1.z.string(),
    channelId: zod_1.z.string(),
    sentAt: zod_1.z.string().datetime(),
});
exports.AuditLogSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    actorId: zod_1.z.string().uuid(),
    actor: exports.UserSchema.optional(),
    entity: zod_1.z.string(),
    entityId: zod_1.z.string(),
    action: zod_1.z.string(),
    diff: zod_1.z.record(zod_1.z.unknown()).nullable().optional(),
    createdAt: zod_1.z.string().datetime(),
});
exports.PaginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
});
