import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function createApiDocs(app: INestApplication): void {
  const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Open Source Together API')
    .setDescription('Open Source Together API')
    .setVersion('1.0')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: '/api-docs-json',
  });
}
