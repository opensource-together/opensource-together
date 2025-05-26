import { NestFactory } from '@nestjs/core';
import { SuperTokensExceptionFilter } from 'supertokens-nestjs';
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';
import supertokens from 'supertokens-node';
import { RootModule } from './root.module';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  // Configuration CORS
  app.enableCors({
    origin: [process.env.WEBSITE_DOMAIN || 'http://localhost:3000'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  // const document = YAML.load('swagger-doc.example.yml');

  app.useGlobalFilters(new SuperTokensExceptionFilter());

  if (process.env.NODE_ENV !== 'PRODUCTION') {
    // const document = YAML.load('swagger-doc.example.yml');
    // const document = YAML.load('swagger-doc.yml');
    // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document));
  }

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
