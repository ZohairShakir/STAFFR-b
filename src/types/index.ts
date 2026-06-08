import { z } from 'zod';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  TEAM_MEMBER = 'TEAM_MEMBER',
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum ApplicationSource {
  WEB = 'WEB',
  SLACK = 'SLACK',
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 4,
  [UserRole.ADMIN]: 3,
  [UserRole.PROJECT_MANAGER]: 2,
  [UserRole.TEAM_MEMBER]: 1,
};

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export const UserSchema = z.object({
  id: z.string().uuid(),
  slackId: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url().nullable().optional(),
  role: z.nativeEnum(UserRole),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

export const UpdateUserRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export type UpdateUserRoleDto = z.infer<typeof UpdateUserRoleSchema>;

export const CreateRoleSchema = z.object({
  title: z.string().min(2).max(100),
  skills: z.array(z.string().min(1)).min(1),
  experience: z.string().min(2).max(200),
  openings: z.number().int().positive(),
});

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;

export const UpdateRoleSchema = CreateRoleSchema.partial();
export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;

export const RoleSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  title: z.string(),
  skills: z.array(z.string()),
  experience: z.string(),
  openings: z.number().int(),
  filled: z.number().int(),
  _count: z
    .object({
      applications: z.number().int(),
    })
    .optional(),
});

export type Role = z.infer<typeof RoleSchema>;

export const CreateProjectSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(10).max(2000),
  deadline: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
        return new Date(`${val}T00:00:00.000Z`).toISOString();
      }
      return val;
    },
    z.string().datetime().nullable().optional(),
  ),
  slackChannelId: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : val),
    z.string().min(1).nullable().optional(),
  ),
  roles: z.array(CreateRoleSchema).min(1),
});

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  description: z.string().min(10).max(2000).optional(),
  deadline: z.string().datetime().optional().nullable(),
  slackChannelId: z.string().optional().nullable(),
  status: z.nativeEnum(ProjectStatus).optional(),
});

export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  status: z.nativeEnum(ProjectStatus),
  managerId: z.string().uuid(),
  manager: UserSchema.optional(),
  slackChannelId: z.string().nullable().optional(),
  deadline: z.string().datetime().nullable().optional(),
  roles: z.array(RoleSchema).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _count: z
    .object({
      applications: z.number().int(),
    })
    .optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const CreateApplicationSchema = z.object({
  roleId: z.string().uuid(),
  note: z.string().max(1000).optional(),
  source: z.nativeEnum(ApplicationSource).default(ApplicationSource.WEB),
});

export type CreateApplicationDto = z.infer<typeof CreateApplicationSchema>;

export const UpdateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
});

export type UpdateApplicationStatusDto = z.infer<typeof UpdateApplicationStatusSchema>;

export const ApplicationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  user: UserSchema.optional(),
  roleId: z.string().uuid(),
  role: RoleSchema.optional(),
  status: z.nativeEnum(ApplicationStatus),
  note: z.string().nullable().optional(),
  source: z.nativeEnum(ApplicationSource),
  reviewedBy: z.string().uuid().nullable().optional(),
  reviewer: UserSchema.optional().nullable(),
  reviewedAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Application = z.infer<typeof ApplicationSchema>;

export const AnnouncementSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  slackTs: z.string(),
  channelId: z.string(),
  sentAt: z.string().datetime(),
});

export type Announcement = z.infer<typeof AnnouncementSchema>;

export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  actorId: z.string().uuid(),
  actor: UserSchema.optional(),
  entity: z.string(),
  entityId: z.string(),
  action: z.string(),
  diff: z.record(z.unknown()).nullable().optional(),
  createdAt: z.string().datetime(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

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

export type WsEventName =
  | 'project.updated'
  | 'application.created'
  | 'application.statusChanged'
  | 'user.created'
  | 'user.roleUpdated'
  | 'audit.created';

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
