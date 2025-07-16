import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SuperTokensExceptionFilter } from 'supertokens-nestjs';
import supertokens from 'supertokens-node';
import { RootModule } from './root.module';

import { AllExceptionsFilter } from './libs/filters/all-exceptions.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

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

  const config = new DocumentBuilder()
    .setTitle('OpenSource Together API')
    .setDescription(
      "Documentation de l'API pour la plateforme OpenSource Together",
    )
    .setVersion('1.0')
    .addCookieAuth('sAccessToken') // pour la session SuperTokens
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap()
  .then(() => {
    console.log(`Server started at ${process.env.PORT ?? 4000}!`);
  })
  .catch((e) => {
    console.log(`Server crashed : ${e}`);
  });
