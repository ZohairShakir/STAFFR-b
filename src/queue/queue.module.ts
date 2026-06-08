import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        url: configService.get<string>('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      {
        name: 'slack-announce',
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      },
      {
        name: 'notify',
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
