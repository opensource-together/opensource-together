import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import { SuperTokensExceptionFilter } from 'supertokens-nestjs';
import supertokens from 'supertokens-node';
async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  app.enableCors({
    origin: [process.env.WEBSITE_DOMAIN],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });
  app.useGlobalFilters(new SuperTokensExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
