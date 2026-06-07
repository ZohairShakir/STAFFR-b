"use strict";
// ─── Enums ────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_HIERARCHY = exports.ApplicationSource = exports.ApplicationStatus = exports.ProjectStatus = exports.UserRole = void 0;
exports.hasRole = hasRole;
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
// ─── Role hierarchy (higher = more permissions) ───────────────────────────────
exports.ROLE_HIERARCHY = {
    [UserRole.SUPER_ADMIN]: 4,
    [UserRole.ADMIN]: 3,
    [UserRole.PROJECT_MANAGER]: 2,
    [UserRole.TEAM_MEMBER]: 1,
};
function hasRole(userRole, requiredRole) {
    return exports.ROLE_HIERARCHY[userRole] >= exports.ROLE_HIERARCHY[requiredRole];
}
