"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockKitBuilder = void 0;
const common_1 = require("@nestjs/common");
let BlockKitBuilder = class BlockKitBuilder {
    /**
     * Constructs a high-quality Slack Block Kit message structure for project announcements.
     * Includes title, details, and roles with interactive 'Apply' buttons.
     */
    buildProjectAnnouncement(project) {
        const blocks = [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `🚀 New Project: ${project.title}`,
                    emoji: true,
                },
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Manager:* ${project.manager.name}\n*Description:*\n${project.description}`,
                },
            },
        ];
        if (project.deadline) {
            const formattedDate = new Date(project.deadline).toLocaleDateString();
            blocks.push({
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: `📅 *Application Deadline:* ${formattedDate}`,
                    },
                ],
            });
        }
        blocks.push({ type: 'divider' });
        blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: '*Available Roles (Apply Below)*',
            },
        });
        // Append each role as a structured block with an apply button
        project.roles.forEach((role) => {
            blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*${role.title}* (${role.openings - role.filled} openings remaining)\n• *Experience:* ${role.experience}\n• *Required Skills:* ${role.skills.join(', ')}`,
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Apply',
                        emoji: true,
                    },
                    value: role.id,
                    action_id: 'apply_role',
                    style: 'primary',
                },
            });
        });
        return blocks;
    }
};
exports.BlockKitBuilder = BlockKitBuilder;
exports.BlockKitBuilder = BlockKitBuilder = __decorate([
    (0, common_1.Injectable)()
], BlockKitBuilder);
