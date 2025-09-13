import { createApiDocs } from '@/docs/openapi';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './libs/http-exception.filter';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.enableCors({
    origin: process.env.FRONTEND_URL,
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
  app.useGlobalFilters(new HttpExceptionFilter());
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
