import { ConfigService } from '@nestjs/config';
import { App } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
export declare class SlackService {
    private readonly config;
    boltApp: App;
    botClient: WebClient;
    constructor(config: ConfigService);
    /**
     * Retrieves list of public Slack channels in the workspace
     */
    getChannels(): Promise<any>;
    /**
     * Sends a plain text or Block Kit DM to a specific user slackId
     */
    sendDM(slackUserId: string, text: string, blocks?: any[]): Promise<void>;
    /**
     * Posts announcement in a channel using Block Kit blocks
     */
    postAnnouncement(channelId: string, text: string, blocks: any[]): Promise<{
        ts: any;
        channel: any;
    }>;
}
//# sourceMappingURL=slack.service.d.ts.map