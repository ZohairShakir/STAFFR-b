import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS — APP_URL can be comma-separated for multiple origins (e.g. Vercel + localhost)
  const allowedOrigins = (process.env.APP_URL || 'http://localhost:3000')
    .split(',')
    .map((u) => u.trim());
  app.enableCors({
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
    credentials: true,
  });

  // Middleware for cookies
  app.use(cookieParser());

  // Intercept and preserve raw body buffer for Slack signing verification
  app.use(
    json({
      verify: (req: any, _res: any, buf: Buffer) => {
        if (req.url.startsWith('/slack/events')) {
          req.rawBody = buf.toString();
        }
      },
    }),
  );

  app.use(urlencoded({ extended: true }));

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 CFT API running on: http://localhost:${port}`);
}
bootstrap();
