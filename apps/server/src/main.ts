import { createApiDocs } from '@/docs/openapi';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  createApiDocs(app);

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap()
  .then((): void =>
    Logger.log(`Server is running on port ${process.env.PORT ?? 4000}`),
  )
  .catch((error: any): never => {
    Logger.error('Error starting the server:', error);
    process.exit(1);
  });
