import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import { AllExceptionsFilter } from './libs/filters/all-exceptions.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '@/libs/auth';
import { setAppRef } from '@/app-context';
// import { auth } from './libs/auth';
// import { RequestHandler } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(RootModule, {
    logger: new Logger(),
    bodyParser: false, // Required for Better Auth
  });

  const expressApp = express();

  expressApp.use((req, res, next) => {
    console.log(`[GLOBAL] ${req.method} ${req.url}`);
    next();
  });

  expressApp.all('/api/auth/*splat', toNodeHandler(auth));
  expressApp.use(express.json());
  app.use(expressApp);

  app.setGlobalPrefix('v1'); // Disabled for Better Auth compatibility

  // Activation de la validation automatique des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non décorées
      forbidNonWhitelisted: true, // Lance une erreur si des propriétés non autorisées sont présentes
      transform: true, // Transforme automatiquement les types (ex: string vers number)
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('OpenSource Together API')
    .setDescription(
      "Documentation de l'API pour la plateforme OpenSource Together",
    )
    .setVersion('1.0')
    .addBearerAuth() // Pour Better Auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document);

  setAppRef(app);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap()
  .then(() => {
    Logger.log(`Server started at ${process.env.PORT ?? 4000}!`);
  })
  .catch((e) => {
    Logger.error(`Server crashed : ${e}`);
  });
