import { SlackService } from './slack.service';
export declare class SlackController {
    private readonly slackService;
    constructor(slackService: SlackService);
    getChannels(): Promise<{
        id: string;
        name: string;
        is_private: boolean;
        num_members: number;
    }[]>;
}
//# sourceMappingURL=slack.controller.d.ts.map