import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SuperTokensExceptionFilter } from 'supertokens-nestjs';
import supertokens from 'supertokens-node';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { AllExceptionsFilter } from './libs/filters/all-exceptions.filter';
import { RootModule } from './root.module';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  app.setGlobalPrefix('v1');

  // Configuration CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  // Activation de la validation automatique des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non décorées
      forbidNonWhitelisted: true, // Lance une erreur si des propriétés non autorisées sont présentes
      transform: true, // Transforme automatiquement les types (ex: string vers number)
    }),
  );

  app.useGlobalFilters(new SuperTokensExceptionFilter());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter),
    new SuperTokensExceptionFilter(),
  );

  if (process.env.NODE_ENV !== 'PRODUCTION') {
    const document: object = YAML.load('swagger-doc.example.yml') as object;
    app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(document));
  }

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap()
  .then(() => {
    console.log(`Server started !`);
  })
  .catch((e) => {
    console.log(`Server crashed : ${e}`);
  });
