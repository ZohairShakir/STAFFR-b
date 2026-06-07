"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueProcessorsModule = void 0;
const common_1 = require("@nestjs/common");
const queue_module_1 = require("./queue.module");
const slack_announce_processor_1 = require("./slack-announce.processor");
const notify_processor_1 = require("./notify.processor");
const dead_letter_processor_1 = require("./dead-letter.processor");
const slack_module_1 = require("../slack/slack.module");
const gateway_module_1 = require("../gateway/gateway.module");
let QueueProcessorsModule = class QueueProcessorsModule {
};
exports.QueueProcessorsModule = QueueProcessorsModule;
exports.QueueProcessorsModule = QueueProcessorsModule = __decorate([
    (0, common_1.Module)({
        imports: [queue_module_1.QueueModule, slack_module_1.SlackModule, gateway_module_1.GatewayModule],
        providers: [slack_announce_processor_1.SlackAnnounceProcessor, notify_processor_1.NotifyProcessor, dead_letter_processor_1.DeadLetterAnnounceProcessor],
        exports: [queue_module_1.QueueModule],
    })
], QueueProcessorsModule);
