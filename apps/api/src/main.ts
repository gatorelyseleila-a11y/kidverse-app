import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.enableCors({
    origin: configService.get('CORS_ORIGINS', 'http://localhost:3000').split(','),
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('KIDVERSE API')
    .setDescription('API Documentation pour l\'écosystème intelligent de gestion de garderies KIDVERSE')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Authentification et autorisation')
    .addTag('users', 'Gestion des utilisateurs')
    .addTag('centers', 'Gestion des centres')
    .addTag('children', 'Gestion des enfants')
    .addTag('staff', 'Gestion du personnel')
    .addTag('attendance', 'Gestion des présences')
    .addTag('health', 'Santé et sécurité')
    .addTag('pedagogy', 'Pédagogie et activités')
    .addTag('finance', 'Facturation et paiements')
    .addTag('blockchain', 'Services blockchain')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get('PORT', 4000);
  await app.listen(port);

  console.log(`
  🚀 KIDVERSE API is running!
  
  📍 Local:    http://localhost:${port}
  📚 Swagger:  http://localhost:${port}/api/docs
  🔗 Health:   http://localhost:${port}/api/v1/health
  
  Environment: ${configService.get('NODE_ENV', 'development')}
  `);
}

bootstrap();


