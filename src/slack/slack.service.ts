import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';

@Injectable()
export class SlackService {
  public botClient: WebClient;

  constructor(private readonly config: ConfigService) {
    const token = this.config.get<string>('SLACK_BOT_TOKEN');
    this.botClient = new WebClient(token);
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
    } catch (error) {
      console.error('Failed to list Slack channels:', error);
      return [];
    }
  }

  /**
   * Sends a plain text or Block Kit DM to a specific user slackId
   */
  async sendDM(slackUserId: string, text: string, blocks?: any[]) {
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
    } catch (err) {
      console.error(`Failed to send DM to Slack user ${slackUserId}:`, err);
    }
  }

  /**
   * Posts announcement in a channel using Block Kit blocks
   */
  async postAnnouncement(channelId: string, text: string, blocks: any[]) {
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
}
