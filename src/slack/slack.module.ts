import { Module, forwardRef } from '@nestjs/common';
import { SlackService } from './slack.service';
import { BlockKitBuilder } from './block-kit.builder';
import { SlackController } from './slack.controller';
import { SlackEventsController } from './slack-events.controller';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [forwardRef(() => ApplicationsModule)],
  controllers: [SlackController, SlackEventsController],
  providers: [SlackService, BlockKitBuilder],
  exports: [SlackService, BlockKitBuilder],
})
export class SlackModule {}

