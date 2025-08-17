import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { createApiDocs } from '@/docs/openapi';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

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
