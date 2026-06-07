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
    getChannels(): Promise<{
        id: string;
        name: string;
        is_private: boolean;
        num_members: number;
    }[]>;
    /**
     * Sends a plain text or Block Kit DM to a specific user slackId
     */
    sendDM(slackUserId: string, text: string, blocks?: any[]): Promise<void>;
    /**
     * Posts announcement in a channel using Block Kit blocks
     */
    postAnnouncement(channelId: string, text: string, blocks: any[]): Promise<{
        ts: string;
        channel: string;
    }>;
}
//# sourceMappingURL=slack.service.d.ts.map