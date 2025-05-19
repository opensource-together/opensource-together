import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import { SuperTokensExceptionFilter } from 'supertokens-nestjs';
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  const document = YAML.load('swagger-doc.example.yml');

  app.useGlobalFilters(new SuperTokensExceptionFilter());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
