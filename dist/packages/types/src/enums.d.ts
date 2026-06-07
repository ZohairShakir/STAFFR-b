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
//# sourceMappingURL=enums.d.ts.map