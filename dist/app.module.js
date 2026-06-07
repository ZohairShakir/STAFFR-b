"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_module_1 = require("./config/config.module");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const projects_module_1 = require("./projects/projects.module");
const roles_module_1 = require("./roles/roles.module");
const applications_module_1 = require("./applications/applications.module");
const slack_module_1 = require("./slack/slack.module");
const queue_processors_module_1 = require("./queue/queue-processors.module");
const reports_module_1 = require("./reports/reports.module");
const audit_module_1 = require("./audit/audit.module");
const gateway_module_1 = require("./gateway/gateway.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            projects_module_1.ProjectsModule,
            roles_module_1.RolesModule,
            applications_module_1.ApplicationsModule,
            slack_module_1.SlackModule,
            queue_processors_module_1.QueueProcessorsModule,
            reports_module_1.ReportsModule,
            audit_module_1.AuditModule,
            gateway_module_1.GatewayModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map