"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackController = void 0;
const common_1 = require("@nestjs/common");
const slack_service_1 = require("./slack.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const types_1 = require("../../../../packages/types/src");
let SlackController = class SlackController {
    constructor(slackService) {
        this.slackService = slackService;
    }
    getChannels() {
        return this.slackService.getChannels();
    }
};
exports.SlackController = SlackController;
__decorate([
    (0, common_1.Get)('channels'),
    (0, roles_decorator_1.Roles)(types_1.UserRole.PROJECT_MANAGER) // Managers/Admins can see channels list for wizard
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SlackController.prototype, "getChannels", null);
exports.SlackController = SlackController = __decorate([
    (0, common_1.Controller)('slack'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [slack_service_1.SlackService])
], SlackController);
