"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationQuerySchema = exports.AuditLogSchema = exports.AnnouncementSchema = exports.ApplicationSchema = exports.UpdateApplicationStatusSchema = exports.CreateApplicationSchema = exports.ProjectSchema = exports.UpdateProjectSchema = exports.CreateProjectSchema = exports.RoleSchema = exports.UpdateRoleSchema = exports.CreateRoleSchema = exports.UpdateUserRoleSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("./enums");
// ─── User ──────────────────────────────────────────────────────────────────────
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    slackId: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    avatar: zod_1.z.string().url().nullable().optional(),
    role: zod_1.z.nativeEnum(enums_1.UserRole),
    createdAt: zod_1.z.string().datetime(),
});
exports.UpdateUserRoleSchema = zod_1.z.object({
    role: zod_1.z.nativeEnum(enums_1.UserRole),
});
// ─── Role (Project Role / Position) ───────────────────────────────────────────
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
// ─── Project ───────────────────────────────────────────────────────────────────
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
    status: zod_1.z.nativeEnum(enums_1.ProjectStatus).optional(),
});
exports.ProjectSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    status: zod_1.z.nativeEnum(enums_1.ProjectStatus),
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
// ─── Application ───────────────────────────────────────────────────────────────
exports.CreateApplicationSchema = zod_1.z.object({
    roleId: zod_1.z.string().uuid(),
    note: zod_1.z.string().max(1000).optional(),
    source: zod_1.z.nativeEnum(enums_1.ApplicationSource).default(enums_1.ApplicationSource.WEB),
});
exports.UpdateApplicationStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(enums_1.ApplicationStatus),
});
exports.ApplicationSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    user: exports.UserSchema.optional(),
    roleId: zod_1.z.string().uuid(),
    role: exports.RoleSchema.optional(),
    status: zod_1.z.nativeEnum(enums_1.ApplicationStatus),
    note: zod_1.z.string().nullable().optional(),
    source: zod_1.z.nativeEnum(enums_1.ApplicationSource),
    reviewedBy: zod_1.z.string().uuid().nullable().optional(),
    reviewer: exports.UserSchema.optional().nullable(),
    reviewedAt: zod_1.z.string().datetime().nullable().optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
// ─── Announcement ──────────────────────────────────────────────────────────────
exports.AnnouncementSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    projectId: zod_1.z.string().uuid(),
    slackTs: zod_1.z.string(),
    channelId: zod_1.z.string(),
    sentAt: zod_1.z.string().datetime(),
});
// ─── Audit Log ─────────────────────────────────────────────────────────────────
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
// ─── Paginated response ────────────────────────────────────────────────────────
exports.PaginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
});
