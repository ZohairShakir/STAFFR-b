import { z } from 'zod';
export declare const UserSchema: any;
export type User = z.infer<typeof UserSchema>;
export declare const UpdateUserRoleSchema: any;
export type UpdateUserRoleDto = z.infer<typeof UpdateUserRoleSchema>;
export declare const CreateRoleSchema: any;
export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
export declare const UpdateRoleSchema: any;
export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;
export declare const RoleSchema: any;
export type Role = z.infer<typeof RoleSchema>;
export declare const CreateProjectSchema: any;
export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
export declare const UpdateProjectSchema: any;
export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;
export declare const ProjectSchema: any;
export type Project = z.infer<typeof ProjectSchema>;
export declare const CreateApplicationSchema: any;
export type CreateApplicationDto = z.infer<typeof CreateApplicationSchema>;
export declare const UpdateApplicationStatusSchema: any;
export type UpdateApplicationStatusDto = z.infer<typeof UpdateApplicationStatusSchema>;
export declare const ApplicationSchema: any;
export type Application = z.infer<typeof ApplicationSchema>;
export declare const AnnouncementSchema: any;
export type Announcement = z.infer<typeof AnnouncementSchema>;
export declare const AuditLogSchema: any;
export type AuditLog = z.infer<typeof AuditLogSchema>;
export declare const PaginationQuerySchema: any;
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
    projectId: string;
    projectTitle: string;
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
//# sourceMappingURL=schemas.d.ts.map