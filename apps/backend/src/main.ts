import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api');

  // Required for onModuleDestroy to run on SIGINT/SIGTERM, which is what closes
  // the Redis client and lets BullMQ release its worker locks instead of leaving
  // the in-flight reminder job stalled until the lock expires.
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
