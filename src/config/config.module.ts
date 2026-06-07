import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('15m'),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('7d'),
        SLACK_CLIENT_ID: Joi.string().required(),
        SLACK_CLIENT_SECRET: Joi.string().required(),
        SLACK_SIGNING_SECRET: Joi.string().required(),
        SLACK_BOT_TOKEN: Joi.string().required(),
        APP_URL: Joi.string().uri().required(),
        API_URL: Joi.string().uri().required(),
        PORT: Joi.number().default(4000),
      }),
    }),
  ],
})
export class ConfigModule {}
