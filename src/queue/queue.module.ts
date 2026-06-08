import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService, ConfigModule } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL') || '';
        return {
          createClient: () => new Redis(redisUrl, {
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
          }),
        };
      },
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
