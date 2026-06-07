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
exports.SlackService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bolt_1 = require("@slack/bolt");
const web_api_1 = require("@slack/web-api");
let SlackService = class SlackService {
    constructor(config) {
        this.config = config;
        const token = this.config.get('SLACK_BOT_TOKEN');
        const signingSecret = this.config.get('SLACK_SIGNING_SECRET');
        // Initialize WebClient
        this.botClient = new web_api_1.WebClient(token);
        // Initialize Bolt App
        this.boltApp = new bolt_1.App({
            token,
            signingSecret,
            // Disable default receiver since NestJS handles the /slack/events path manually
            receiver: undefined,
        });
    }
    /**
     * Retrieves list of public Slack channels in the workspace
     */
    async getChannels() {
        try {
            const response = await this.botClient.conversations.list({
                types: 'public_channel,private_channel',
                exclude_archived: true,
                limit: 100,
            });
            if (!response.ok) {
                throw new Error(response.error);
            }
            return (response.channels || []).map((ch) => ({
                id: ch.id || '',
                name: ch.name || '',
                is_private: !!ch.is_private,
                num_members: ch.num_members || 0,
            }));
        }
        catch (error) {
            console.error('Failed to list Slack channels:', error);
            return [];
        }
    }
    /**
     * Sends a plain text or Block Kit DM to a specific user slackId
     */
    async sendDM(slackUserId, text, blocks) {
        try {
            // 1. Open IM channel
            const im = await this.botClient.conversations.open({
                users: slackUserId,
            });
            if (!im.ok || !im.channel?.id) {
                throw new Error(`Failed to open IM channel: ${im.error}`);
            }
            // 2. Post message to the channel
            await this.botClient.chat.postMessage({
                channel: im.channel.id,
                text,
                blocks,
            });
        }
        catch (err) {
            console.error(`Failed to send DM to Slack user ${slackUserId}:`, err);
        }
    }
    /**
     * Posts announcement in a channel using Block Kit blocks
     */
    async postAnnouncement(channelId, text, blocks) {
        const res = await this.botClient.chat.postMessage({
            channel: channelId,
            text,
            blocks,
        });
        if (!res.ok) {
            throw new Error(`Failed to post message to channel: ${res.error}`);
        }
        return {
            ts: res.ts || '',
            channel: res.channel || '',
        };
    }
};
exports.SlackService = SlackService;
exports.SlackService = SlackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SlackService);
