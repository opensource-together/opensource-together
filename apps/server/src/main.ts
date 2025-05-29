import { NestFactory } from '@nestjs/core';
import { SuperTokensExceptionFilter } from 'supertokens-nestjs';
import supertokens from 'supertokens-node';
import { RootModule } from './root.module';
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  // Configuration CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.useGlobalFilters(new SuperTokensExceptionFilter());

  if (process.env.NODE_ENV !== 'PRODUCTION') {
    const document = YAML.load('swagger-doc.example.yml');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document));
  }

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
