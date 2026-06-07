import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApplicationsService } from '../applications/applications.service';
import { PrismaService } from '../prisma/prisma.service';
import { SlackService } from './slack.service';
import { ApplicationSource } from '../types';
import * as crypto from 'crypto';

@Controller('slack')
export class SlackEventsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly applicationsService: ApplicationsService,
    private readonly slackService: SlackService,
  ) {}

  @Post('events')
  async handleEvents(@Req() req: Request, @Res() res: Response) {
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);
    const signature = req.headers['x-slack-signature'] as string;
    const timestamp = req.headers['x-slack-request-timestamp'] as string;
    const signingSecret = this.configService.get<string>('SLACK_SIGNING_SECRET');

    // 1. Verify signing secret to prevent spoofing
    if (!signature || !timestamp || !signingSecret) {
      return res.status(401).send('Verification failed');
    }

    const time = Math.floor(new Date().getTime() / 1000);
    if (Math.abs(time - Number(timestamp)) > 300) {
      return res.status(401).send('Verification failed - timestamp delta too large');
    }

    const sigBaseString = `v0:${timestamp}:${rawBody}`;
    const mySignature = `v0=${crypto
      .createHmac('sha256', signingSecret)
      .update(sigBaseString, 'utf8')
      .digest('hex')}`;

    if (
      !crypto.timingSafeEqual(
        Buffer.from(mySignature, 'utf8'),
        Buffer.from(signature, 'utf8'),
      )
    ) {
      return res.status(401).send('Verification failed - signature mismatch');
    }

    // 2. Handle URL verification challenge for Slack Event API config
    if (req.body.type === 'url_verification') {
      return res.json({ challenge: req.body.challenge });
    }

    // 3. Handle interactive block action payloads (such as clicking the Apply button)
    let payload = req.body;
    if (payload.payload) {
      payload = JSON.parse(payload.payload);
    }

    if (payload.type === 'block_actions') {
      const action = payload.actions?.[0];
      if (action && action.action_id === 'apply_role') {
        const roleId = action.value; // role ID passed in block button value
        const slackUserId = payload.user.id;
        const slackUserName = payload.user.name || payload.user.username;

        try {
          // Find or create the User matching this Slack ID
          let user = await this.prisma.user.findUnique({
            where: { slackId: slackUserId },
          });

          if (!user) {
            // Slack oauth details aren't present yet, so fetch profile details from Slack Web API
            const profile = await this.slackService.botClient.users.info({
              user: slackUserId,
            });

            if (!profile.ok || !profile.user) {
              throw new Error(`Slack user details fetch failed: ${profile.error}`);
            }

            user = await this.prisma.user.create({
              data: {
                slackId: slackUserId,
                name: profile.user.real_name || slackUserName,
                email: profile.user.profile?.email || undefined,
                avatar: profile.user.profile?.image_192 || null,
              },
            });
          }

          // Create the application record
          await this.applicationsService.create(user, {
            roleId,
            note: 'Applied via Slack Interactive Button',
            source: ApplicationSource.SLACK,
          });

          // Acknowledge event
          return res.status(200).send();
        } catch (err: any) {
          console.error('Slack Interactive Button Apply Error:', err);
          // Send error DM directly to the Slack user to notify them of failure
          await this.slackService.sendDM(
            slackUserId,
            `❌ *Application Failed*\nCould not process your application: ${err.message || 'Unknown system error'}`,
          );
          return res.status(200).send();
        }
      }
    }

    return res.status(200).send('OK');
  }
}
