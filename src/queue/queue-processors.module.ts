import { Module } from '@nestjs/common';
import { QueueModule } from './queue.module';
import { SlackAnnounceProcessor } from './slack-announce.processor';
import { NotifyProcessor } from './notify.processor';
import { DeadLetterAnnounceProcessor } from './dead-letter.processor';
import { SlackModule } from '../slack/slack.module';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [QueueModule, SlackModule, GatewayModule],
  providers: [SlackAnnounceProcessor, NotifyProcessor, DeadLetterAnnounceProcessor],
  exports: [QueueModule],
})
export class QueueProcessorsModule {}
