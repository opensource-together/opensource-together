import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { createApiDocs } from '@/docs/openapi';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    bodyParser: false,
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
